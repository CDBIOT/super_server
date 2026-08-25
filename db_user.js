const mongoose = require('mongoose')

//Model User
//Definindo o model
//Tabela User
const Person = mongoose.model('Person',{
    nome: String  ,
    email: String,
    senha: String,
})

module.exports = Person


//Model Products

const Products = mongoose.model('Products',{
    //_id: Number,
    product: String  ,
    marca: String,
    price: Number,
    qtd: Number
})

module.exports = Products



