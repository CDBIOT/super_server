const Sales = require("./db_sales")


//API HTTP dos vendas



//Read
const getSales = async (req, res) =>{
    try{
         const sales = await Sales.getSales();
        res.status(200).json(sales);

    }catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Erro ao buscar vendas'
            });
}
}


// POST /sales  { items: [{ id, quantidade }], forma_pagamento? }
const postSales = (async(req, res) =>{
    try{
    const resultado = await Sales.postSales(req.body)

        res.status(201).json(resultado);
     }catch(error){
        // Erros de regra (sem caixa, sem estoque, item inválido) têm .status e mensagem clara
        if (error && error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({
            error: 'Erro ao gerar venda'
            });
        }
})


module.exports =  {
    getSales,
    postSales
}
