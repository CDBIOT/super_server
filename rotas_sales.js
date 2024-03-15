const express = require('express');
const Sales = require("./db_sales")


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
        const sales = await Sales.find()
         res.status(200).json({sales})
     }catch(error){
         res.status(500).json({error: error})
     }  

  });

const postVendas = (async(req, res) =>{
    const  venda = {product,marca,price,qtd,total}=req.body
    try{
        await Sales.create(venda)
        res.status(201).json({message: "Sale inserted"})
        console.log(product)
    }catch(error){
        res.status(500).json({error: error})
    }
})

    
module.exports =  {
    getSales,
    getVendas,
    postVendas

}