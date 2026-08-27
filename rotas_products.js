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

const postProducts = async (req, res)=>{
    try{
        const product = (req.body);
        const resultado =  await Products.postProducts();
        
        res.status(201).send(`Product inserted ${resultado}`)
    }
    catch(error){  
        res.status(500).json({
            error: 'Erro ao registrar Produto'
        })
    }
}




// //Update
//  const putProducts = (async (req, res) =>{

//     try{
//     const updateProduct = req.body
//      res.status(200).json( " mensagem: 'Correção executada'",temps);
//     }catch(error){
//     res.status(500).json({error: error})
//     }  
// })

//  //Delete
// const deleteProducts = (async (req, res) => {
//     const id= req.params.id
//     //temps.remove({id: req.body.id})
//     try{
//     await Products.deleteOne({_id: id}) 
//         return res.json({
//             message: "Artigo apagado com sucesso!",
//             id
//             })
//     }catch(error){
//          return res.status(400).json({
//         message: "Error: Artigo não foi apagado com sucesso!"
//     })}
// })
    

module.exports={
    getProducts,
    getProductsId,
    getProductsBarcode,
    postProducts,
    // putProducts,
    // deleteProducts


}