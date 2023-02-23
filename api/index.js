const express = require('express');
const app = express();
const mongoose = require('mongoose')
const route = express.Router("./rotas_temps, ./mqtt");

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
route.get('/temps', async (req, res) =>{
    try{
       const temps = await Temps.find()
        res.status(200).json({temps})
    }catch(error){
        res.status(500).json({ message: "No Sucess!"})
    }  
})

route.get('/mqtt',(req, res) =>{
    try{ 
        date = new Date() 

        var vm = {
            //temp: temp,
           // local: local,
            dia: date.getDate(),   
            mes: date.getMonth() + 1,
            ano: date.getFullYear()
        }
        console.log(vm);
        //res.send(vm);
        res.status(200).json({vm})
     }catch(error){
         res.status(500).json(error)
     }  
    })
    
 //Create temps
 route.post('/temps', async (req, res) =>{
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
    
    
    
// route.use('/', express.static(__dirname + '/'))
route.use('/mqtt_node2.js', express.static("/"))

route.get("/mqtt_node2",function(req,res){
   res.sendFile(__dirname + "/mqtt_node2.js");
});

    
const PORT = process.env.PORT || 4000;

    app.listen(PORT,()=>{
        console.log("Servidor Rodando" + `${PORT}`);
        })
