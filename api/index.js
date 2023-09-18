const express = require ('express');
const app = express();
const rotas_prod = require('../rotas_products')
const rotas_user = require("../rotas_user")
const Person = require('../db_users')
const Products = require('../db_products')
const Sales = require("../db_sales")
const db = require('../db_atlas')
const sql = require('../db_pg')
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
)
app.use(cors());

app.use((req,res,next) => {
    console.log("Cors habilitado");
    res.header("Access-Control-Allow-Origin",'*');
    res.header("Access-Control-Allow-Header",'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        res.status(200).send({})
    }
next()
   })


app.get('/', (req, res) =>{
        res.json({
            status: true,
            message: "Backend Super_server ok!"

        })
})

//Read from postgre
app.get('/postgre',sql.getProducts)
app.post('/postgre',sql.postProducts)


app.get ('/products',rotas_prod.getProducts)
app.post('/products',rotas_prod.postProducts)
app.put('/products/:id',rotas_prod.putProducts)
app.delete('/products/:id',rotas_prod.deleteProducts)


app.get ('/user',rotas_user.getUser)
app.post('/user',rotas_user.postUser)
app.put('/user/:id',rotas_user.CadUser)
app.delete('/user/:id',rotas_user.deleteUser)




//Read
app.get('/sales', async (req, res) =>{
    try{
       const sales = await Sales.find()
        res.status(200).json({sales})
    }catch(error){
        res.status(500).json({error: error})
    }  
})
    

app.use('/', express.static(__dirname + '/'))
    
app.get("/index.html",function(req,res){
    res.sendFile(__dirname + "/index.html");
});
 
    
const PORT = process.env.PORT || 4000;
    app.listen(PORT,()=>{
        console.log("Server Running => Port: " + `${PORT}`);
        })
