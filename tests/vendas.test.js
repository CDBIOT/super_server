// Testes do backend de produtos, vendas e caixa.
// Rode com:  node tests/vendas.test.js
//
// NÃO toca no banco real: troca db_pg_connect por um banco falso em memória que
// entende BEGIN/COMMIT/ROLLBACK (o ROLLBACK restaura o estado), para provar que
// uma venda que falha no meio não deixa estoque pela metade.
const path = require('path');
const assert = require('assert');

const raiz = path.join(__dirname, '..');

// ---------- banco falso ----------
let estado;
let snapshot = null;
let conexoesAbertas = 0;
let conexoesLiberadas = 0;

const clone = (o) => JSON.parse(JSON.stringify(o));

function resetar() {
  estado = {
    products: [
      { id: 1, product: 'Biscoito', marca: 'Marca A', price: '5.00', qtd: 50, barcode: null },
      { id: 2, product: 'Pão', marca: 'Marca B', price: '1.10', qtd: 120, barcode: '7891000100103' },
      { id: 3, product: 'Uva', marca: 'Marca C', price: '9.99', qtd: 2, barcode: null },
    ],
    caixa: [{ caixa_id: 7, usuario_id: 1, valor_inicial: '100.00', status: 'ABERTO' }],
    vendas: [],
    proxVendaId: 1,
    proxProdutoId: 10,
  };
  snapshot = null;
  conexoesAbertas = 0;
  conexoesLiberadas = 0;
}

async function query(sql, p = []) {
  const s = sql.replace(/\s+/g, ' ').trim();
  const ok = (rows = []) => ({ rows });

  if (s === 'BEGIN') { snapshot = clone(estado); return ok(); }
  if (s === 'COMMIT') { snapshot = null; return ok(); }
  if (s === 'ROLLBACK') { if (snapshot) { estado = snapshot; snapshot = null; } return ok(); }

  // --- caixa ---
  if (/^SELECT (caixa_id|\*) FROM caixa WHERE status = 'ABERTO'/.test(s)) {
    return ok(clone(estado.caixa.filter((c) => c.status === 'ABERTO')));
  }
  if (s.startsWith('INSERT INTO caixa')) {
    const novo = { caixa_id: 8, usuario_id: p[0], valor_inicial: String(p[1]), status: 'ABERTO' };
    estado.caixa.push(novo);
    return ok([clone(novo)]);
  }
  if (s.startsWith("UPDATE caixa SET status = 'FECHADO'")) {
    const c = estado.caixa.find((x) => x.caixa_id === p[1]);
    c.status = 'FECHADO';
    c.valor_final = p[0];
    return ok([clone(c)]);
  }

  // --- vendas ---
  if (s.startsWith('SELECT COALESCE(SUM(total), 0) AS total_vendas')) {
    const v = estado.vendas.filter((x) => x.caixa_id === p[0]);
    return ok([{ total_vendas: String(v.reduce((a, x) => a + x.total, 0)), qtd_vendas: String(v.length) }]);
  }
  if (s.startsWith('INSERT INTO vendas')) {
    const nova = { vendas_id: estado.proxVendaId++, caixa_id: p[0], itens: p[1], total: p[2], forma_pagamento: p[3] };
    estado.vendas.push(nova);
    return ok([clone(nova)]);
  }

  // --- produtos ---
  if (s === 'SELECT id, product, marca, price, qtd, barcode FROM products WHERE id = $1 FOR UPDATE') {
    return ok(clone(estado.products.filter((x) => x.id === p[0])));
  }
  if (s === 'UPDATE products SET qtd = qtd - $1 WHERE id = $2') {
    estado.products.find((x) => x.id === p[1]).qtd -= p[0];
    return ok();
  }
  if (s === 'SELECT id, product FROM products WHERE barcode = $1 AND id <> $2 LIMIT 1') {
    return ok(clone(estado.products.filter((x) => x.barcode === p[0] && x.id !== p[1]).slice(0, 1)));
  }
  if (s.startsWith('INSERT INTO products')) {
    const novo = { id: estado.proxProdutoId++, barcode: p[0], product: p[1], marca: p[2], price: String(p[3]), qtd: p[4] };
    estado.products.push(novo);
    return ok([clone(novo)]);
  }
  if (s === 'SELECT id FROM products WHERE id = $1') {
    return ok(clone(estado.products.filter((x) => x.id === p[0]).map((x) => ({ id: x.id }))));
  }
  const upd = s.match(/^UPDATE products SET (.+) WHERE id = \$(\d+) RETURNING \*$/);
  if (upd) {
    const colunas = upd[1].split(', ').map((x) => x.split(' = ')[0]);
    const alvo = estado.products.find((x) => x.id === p[p.length - 1]);
    colunas.forEach((col, i) => { alvo[col] = p[i]; });
    return ok([clone(alvo)]);
  }
  if (s === 'SELECT id, product, marca, price, qtd, barcode FROM products WHERE barcode = $1 LIMIT 1') {
    return ok(clone(estado.products.filter((x) => x.barcode === p[0]).slice(0, 1)));
  }

  throw new Error('SQL não previsto no teste: ' + s);
}

