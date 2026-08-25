const Sales = require("./db_sales")
const Products = require('./db_products');


//API HTTP dos vendas

const getProducts = async (req, res) => {
    try {
        const products = await Products.getProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Erro ao buscar produtos'
        });
    }
};


//Read
const getSales = async (req, res) =>{
    try{ 
         const sales = await Sales.getSales();
        res.status(200).json(sales);

    }catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Erro ao buscar produtos'
            });
}
}


const postSales = (async(req, res) =>{
    try{ 
    const  venda = req.body;
    const resultado = await Sales.postVendas(venda)

        res.status(201).json(resultado);
     }catch(error){
        console.error(error);
        res.status(500).json({
            error: 'Erro ao buscar produtos'
            });
        }
})

    
module.exports =  {
    getSales,
    postSales
}