const express = require('express');
const app = express();
const route = express.Router("../rotas_temps");
require('dotenv').config()
const Temps = require('../temps')
app.use (route)

const cors = require('cors')

app.use(cors({origin: 'https://iot-seven.vercel.app/Graphics'}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", 'https://iot-seven.vercel.app/Graphics');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    console.log('Cors habilitado')
    next();
});
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
