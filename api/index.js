const express = require ('express');
const app = express();
const route = express.Router("../rotas");
const Person = require('../db_users')
const Products = require('../db_products')
const Sales = require("../db_sales")
const db = require('../db_atlas')
//const db = require("../db_pg");
const sql = require('../db_pg')
const cors = require('cors')
//import {sql} from '../db_pg'

app.use(cors());

app.use((req,res,next) => {
    console.log("Cors habilitado");
    res.header("Access-Control-Allow-Origin","https://supervercel.vercel.app/");
    res.header("Access-Control-Allow-Header",'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        res.status(200).send({})
    }
next()
   })


route.get('/', (req, res) =>{
        res.json({
            status: true,
            message: "Backend Super_server ok!"

        })
})

//Read from postgre
route.get('/postgre', async (req, res) =>{

    try{
        //const client = await connect();
      // 
 const res = await client.query('SELECT NOW()');
        console.log(res.rows[0]);
const products = await sql.query('SELECT * FROM Products',(error,results))
        return res.status(200).json(products)
    }catch(error){
        res.status(500).json({error: error})
    }  
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
route.get('/sales', async (req, res) =>{
    try{
       const sales = await Sales.find()
        res.status(200).json({sales})
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
  
route.use('/', express.static(__dirname + '/'))
    
route.get("/index.html",function(req,res){
    res.sendFile(__dirname + "/index.html");
});
    
const PORT = process.env.PORT || 4000;
app.use (route)
    app.listen(PORT,()=>{
        console.log("Server Running => Port: " + `${PORT}`);
        })
