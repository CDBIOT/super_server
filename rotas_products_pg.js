const Products = require('./db_products')


//Read from postgre
const getProducts = (req, res) =>{
pool.query('SELECT * FROM Products',(error,results)=>{
if (error){
   throw error
}
res.status(200).json(results.rows)
})
}

const getProductsId = (req, res) =>{
pool.query('SELECT * FROM Products',(error,results)=>{
if (error){
   throw error
}
res.status(200).json(results.rows)
})
}

const getProductsBarcode = (req, res) =>{
pool.query('SELECT * FROM Products',(error,results)=>{
if (error){
   throw error
}
res.status(200).json(results.rows)
})
}

const postProducts = (req, res)=>{
  const {id,product,marca,price,qtd} = req.body
pool.query('INSERT INTO Products (id,product, marca, price, qtd) VALUES ($1,$2,$3,$4,$5) RETURNING *',[id,product,marca,price,qtd],(error,results)=>{
if (error){
throw error
}
res.status(201).send(`Product inserted ${results.rows[0].id}`)
})
}


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
    getProductsId,
    getProductsBarcode,
    postProducts,
    putProducts,
    deleteProducts


}