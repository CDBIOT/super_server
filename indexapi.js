

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
app.use (route)

    
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

  