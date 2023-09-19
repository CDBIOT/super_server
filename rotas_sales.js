const express = require('express');
const rotas = express.Router();

//Read
const getSales = (async (req, res) =>{
    try{
       const sales = await Sales.find()
        res.status(200).json({sales})
    }catch(error){
        res.status(500).json({error: error})
    }  
})

const getVendas = (async(req, res) =>{
    
    try{
        const temps = await Sales.find()
         res.status(200).json({sales})
     }catch(error){
         res.status(500).json({error: error})
     }  

  });

const postVendas = (async(req, res) =>{
    const  produto = {
       nome: req.body.nome,
       preco: req.body.preco
    }
    res.status(201).send({
    mensagem: 'Venda Cadastrada',
    produtoCriado: produto
    })
  });
    
module.exports =  {
    getSales,
    getVendas,
    postVendas

}