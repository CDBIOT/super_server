const express = require('express');
const app = express();
const route = express.Router("./rotas_temps");
//require('dotenv').config()
const Temps = require('../temps')
app.use (route)

const cors = require('cors')

app.use(cors());

app.use((req,res,next) => {
    console.log("Cors habilitado");
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Header",'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        res.status(200).send({})
    }
    
   next()
   })
//Read

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

const PORT = process.env.PORT || 4000;

    app.listen(PORT,()=>{
        console.log("Servidor Rodando" + `${PORT}`);
        })
