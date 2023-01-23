const mongoose = require('mongoose')

//Configuração do mongoose
//mongoose.Promise = global.Promise;
//MONGODB_URI =  'mongodb+srv://'+process.env.MONGODB_URI+':'+process.env.DB_PASS+'@cluster0.mvho6.mongodb.net/'
//+process.env.DB_NAME+'?retryWrites=true&w=majority'
//const MONGODB_URI = db_atlas.MONGODB_URI
const MONGODB_URI = process.env.MONGODB_URI

//try{
mongoose.connect(MONGODB_URI).then(db => 
console.log("MongodB conectado com sucesso!", db.connection.host))

.catch((err) => {
    console.log("Houve um erro ao se conectar ao mongodB: " + err)
})

//Model Temperaturas Dia Mes Ano

const Temps = mongoose.model('Temps',{
    //_id: Number,
    local: String  ,
    temperatura: Number,
    dia: Number,
    mes: Number,
    ano: Number
})

module.exports = Temps








