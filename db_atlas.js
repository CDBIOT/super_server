const mongoose = require('mongoose')
require('dotenv').config()

// if(process.env.NODE_ENV == "production"){
//     module.exports = 
//    {
const MONGODB_URI = 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@cluster0.mvho6.mongodb.net/'
    +process.env.DB_NAME+'?retryWrites=true&w=majority'
    //},
  // {
   // useNewUrlParser: true,
    //useUnifiedTopology: true
  //  },
 //   }
mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(()=> 
   
    console.log("MongodB " +process.env.DB_NAME +" conectado com sucesso!")
    )
.catch((err) => {
    console.log("Houve um erro ao se conectar ao mongodB: " +process.env.DB_NAME + err)
   
})
     