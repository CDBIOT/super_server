// db_pedidos.js
const pool = require('./db_pg_connect');

const STATUS_VALIDOS = ['recebido', 'preparando', 'pronto', 'entregue'];

const getPedidos = async () => {
  const pedidos = await pool.query('SELECT * FROM pedidos ORDER BY id DESC');
  const itensResult = await pool.query('SELECT * FROM pedidos_itens ORDER BY id');

  const itensPorPedido = {};
  for (const item of itensResult.rows) {
    if (!itensPorPedido[item.pedido_id]) itensPorPedido[item.pedido_id] = [];
    itensPorPedido[item.pedido_id].push(item);
  }

  return pedidos.rows.map((p) => ({ ...p, itens: itensPorPedido[p.id] || [] }));
};

const getPedidoPorId = async (id) => {
  const pedido = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);
  if (pedido.rows.length === 0) {
    const err = new Error('Pedido não encontrado');
    err.status = 404;
    throw err;
  }
  const itens = await pool.query('SELECT * FROM pedidos_itens WHERE pedido_id = $1', [id]);
  return { ...pedido.rows[0], itens: itens.rows };
};

// O preço de cada item é sempre lido do banco (cardapio_itens) — nunca confia no valor enviado pelo cliente.
const postPedidos = async (pedido) => {
  const { cliente_nome, telefone, tipo_entrega, endereco, forma_pagamento, observacoes, itens } = pedido;

  if (!cliente_nome || !String(cliente_nome).trim()) {
    const err = new Error('cliente_nome é obrigatório');
    err.status = 400;
    throw err;
  }
  if (!Array.isArray(itens) || itens.length === 0) {
    const err = new Error('O pedido precisa ter ao menos um item');
    err.status = 400;
    throw err;
  }
  if (tipo_entrega === 'entrega' && (!endereco || !String(endereco).trim())) {
    const err = new Error('endereco é obrigatório quando tipo_entrega é "entrega"');
    err.status = 400;
    throw err;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let total = 0;
    const itensResolvidos = [];

    for (const entrada of itens) {
      const itemResult = await client.query(
        'SELECT * FROM cardapio_itens WHERE id = $1 AND ativo = true',
        [entrada.id]
      );
      if (itemResult.rows.length === 0) {
        const err = new Error(`Item de id ${entrada.id} não existe no cardápio`);
        err.status = 400;
        throw err;
      }
      const item = itemResult.rows[0];
      const quantidade = Math.max(1, parseInt(entrada.quantidade, 10) || 1);
      total += Number(item.preco) * quantidade;
      itensResolvidos.push({ id: item.id, nome: item.nome, preco: item.preco, quantidade });
    }

    const pedidoResult = await client.query(
      `INSERT INTO pedidos (cliente_nome, telefone, tipo_entrega, endereco, forma_pagamento, observacoes, total, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'recebido')
       RETURNING *`,
      [
        String(cliente_nome).trim(),
        telefone || null,
        tipo_entrega === 'entrega' ? 'entrega' : 'retirada',
        endereco || null,
        forma_pagamento || null,
        observacoes || null,
        total
      ]
    );
    const pedidoCriado = pedidoResult.rows[0];

    for (const item of itensResolvidos) {
      await client.query(
        'INSERT INTO pedidos_itens (pedido_id, cardapio_item_id, nome, preco, quantidade) VALUES ($1, $2, $3, $4, $5)',
        [pedidoCriado.id, item.id, item.nome, item.preco, item.quantidade]
      );
    }

    await client.query('COMMIT');
    return { ...pedidoCriado, itens: itensResolvidos };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const patchStatusPedido = async (id, status) => {
  if (!STATUS_VALIDOS.includes(status)) {
    const err = new Error(`status inválido. Use um de: ${STATUS_VALIDOS.join(', ')}`);
    err.status = 400;
    throw err;
  }
  const results = await pool.query('UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
  if (results.rows.length === 0) {
    const err = new Error('Pedido não encontrado');
    err.status = 404;
    throw err;
  }
  return results.rows[0];
};

module.exports = {
  getPedidos,
  getPedidoPorId,
  postPedidos,
  patchStatusPedido
};
