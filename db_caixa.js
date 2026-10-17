
const pool = require('./db_pg_connect');

const erro = (status, message) => {
    const e = new Error(message);
    e.status = status;
    return e;
};


// Buscar caixas
const getCaixa = async () => {

    const result = await pool.query(`
        SELECT *
        FROM caixa
        ORDER BY caixa_id DESC
    `);

    return result.rows;
};

const abrirCaixa = async (dados) => {

    const {
        usuario_id,
        valor_inicial
    } = dados || {};

    if (usuario_id === undefined || usuario_id === null || String(usuario_id).trim() === '') {
        throw erro(400, 'Usuário é obrigatório');
    }

    const valor = Number(String(valor_inicial ?? '').replace(',', '.'));
    if (valor_inicial === undefined || valor_inicial === null || String(valor_inicial).trim() === '' || !Number.isFinite(valor) || valor < 0) {
        throw erro(400, 'Valor inicial do caixa deve ser um número maior ou igual a zero');
    }

    // Verifica se já existe um caixa aberto
    const caixaAberto = await pool.query(`
        SELECT *
        FROM caixa
        WHERE status = 'ABERTO'
        LIMIT 1
    `);

    if (caixaAberto.rows.length > 0) {
        throw erro(409, 'Já existe um caixa aberto');
    }

    // Abre um novo caixa
    const result = await pool.query(`
        INSERT INTO caixa
        (
            usuario_id,
            data_abertura,
            valor_inicial,
            status
        )
        VALUES ($1, NOW(), $2, 'ABERTO')
        RETURNING *
    `, [
        usuario_id,
        valor
    ]);

    return result.rows[0];
};

const getCaixaAberto = async () => {

    const result = await pool.query(`
        SELECT *
        FROM caixa
        WHERE status = 'ABERTO'
        LIMIT 1
    `);

    return result.rows[0] || null;
};

// Fecha o caixa aberto e devolve o resumo (total e quantidade de vendas do período).
// valor_final = valor_inicial + soma das vendas do caixa.
const fecharCaixa = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // FOR UPDATE espera qualquer venda em andamento terminar (a venda usa FOR SHARE)
        const aberto = await client.query(
            "SELECT * FROM caixa WHERE status = 'ABERTO' ORDER BY caixa_id DESC LIMIT 1 FOR UPDATE"
        );
        if (aberto.rows.length === 0) {
            throw erro(409, 'Nenhum caixa aberto');
        }
        const caixa = aberto.rows[0];

        const soma = await client.query(
            'SELECT COALESCE(SUM(total), 0) AS total_vendas, COUNT(*) AS qtd_vendas FROM vendas WHERE caixa_id = $1',
            [caixa.caixa_id]
        );
        const totalVendas = Number(soma.rows[0].total_vendas);
        const qtdVendas = Number(soma.rows[0].qtd_vendas);
        const valorFinal = Math.round((Number(caixa.valor_inicial || 0) + totalVendas) * 100) / 100;

        const fechado = await client.query(
            "UPDATE caixa SET status = 'FECHADO', data_fechamento = NOW(), valor_final = $1 WHERE caixa_id = $2 RETURNING *",
            [valorFinal, caixa.caixa_id]
        );

        await client.query('COMMIT');
        return { ...fechado.rows[0], total_vendas: totalVendas, qtd_vendas: qtdVendas };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    getCaixa,
    getCaixaAberto,
    abrirCaixa,
    fecharCaixa
};
