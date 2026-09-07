// rotas_cardapio.js
const Cardapio = require('./db_cardapio');

// GET /cardapio
const getCardapio = async (req, res) => {
  try {
    const itens = await Cardapio.getCardapio();
    res.status(200).json(itens);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Erro ao buscar cardápio'
    });
  }
};

// POST /cardapio
const postCardapio = async (req, res) => {
  try {
    const { categoria, nome, preco } = req.body;
    if (!categoria || !nome || preco === undefined || preco === null) {
      return res.status(400).json({ error: 'categoria, nome e preco são obrigatórios' });
    }
    const item = await Cardapio.postCardapio(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Erro ao criar item do cardápio'
    });
  }
};

module.exports = {
  getCardapio,
  postCardapio
};
