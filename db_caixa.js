
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


// Abrir caixa
const abrirCaixa = async (dados) => {

    const {
        usuario_id,
        valor_inicial
    } = dados;

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


module.exports = {
    getCaixa,
    abrirCaixa
};