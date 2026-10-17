const pool = require('./db_pg_connect');


//SQL de Produtos

const erro = (status, message) => {
    const e = new Error(message);
    e.status = status;
    return e;
};

// Códigos de varejo (EAN-8, UPC-A, EAN-13, GTIN-14) são numéricos
const BARCODE_VALIDO = /^\d{8,14}$/;

// Valida e normaliza os campos de um produto.
// parcial = true (PUT): só valida os campos enviados.
const validarProduto = (dados, { parcial = false } = {}) => {
    const d = dados || {};
    const out = {};

    if (!parcial || d.product !== undefined) {
        const nome = String(d.product ?? '').trim();
        if (!nome) throw erro(400, 'O nome do produto é obrigatório');
        out.product = nome;
    }

    if (!parcial || d.marca !== undefined) {
        out.marca = String(d.marca ?? '').trim();
    }

    if (!parcial || d.price !== undefined) {
        const preco = Number(String(d.price ?? '').replace(',', '.'));
        if (d.price === undefined || d.price === null || String(d.price).trim() === '' || !Number.isFinite(preco) || preco < 0) {
            throw erro(400, 'O preço deve ser um número maior ou igual a zero');
        }
        out.price = Math.round(preco * 100) / 100;
    }

    if (!parcial || d.qtd !== undefined) {
        const qtd = Number(d.qtd);
        if (d.qtd === undefined || d.qtd === null || String(d.qtd).trim() === '' || !Number.isInteger(qtd) || qtd < 0) {
            throw erro(400, 'A quantidade deve ser um número inteiro maior ou igual a zero');
        }
        out.qtd = qtd;
    }

    if (!parcial || d.barcode !== undefined) {
        const codigo = String(d.barcode ?? '').trim();
        if (codigo === '') {
            out.barcode = null; // sem código (ou limpar o código existente)
        } else if (!BARCODE_VALIDO.test(codigo)) {
            throw erro(400, 'Código de barras inválido: use de 8 a 14 dígitos');
        } else {
            out.barcode = codigo;
        }
    }

    return out;
};

// Garante que nenhum outro produto use o mesmo código de barras
const checarBarcodeLivre = async (executor, barcode, idIgnorado) => {
    if (!barcode) return;
    const r = await executor.query(
        'SELECT id, product FROM products WHERE barcode = $1 AND id <> $2 LIMIT 1',
        [barcode, idIgnorado ?? 0]
    );
    if (r.rows.length > 0) {
        throw erro(409, `Este código de barras já está cadastrado no produto "${r.rows[0].product}" (id ${r.rows[0].id})`);
    }
};

const getProducts = async () => {
        const results = await pool.query(
            'SELECT * FROM products ORDER BY id'
        );
        return results.rows;
};


const getProductsId = async (id) => {
    const results = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [id]
        );
        return results.rows[0] || null;
};

// Busca um produto pelo código de barras (somente leitura, query parametrizada)
const getProductsBarcode = async (barcode) => {
   const results = await pool.query(
            'SELECT id, product, marca, price, qtd, barcode FROM products WHERE barcode = $1 LIMIT 1',
            [barcode]
        );
        return results.rows[0] || null;
};


// Cadastro de produto novo
const postProducts = async (dados) => {
    const p = validarProduto(dados);
    await checarBarcodeLivre(pool, p.barcode, null);

    const results = await pool.query(
        'INSERT INTO products (barcode, product, marca, price, qtd) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [p.barcode, p.product, p.marca, p.price, p.qtd]
    );
    return results.rows[0];
};


// Atualização parcial: só altera os campos enviados (ex.: só o barcode)
const putProducts = async (id, dados) => {
    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) throw erro(400, 'Id de produto inválido');

    const campos = validarProduto(dados, { parcial: true });
    const chaves = Object.keys(campos);
    if (chaves.length === 0) throw erro(400, 'Nenhum campo para atualizar');

    const atual = await pool.query('SELECT id FROM products WHERE id = $1', [idNum]);
    if (atual.rows.length === 0) throw erro(404, 'Produto não encontrado');

    if (campos.barcode !== undefined) {
        await checarBarcodeLivre(pool, campos.barcode, idNum);
    }

    // Os nomes das colunas vêm de validarProduto (lista fixa), nunca do cliente
    const sets = chaves.map((c, i) => `${c} = $${i + 1}`).join(', ');
    const valores = chaves.map((c) => campos[c]);
    const results = await pool.query(
        `UPDATE products SET ${sets} WHERE id = $${chaves.length + 1} RETURNING *`,
        [...valores, idNum]
    );
    return results.rows[0];
};


module.exports= {
                getProducts,
                getProductsId,
                getProductsBarcode,
                postProducts,
                putProducts,
                validarProduto
                }
