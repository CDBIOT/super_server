const express = require('express');
const app = express();
const route = express.Router("./rotas_temps");
require('dotenv').config()
const Temps = require('../temps')
const db_atlas = require('../db_atlas')
app.use (route)

const cors = require('cors')

app.use(cors({origin: 'https://iot-seven.vercel.app'}));

app.use((req,res,next) => {
    
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Header",'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.setHeader('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        res.status(200).send({})
    }
    console.log("Cors habilitado");
    
   next()
   })
//Read
if(process.env.NODE_ENV == "production"){

    module.exports = {
    //MONGODB_URI: process.env.MONGODB_URI
    
    MONGODB_URI: 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@cluster0.mvho6.mongodb.net/'
    +process.env.DB_NAME+'?retryWrites=true&w=majority'
    },
    {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }
    }else{
    module.exports ={MONGODB_URI: "mongodb+srv://cdb:abcdeF12345@cluster0.mvho6.mongodb.net/test"},
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
        }
    }


app.get('/', (req, res) =>{
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
            temp: temp,
            local: local,
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
    
const PORT = process.env.PORT || 4000;

    app.listen(PORT,()=>{
        console.log("Servidor Rodando" + `${PORT}`);
        })
