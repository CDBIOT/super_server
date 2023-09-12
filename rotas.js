const express = require('express');
const rotas = express.Router();


rotas.get('/vendas',async(req, res) =>{
    
    try{
        const temps = await Sales.find()
         res.status(200).json({sales})
     }catch(error){
         res.status(500).json({error: error})
     }  

  });

 rotas.post('/vendas',async(req, res) =>{
    const  produto = {
       nome: req.body.nome,
       preco: req.body.preco
    }
    res.status(201).send({
    mensagem: 'Venda Cadastrada',
    produtoCriado: produto
    })
  });
    
module.exports =  rotas