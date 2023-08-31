const mongoose = require('mongoose')

//Model Sales

const Sales = mongoose.model('Sales',{
    sales_id: Number,
    qtd: Number,
    total: Number
})

module.exports = Sales








