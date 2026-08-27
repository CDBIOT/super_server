
const pool = require('./db_pg_connect');


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
    } = dados;


    if (usuario_id === undefined || usuario_id === null) {
        throw new Error('Usuário é obrigatório');
    }

    if (valor_inicial === undefined || valor_inicial === null) {
        throw new Error('Valor inicial do caixa é obrigatório');
    }

    // Verifica se já existe um caixa aberto
    const caixaAberto = await pool.query(`
        SELECT *
        FROM caixa
        WHERE status = 'ABERTO'
        LIMIT 1
    `);

    if (caixaAberto.rows.length > 0) {
        throw new Error('Já existe um caixa aberto');
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
        valor_inicial
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

module.exports = {
    getCaixa,
    getCaixaAberto,
    abrirCaixa
};