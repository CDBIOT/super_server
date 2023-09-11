const express = require('express');
const routers = express.Router();


routers.get('/vendas',async(req, res) =>{
    
    try{
        const temps = await Sales.find()
         res.status(200).json({sales})
     }catch(error){
         res.status(500).json({error: error})
     }  

  });

 routers.post('/vendas',async(req, res) =>{
    const  produto = {
       nome: req.body.nome,
       preco: req.body.preco
    }
    res.status(201).send({
    mensagem: 'Venda Cadastrada',
    produtoCriado: produto
    })
  });
    
module.exports =  routers