const poolFalso = {
  query,
  connect: async () => {
    conexoesAbertas++;
    return { query, release: () => { conexoesLiberadas++; } };
  },
};

const caminhoDb = path.join(raiz, 'db_pg_connect.js');
require.cache[caminhoDb] = { id: caminhoDb, filename: caminhoDb, loaded: true, exports: poolFalso };

const Products = require(path.join(raiz, 'db_products.js'));
const Sales = require(path.join(raiz, 'db_sales.js'));
const Caixa = require(path.join(raiz, 'db_caixa.js'));
const rotasSales = require(path.join(raiz, 'rotas_sales.js'));

// ---------- mini runner ----------
const testes = [];
const teste = (nome, fn) => testes.push({ nome, fn });

async function rejeita(fn, status, trecho) {
  try {
    await fn();
  } catch (e) {
    assert.strictEqual(e.status, status, `status esperado ${status}, veio ${e.status} (${e.message})`);
    if (trecho) assert.ok(e.message.includes(trecho), `mensagem "${e.message}" não contém "${trecho}"`);
    return;
  }
  assert.fail(`esperava erro ${status}, mas não falhou`);
}

const qtdDe = (id) => estado.products.find((x) => x.id === id).qtd;

// ---------- produtos ----------
teste('produto: validações (nome, preço, qtd, barcode)', async () => {
  await rejeita(() => Products.postProducts({ product: '  ', price: 1, qtd: 1 }), 400, 'nome');
  await rejeita(() => Products.postProducts({ product: 'X', price: -1, qtd: 1 }), 400, 'preço');
  await rejeita(() => Products.postProducts({ product: 'X', price: 'abc', qtd: 1 }), 400, 'preço');
  await rejeita(() => Products.postProducts({ product: 'X', price: 1, qtd: 1.5 }), 400, 'quantidade');
  await rejeita(() => Products.postProducts({ product: 'X', price: 1, qtd: 1, barcode: 'abc' }), 400, 'Código de barras');
  await rejeita(() => Products.postProducts({ product: 'X', price: 1, qtd: 1, barcode: '123' }), 400, 'Código de barras');
  assert.strictEqual(estado.products.length, 3, 'nada deve ser gravado');
});

teste('produto: cadastro grava barcode, aceita preço com vírgula', async () => {
  const novo = await Products.postProducts({ product: ' Arroz ', marca: 'Tio João', price: '25,90', qtd: '12', barcode: '7891234567895' });
  assert.strictEqual(novo.barcode, '7891234567895');
  assert.strictEqual(novo.product, 'Arroz');
  assert.strictEqual(novo.price, '25.9');
  assert.strictEqual(novo.qtd, 12);
});

teste('produto: barcode vazio vira NULL', async () => {
  const novo = await Products.postProducts({ product: 'Sem código', price: 2, qtd: 1, barcode: '' });
  assert.strictEqual(novo.barcode, null);
});

teste('produto: barcode duplicado -> 409', async () => {
  await rejeita(() => Products.postProducts({ product: 'Outro', price: 1, qtd: 1, barcode: '7891000100103' }), 409, 'Pão');
});

