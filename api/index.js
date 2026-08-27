const express = require ('express');
const app = express();
const rotas_caixa = require('../rotas_caixa')
const rotas_user = require("../rotas_user")
const rotas_sales = require("../rotas_sales")
const rotas_products = require('../rotas_products')


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

//Produtos
app.get ('/products',rotas_products.getProducts)
 app.post('/products',rotas_products.postProducts)
// app.put('/products/:id',rotas_products.putProducts)
// app.delete('/products/:id',rotas_products.deleteProducts)

//Usuarios
app.get ('/user',rotas_user.getUser)
app.post('/user',rotas_user.postUser)
app.put('/user/:id',rotas_user.CadUser)
app.delete('/user/:id',rotas_user.deleteUser)

//Vendas
app.get('/sales', rotas_sales.getSales)
app.post('/sales', rotas_sales.postSales)
   
//Caixa
app.get('/caixa/aberto', rotas_caixa.getCaixaAberto);

app.get('/caixa', rotas_caixa.getCaixa)
app.post('/caixa/abrir', rotas_caixa.abrirCaixa)
app.post('/caixa/fechar', rotas_caixa.fecharCaixa)

app.use('/', express.static(__dirname + '/'))
    
app.get("/index.html",function(req,res){
    res.sendFile(__dirname + "/index.html");
});
 
    
const PORT = process.env.PORT || 4000;
    app.listen(PORT,()=>{
        console.log("Server Running => Port: " + `${PORT}`);
        })
