
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

module.exports = {
    getCaixa,
    abrirCaixa
};