teste('produto: PUT atualiza só o barcode e preserva o resto', async () => {
  const antes = clone(estado.products[0]);
  const r = await Products.putProducts(1, { barcode: '7891234567895' });
  assert.strictEqual(r.barcode, '7891234567895');
  assert.strictEqual(r.product, antes.product);
  assert.strictEqual(r.qtd, antes.qtd);
});

teste('produto: PUT com o próprio barcode é permitido; de outro produto -> 409', async () => {
  await Products.putProducts(2, { barcode: '7891000100103' });
  await rejeita(() => Products.putProducts(1, { barcode: '7891000100103' }), 409);
});

teste('produto: PUT inexistente -> 404, vazio -> 400, id ruim -> 400', async () => {
  await rejeita(() => Products.putProducts(999, { qtd: 1 }), 404);
  await rejeita(() => Products.putProducts(1, {}), 400);
  await rejeita(() => Products.putProducts('abc', { qtd: 1 }), 400);
});

teste('produto: PUT com barcode vazio limpa o código', async () => {
  const r = await Products.putProducts(2, { barcode: '' });
  assert.strictEqual(r.barcode, null);
});

teste('produto: busca por barcode', async () => {
  const p = await Products.getProductsBarcode('7891000100103');
  assert.strictEqual(p.id, 2);
  assert.strictEqual(await Products.getProductsBarcode('7890000000000'), null);
});

// ---------- vendas ----------
teste('venda: grava, calcula total em centavos, baixa o estoque e ignora preço do cliente', async () => {
  const venda = await Sales.postSales({
    forma_pagamento: 'pix',
    items: [
      { id: 1, quantidade: 3, price: 0.01 }, // preço enviado deve ser ignorado
      { id: 2, quantidade: 2 },
    ],
  });
  assert.strictEqual(venda.total, 17.2); // 3 x 5,00 + 2 x 1,10
  assert.strictEqual(venda.caixa_id, 7);
  assert.strictEqual(venda.forma_pagamento, 'pix');
  assert.strictEqual(qtdDe(1), 47);
  assert.strictEqual(qtdDe(2), 118);
  assert.strictEqual(estado.vendas.length, 1);
  const itens = JSON.parse(venda.itens);
  assert.strictEqual(itens.length, 2);
  assert.strictEqual(itens[0].price, 5);
  assert.strictEqual(itens[0].subtotal, 15);
});

teste('venda: itens repetidos são somados', async () => {
  const venda = await Sales.postSales({ items: [{ id: 1, quantidade: 2 }, { id: 1, quantidade: 3 }] });
  assert.strictEqual(qtdDe(1), 45);
  assert.strictEqual(JSON.parse(venda.itens).length, 1);
  assert.strictEqual(venda.total, 25);
});

teste('venda: sem caixa aberto -> 409 e nada muda', async () => {
  estado.caixa[0].status = 'FECHADO';
  await rejeita(() => Sales.postSales({ items: [{ id: 1, quantidade: 1 }] }), 409, 'caixa');
  assert.strictEqual(qtdDe(1), 50);
  assert.strictEqual(estado.vendas.length, 0);
});

teste('venda: estoque insuficiente no 2º item desfaz o 1º (rollback)', async () => {
  await rejeita(() => Sales.postSales({ items: [{ id: 1, quantidade: 5 }, { id: 3, quantidade: 3 }] }), 409, 'Estoque insuficiente');
  assert.strictEqual(qtdDe(1), 50, 'o estoque do item 1 deveria voltar ao original');
  assert.strictEqual(qtdDe(3), 2);
  assert.strictEqual(estado.vendas.length, 0);
});

teste('venda: produto inexistente -> 404', async () => {
  await rejeita(() => Sales.postSales({ items: [{ id: 999, quantidade: 1 }] }), 404);
});

