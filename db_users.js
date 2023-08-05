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