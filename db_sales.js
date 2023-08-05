const mongoose = require('mongoose')

//Model Temperaturas Dia Mes Ano

const Sales = mongoose.model('Sales',{
    sales_id: Number,
    qtd: Number,
    total: Number
})

module.exports = Sales