teste('venda: entradas inválidas -> 400 sem abrir transação', async () => {
  await rejeita(() => Sales.postSales({}), 400);
  await rejeita(() => Sales.postSales({ items: [] }), 400);
  await rejeita(() => Sales.postSales({ items: [{ id: 1, quantidade: 0 }] }), 400);
  await rejeita(() => Sales.postSales({ items: [{ id: 1, quantidade: 1.5 }] }), 400);
  await rejeita(() => Sales.postSales({ items: [{ id: 'x', quantidade: 1 }] }), 400);
  await rejeita(() => Sales.postSales({ items: [{ id: 1, quantidade: 1 }], forma_pagamento: 'cheque' }), 400);
  assert.strictEqual(conexoesAbertas, 0, 'validação deve falhar antes de abrir conexão');
});

teste('venda: toda conexão aberta é liberada (sucesso e falha)', async () => {
  await Sales.postSales({ items: [{ id: 1, quantidade: 1 }] });
  await rejeita(() => Sales.postSales({ items: [{ id: 3, quantidade: 99 }] }), 409);
  assert.strictEqual(conexoesAbertas, 2);
  assert.strictEqual(conexoesLiberadas, 2);
});

teste('rota POST /sales: 201 em sucesso, 409 com mensagem, 500 genérico em erro inesperado', async () => {
  const chamar = async (body) => {
    const res = { code: 0, body: null, status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; } };
    await rotasSales.postSales({ body }, res);
    return res;
  };
  let r = await chamar({ items: [{ id: 1, quantidade: 1 }] });
  assert.strictEqual(r.code, 201);
  r = await chamar({ items: [{ id: 3, quantidade: 99 }] });
  assert.strictEqual(r.code, 409);
  assert.ok(r.body.error.includes('Estoque insuficiente'));
  const connectOriginal = poolFalso.connect;
  poolFalso.connect = async () => { throw new Error('banco fora do ar'); };
  const silenciar = console.error; console.error = () => {};
  r = await chamar({ items: [{ id: 1, quantidade: 1 }] });
  console.error = silenciar;
  poolFalso.connect = connectOriginal;
  assert.strictEqual(r.code, 500);
  assert.strictEqual(r.body.error, 'Erro ao gerar venda'); // não vaza a mensagem interna
});

// ---------- caixa ----------
teste('caixa: fechar soma as vendas e calcula valor_final', async () => {
  await Sales.postSales({ items: [{ id: 1, quantidade: 2 }] }); // 10,00
  await Sales.postSales({ items: [{ id: 2, quantidade: 1 }] }); // 1,10
  const fechado = await Caixa.fecharCaixa();
  assert.strictEqual(fechado.status, 'FECHADO');
  assert.strictEqual(fechado.total_vendas, 11.1);
  assert.strictEqual(fechado.qtd_vendas, 2);
  assert.strictEqual(fechado.valor_final, 111.1); // 100,00 inicial + 11,10
  await rejeita(() => Caixa.fecharCaixa(), 409, 'Nenhum caixa aberto');
});

teste('caixa: abrir valida usuário e valor, e não permite dois abertos', async () => {
  await rejeita(() => Caixa.abrirCaixa({ valor_inicial: 10 }), 400, 'Usuário');
  await rejeita(() => Caixa.abrirCaixa({ usuario_id: 1, valor_inicial: -5 }), 400, 'Valor inicial');
  await rejeita(() => Caixa.abrirCaixa({ usuario_id: 1, valor_inicial: 'abc' }), 400, 'Valor inicial');
  await rejeita(() => Caixa.abrirCaixa({ usuario_id: 1, valor_inicial: 10 }), 409, 'Já existe');
  estado.caixa[0].status = 'FECHADO';
  const novo = await Caixa.abrirCaixa({ usuario_id: 1, valor_inicial: '50,5' });
  assert.strictEqual(novo.status, 'ABERTO');
  assert.strictEqual(novo.valor_inicial, '50.5');
});

// ---------- execução ----------
(async () => {
  let falhas = 0;
  for (const { nome, fn } of testes) {
    resetar();
    try {
      await fn();
      console.log('OK    ' + nome);
    } catch (e) {
      falhas++;
      console.log('FALHA ' + nome + '\n      ' + e.message);
    }
  }
  console.log(falhas ? `\n${falhas} de ${testes.length} teste(s) falharam` : `\nTodos os ${testes.length} testes passaram`);
  process.exit(falhas ? 1 : 0);
})();
