const mongoose = require('mongoose')

//Model Products

const Products = mongoose.model('Products',{
    //_id: Number,
    product: String  ,
    marca: String,
    price: Number,
    qtd: Number
})

module.exports = Products








