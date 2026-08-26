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


const postSales = (async(req, res) =>{
    try{ 
    const  venda = req.body;
    const resultado = await Sales.postSales(venda)

        res.status(201).json(resultado);
     }catch(error){
        console.error(error);
        res.status(500).json({
            error: 'Erro ao buscar vendas'
            });
        }
})

    
module.exports =  {
    getSales,
    postSales
}