const mongoose = require('mongoose')

//Model Sales

const Sales = mongoose.model('Sales',{
    //sales_id: Number,
    product: String,
    marca: String,
    price: Number,
    qtd: Number,
    total: Number
})

module.exports = Sales








