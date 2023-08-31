const express = require ('express');
const app = express();
const mongoose = require('mongoose')
const route = express.Router("../rotas_products,../rotas_user");
const Person = require('../db_users')
const Products = require('../db_products')
const Sales = require("../db_sales")
const db = require('../db_atlas')

require('dotenv').config()
app.use (route)
const cors = require('cors')

route.use(cors());

route.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", 'https://supervercel.vercel.app');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, X-Content-Type-Options:nosniff, Accept,Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    console.log('Cors habilitado')
    next();
});

route.get('/', (req, res) =>{
        res.json({
            status: true,
           // bd_status: {bd_status},
            message: "Backend Super_server ok!"

        })
})

//Read 
route.get('/user', async (req, res) =>{

    try{
        const people = await Person.find()
        return res.status(200).json({people})
    }catch(error){
        res.status(500).json({error: error})
    }  
})

//Read
route.get('/products', async (req, res) =>{
    try{
       const products = await Products.find()
        res.status(200).json({products})
    }catch(error){
        res.status(500).json({error: error})
    }  
})

//Read
route.get('/sales', async (req, res) =>{
    try{
       const sales = await Sales.find()
        res.status(200).json({sales})
    }catch(error){
        res.status(500).json({error: error})
    }  
})
    
 //Create
route.post('/user', async (req, res) =>{
    const {user_id, nome, email, senha } = req.body
    const person = {
        user_id, nome, email, senha
                    }
    try{
        await Person.create(person)
        res.status(201).json({message: "Pessoa inserida com sucesso"})
    }catch(error){
        res.status(500).json({error: error})
    }  
})

 //Create product
 route.post('/products', async (req, res) =>{
    const {product, marca, price, qtd } = req.body
       // const products = req.params
    const products = {product, marca, price, qtd}
    const create_product = new Products(req.body);
    //temps.save()
        try{
            await Products.create(Products)
            //temps.save()
            console.log(products)
            res.status(201).json({message: "Product inserted"})
            }catch(error){
            res.status(500).json({error: error})
        }  
    })
    
    
route.post('/products',async(req, res) =>{
    const  produto = {
    //Utiliza as inf do form html
      nome: req.body.nome,
      preco: req.body.preco
    }
    res.status(201).send({
    mensagem: 'Inserted',
    produtoCriado: produto
    })
  });
  
app.use('/', express.static(__dirname + '/'))
    
app.get("/index.html",function(req,res){
    res.sendFile(__dirname + "/index.html");
});
    
const PORT = process.env.PORT || 4000;

    app.listen(PORT,()=>{
        console.log("Server Running => Port: " + `${PORT}`);
        })
