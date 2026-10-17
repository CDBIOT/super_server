const pool = require ('./db_pg_connect')

//SQL de Vendas

const erro = (status, message) => {
  const e = new Error(message);
  e.status = status;
  return e;
};

const FORMAS_PAGAMENTO = ['dinheiro', 'cartao_debito', 'cartao_credito', 'pix'];

const getSales= async()=>{
const results = await pool.query(
    'SELECT * FROM vendas ORDER BY vendas_id DESC')

return results.rows;
};


// Registra uma venda. O cliente envia só { items: [{ id, quantidade }], forma_pagamento? }.
// Preço, nome e estoque vêm SEMPRE do banco (nunca confiamos no valor enviado pelo cliente).
// Tudo acontece numa transação: se qualquer item falhar, nada é gravado e o estoque não muda.
const postSales = async (dados) => {
  const { items, forma_pagamento } = dados || {};

  if (!Array.isArray(items) || items.length === 0) {
    throw erro(400, 'A venda precisa ter ao menos um item');
  }
  if (forma_pagamento != null && !FORMAS_PAGAMENTO.includes(forma_pagamento)) {
    throw erro(400, `Forma de pagamento inválida. Use: ${FORMAS_PAGAMENTO.join(', ')}`);
  }

  // Junta itens repetidos e valida id/quantidade
  const quantidadePorId = new Map();
  for (const entrada of items) {
    const id = Number(entrada && entrada.id);
    const quantidade = Number(entrada && entrada.quantidade);
    if (!Number.isInteger(id) || id <= 0) {
      throw erro(400, 'Item com id de produto inválido');
    }
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw erro(400, `Quantidade inválida para o produto ${id}`);
    }
    quantidadePorId.set(id, (quantidadePorId.get(id) || 0) + quantidade);
  }
  // Ordem fixa evita deadlock entre duas vendas simultâneas
  const ids = [...quantidadePorId.keys()].sort((a, b) => a - b);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // A venda precisa de um caixa aberto. FOR SHARE impede fechar o caixa no meio da venda.
    const caixa = await client.query(
      "SELECT caixa_id FROM caixa WHERE status = 'ABERTO' ORDER BY caixa_id DESC LIMIT 1 FOR SHARE"
    );
    if (caixa.rows.length === 0) {
      throw erro(409, 'Nenhum caixa aberto. Abra o caixa antes de vender.');
    }
    const caixa_id = caixa.rows[0].caixa_id;

    let totalCentavos = 0;
    const itens = [];

    for (const id of ids) {
      const quantidade = quantidadePorId.get(id);

      // FOR UPDATE trava a linha: duas vendas não vendem o mesmo estoque ao mesmo tempo
      const r = await client.query(
        'SELECT id, product, marca, price, qtd, barcode FROM products WHERE id = $1 FOR UPDATE',
        [id]
      );
      if (r.rows.length === 0) {
        throw erro(404, `Produto ${id} não encontrado`);
      }
      const p = r.rows[0];
      if (Number(p.qtd) < quantidade) {
        throw erro(409, `Estoque insuficiente de "${p.product}" (disponível: ${p.qtd})`);
      }

      await client.query('UPDATE products SET qtd = qtd - $1 WHERE id = $2', [quantidade, id]);

      const precoCentavos = Math.round(Number(p.price) * 100);
      totalCentavos += precoCentavos * quantidade;
      itens.push({
        id: p.id,
        product: p.product,
        marca: p.marca,
        barcode: p.barcode,
        price: precoCentavos / 100,
        quantidade,
        subtotal: (precoCentavos * quantidade) / 100,
      });
    }

    const venda = await client.query(
      'INSERT INTO vendas (caixa_id, itens, total, forma_pagamento) VALUES ($1, $2, $3, $4) RETURNING *',
      [caixa_id, JSON.stringify(itens), totalCentavos / 100, forma_pagamento || null]
    );

    await client.query('COMMIT');
    return venda.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports= {
    getSales,
    postSales
}
