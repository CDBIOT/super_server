const Products = require('./db_products')

//API HTTP dos produtos


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


const getProductsId = async (req, res) => {
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

const getProductsBarcode = async (req, res) => {
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

const postProducts = (req, res)=>{
  const {barcode,product,marca,price,qtd} = req.body
pool.query('INSERT INTO Products (barcode,product, marca, price, qtd) VALUES ($1,$2,$3,$4,$5) RETURNING *',[id,product,marca,price,qtd],(error,results)=>{
if (error){
throw error
}
res.status(201).send(`Product inserted ${results.rows[0].id}`)
})
}


//Update
 const putProducts = (async (req, res) =>{
    const id = req.params.id
    const {barcode,product, marca, price, qtd } = req.body
    const prod = {barcode,product, marca, price, qtd}
    try{
     const updateProd = await Products.updateOne({id: id},prod);
   
     res.status(200).json( " mensagem: 'Correção executada'",temps);
    }catch(error){
    res.status(500).json({error: error})
    }  
})

 //Delete
const deleteProducts = (async (req, res) => {
    const id= req.params.id
    //temps.remove({id: req.body.id})
    try{
    await Products.deleteOne({_id: id}) 
        return res.json({
            message: "Artigo apagado com sucesso!",
            id
            })
    }catch(error){
         return res.status(400).json({
        message: "Error: Artigo não foi apagado com sucesso!"
    })}
})
    

module.exports={
    getProducts,
    getProductsId,
    getProductsBarcode,
    postProducts,
    putProducts,
    deleteProducts


}