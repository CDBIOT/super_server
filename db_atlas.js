if(process.env.NODE_ENV == "production"){

module.exports = {
//MONGODB_URI: "mongodb+srv://cdb:abcdeF12345@cluster0.mvho6.mongodb.net/test"
MONGODB_URI: "mongodb+srv://cdb:abcdeF12345@cluster0.mvho6.mongodb.net/test"
//MONGODB_URI: process.env.MONGODB_URI

//MONGODB_URI: 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@cluster0.mvho6.mongodb.net/'
//+process.env.DB_NAME+'?retryWrites=true&w=majority'
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


