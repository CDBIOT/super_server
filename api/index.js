const express = require('express');
const app = express();
const mongoose = require('mongoose')
const route = express.Router("./rotas_temps, ./mqtt");
const Person = require('../user')

require('dotenv').config()
//const Temps = require('../temps')
app.use (route)

//Read
//if(process.env.NODE_ENV == "production"){
   // module.exports = 
   //{
    const MONGODB_URI= 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@cluster0.mvho6.mongodb.net/'
    +process.env.DB_NAME+'?retryWrites=true&w=majority'
   // },
   //{
    useNewUrlParser: true,
    //useUnifiedTopology: true
    //}
    //}

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
        
const cors = require('cors')

route.use(cors());

route.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", 'https://iot-seven.vercel.app');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, X-Content-Type-Options:nosniff, Accept,Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    console.log('Cors habilitado')
    next();
});

route.get('/', (req, res) =>{
        res.json({
            sucess: true,
            message: "Sucesso na conexão"
        })
})

//Read 
route.get('/user',checkToken, async (req, res) =>{

    try{
        const people = await Person.find()
        return res.status(422).json({people})
    }catch(error){
        res.status(500).json({error: error})
    }  
})

//Read
route.get('/products', async (req, res) =>{
    try{
       const temps = await Temps.find()
        res.status(200).json({temps})
    }catch(error){
        res.status(500).json({ message: "No Sucess!"})
    }  
})

    
 //Create
route.post('/user', async (req, res) =>{
    const {nome, sobrenome, idade } = req.body
    const person = {
        nome,sobrenome,idade
                    }
    try{
        await Person.create(person)
        res.status(201).json({message: "Pessoa inserida com sucesso"})
    }catch(error){
        res.status(500).json({error: error})
    }  
})

 //Create temps
 route.post('/products', async (req, res) =>{
    const {local, temperatura, dia, mes, ano } = req.body
       // const temps = req.params
    const temps = {local,temperatura, dia, mes, ano}
    const create_temp = new Temps(req.body);
    //temps.save()
        try{
            await Temps.create(temps)
            //temps.save()
            console.log(temps)
            res.status(201).json({message: "Temperatura inserida"})
            }catch(error){
            res.status(500).json({error: error})
        }  
    })
    
    
route.post('/products',async(req, res) =>{
    const  produto = {
    //Utiliza as inf do form html
      nome: req.body.nome,
      preco: req.body.preco
    }
    res.status(201).send({
    mensagem: 'inserido',
    produtoCriado: produto
    })
  });
    
    
const PORT = process.env.PORT || 4000;

    app.listen(PORT,()=>{
        console.log("Servidor Rodando" + `${PORT}`);
        })
