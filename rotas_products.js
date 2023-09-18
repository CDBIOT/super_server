const express = require('express');
const routers = express.Router();

//var fs = require('fs');

const Products = require('./db_products');


const getProducts=(async(req, res) =>{
    try{
        const temps = await Products.find()
         res.status(200).json({temps})
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
    const {local, temperatura, dia, mes, ano } = req.body
    const temps = {local, temperatura, dia, mes, ano}
    try{
     const updateTemp = await Temps.updateOne({id: id},temps);
     res.status(200).json(temps);
    }catch(error){
    res.status(500).json({error: error})
    }  
})

routers.post('/temps/:id',async(req, res) =>{
    const  id = req.params.id
    
    res.status(201).send({
    mensagem: 'inserido',
    produtoCriado: produto
    })
  });

 //Delete
routers.delete('/temps/:id', async (req, res) => {
    const id= req.params.id
    //temps.remove({id: req.body.id})
    const temps = await Temps.deleteOne({ _id: id}, (err) => {
    
    if(err) return res.status(400).json({

        error:true,
        message: "Error: Artigo não foi apagado com sucesso!"
    });
   // if(!temps){
   // res.status(422).json({message:  'Temperatura não encontrada'});
    //res.redirect('/temps')
    return res.json({

        error: false,
        message: "Artigo apagado com sucesso!"
            })
        })
    })

   // try{
    //    await Temps.deleteOne({"_id": id});
    //    res.status(200).json({message: 'Temperatura removida com sucesso'});
        //res.redirect('/temps')
   // }catch(error){
  //  res.status(500).json({error: error})
//}  
//});

module.exports={getProducts,postProducts,putProducts}