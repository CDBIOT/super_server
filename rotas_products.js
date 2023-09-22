const express = require('express');
const routers = express.Router();
const Products = require('./db_products')


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
    const products = {product, marca, price, qtd}
    //const create = new Products(req.body);
    //temps.save()
        try{
            await Products.create(products)
            //temps.save()
            console.log(products)
            res.status(201).json({message: "Product inserted"})
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
    await Products.deleteOne({id: id}) 
        return res.json({
            message: "Artigo apagado com sucesso!"
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