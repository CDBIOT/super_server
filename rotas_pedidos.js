// rotas_pedidos.js
const Pedidos = require('./db_pedidos');

// GET /pedidos
const getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedidos.getPedidos();
    res.status(200).json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Erro ao buscar pedidos'
    });
  }
};

// GET /pedidos/:id
const getPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedidos.getPedidoPorId(req.params.id);
    res.status(200).json(pedido);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      error: error.status ? error.message : 'Erro ao buscar pedido'
    });
  }
};

// POST /pedidos
const postPedidos = async (req, res) => {
  try {
    const pedido = await Pedidos.postPedidos(req.body);
    res.status(201).json(pedido);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      error: error.status ? error.message : 'Erro ao criar pedido'
    });
  }
};

// PATCH /pedidos/:id
const patchStatusPedido = async (req, res) => {
  try {
    const pedido = await Pedidos.patchStatusPedido(req.params.id, req.body.status);
    res.status(200).json(pedido);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      error: error.status ? error.message : 'Erro ao atualizar status'
    });
  }
};

module.exports = {
  getPedidos,
  getPedidoPorId,
  postPedidos,
  patchStatusPedido
};
