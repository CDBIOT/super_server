

const express = require('express');
const app = express();
const mongoose = require('mongoose')
const route = express.Router("./rotas_temps, ./mqtt");
const awsServerlessExpress = require('aws-serverless-express');
//const app = require('./app');

/**
 * @type {import('http').Server}
 */
const server = awsServerlessExpress.createServer(app);

require('dotenv').config()
//const Temps = require('../../..models/temps')
//const User = require('../../..models/user')
app.use (route)

    

//  //Create temps
// module.exports.create = (event,context,callback) =>{
//     const {local, temperatura, dia, mes, ano } = req.body
//      //const temps = req.params
//         const temps = {local,temperatura, dia, mes, ano}
//          const create_temp = new Temps(req.body);
//          //temps.save()
//          try{
//             Temps.create(temps)
//              temps.save()
//                  console.log(temps)
//                  res.status(201).json({message: "Temperatura inserida"})
//                  }catch(error){
//                  res.status(500).json({error: error})
//              }  
// }

// //Read
// module.exports.create = (event,context,callback) =>{
//  routers.get('/vendas', async (req, res) =>{
//          try{
//             const temps = await Temps.find()
//              res.status(200).json({temps})
//          }catch(error){
//              res.status(500).json({error: error})
//          }  
//      })
// }

// module.exports.create = (event,context,callback) =>{
//     context.callbackWaisForEmptyEventLoop = false;
//     return connectToDatabase()
//     .then(() => 
//     User.create(JSON.parse(event.body)))
//     .then(user => callback(null,{
//         statusCode: 200,
//         body: JSON.stringify(user)
//     }))
//     .catch(err => callback(null, {
//         statusCode: err.statusCode || 500,
//         headers:{ 'Comtemt-Type': 'text/plain'},
//         body: 'Could not create the user.'
   //  }));

 //}
 
module.exports.get('/vendas',async(req, res) =>{
    
    res.status(201).send({
    mensagem: 'Vendas Cadastradas',
    })
  });

  module.exports.post('/vendas',async(req, res) =>{
    const  produto = {
       nome: req.body.nome,
       preco: req.body.preco
    }
    res.status(201).send({
    mensagem: 'Venda Cadastrada',
    produtoCriado: produto
    })
  });
    
module.exports.get('/products',async(req, res) =>{
    
    res.status(201).send({
    mensagem: 'Lista de Produtos Cadastrados',
    })
  });

module.exports.post('/products',async(req, res) =>{
     const  produto = {
        nome: req.body.nome,
        preco: req.body.preco
     }
     res.status(201).send({
     mensagem: 'inserido',
     produtoCriado: produto
     })
   });
  

/*
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {

    console.log(`EVENT: ${JSON.stringify(event)}`);
    const customerId = event.pathParameters.customerId;
    const customer = {'customerID': customerId, 'customerName': "CustomerN"+ customerId};
    return {
        statusCode: 200,
     headers: {
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Headers": "*",
         "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, X-Content-Type-Options:nosniff, Accept,Authorization",
         "Access-Control-Allow-Methods":"GET, POST, PUT, PATCH, DELETE, OPTIONS"
     }, 
        body: JSON.stringify(customer),
    };
};

  