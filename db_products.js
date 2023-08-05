const mongoose = require('mongoose')

//Model Temperaturas Dia Mes Ano

const Products = mongoose.model('Products',{
    //_id: Number,
    product: String  ,
    marca: String,
    price: Number,
    qtd: Number
})

module.exports = Products








