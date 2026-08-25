const express = require('express');
const Sales = require("./db_sales")


//API HTTP dos vendas


const getProductsId = (req, res) =>{
pool.query('SELECT * FROM Products',(error,results)=>{
if (error){
   throw error
}
res.status(200).json(results.rows)
})
}

const getProductsBarcode = (req, res) =>{
pool.query('SELECT * FROM Products',(error,results)=>{
if (error){
   throw error
}
res.status(200).json(results.rows)
})
}

//Read
const getSales = (async (req, res) =>{

pool.query('SELECT * FROM Sales',(error,results)=>{
if (error){
   throw error
}
res.status(200).json(results.rows)
})
})

const getVendas = (async(req, res) =>{
pool.query('SELECT * FROM Vendas',(error,results)=>{
if (error){
   throw error
}
res.status(200).json(results.rows)
})

});

const postVendas = (async(req, res) =>{
    const  venda = {product,marca,price,qtd,total}=req.body
pool.query('INSERT INTO Vendas (id,product, marca, price, qtd) VALUES ($1,$2,$3,$4,$5) RETURNING *',[id,product,marca,price,qtd],(error,results)=>{
if (error){
throw error
}
res.status(201).send(`Venda inserted ${results.rows[0].id}`)

})
})


    
module.exports =  {
    getSales,
    getVendas,
    getProductsId,
    getProductsBarcode,
    postVendas

}