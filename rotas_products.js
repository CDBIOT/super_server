const Products = require('./db_products')

//Read Products
const getProducts=(async(req, res) =>{
    try{
        const products = await Products.find()
         res.status(200).json({products})
     }catch(error){
         res.status(500).json({error: error})
     }  
   
  });

   
 //Create product
 const postProducts=(async (req, res) =>{
    const {product, marca, price, qtd } = req.body
     // const products = req.params
      const create_product = new Products(req.body);
    //temps.save()
        try{
            await Products.create(product, marca, price,qtd)
         
            Products.save()
            res.status(201).json({message: "Product inserted"})
            console.log(product)
            }catch(error){
            res.status(500).json({error: error})
        }  
    })
    

//Update
 const putProducts = (async (req, res) =>{
    const id = req.params.id
    const {product, marca, price, qtd } = req.body
    const prod = {product, marca, price, qtd}
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
    postProducts,
    putProducts,
    deleteProducts}