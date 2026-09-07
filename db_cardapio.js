// db_cardapio.js
const pool = require('./db_pg_connect');

const getCardapio = async () => {
  const results = await pool.query(
    'SELECT id, categoria, nome, descricao, preco, emoji FROM cardapio_itens ORDER BY categoria, id'
  );
  return results.rows;
};

const postCardapio = async (item) => {
  const { categoria, nome, descricao, preco, emoji } = item;
  const results = await pool.query(
    'INSERT INTO cardapio_itens (categoria, nome, descricao, preco, emoji) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [categoria, nome, descricao || null, preco, emoji || null]
  );
  return results.rows[0];
};

module.exports = {
  getCardapio,
  postCardapio
};
