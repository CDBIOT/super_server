// Do not expose your Neon credentials to the browser
// .env
require('dotenv').config();

const {Pool} = require('pg')
const { DATABASE_URL } = process.env;

 const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl:{
       required: true,
      rejectUnauthorized: false,
  },
})
async function connect() {
  if (global.connection)
  return global.connection.connect();
  
 {
  //apenas testando a conexão
 const client = await pool.connect();
 console.log("Criou pool de conexões no PostgreSQL!");
    
 const res = await client.query('SELECT NOW()');
 console.log(res.rows[0]);
 client.release();

 //guardando para usar sempre o mesmo
 global.connection = pool;
 return pool.connect();
    }
    
}
connect();

//Read from postgre
const getProducts = (req, res) =>{
pool.query('SELECT * FROM Products',(error,results)=>{
if (error){
   throw error
}
res.status(200).json(results.rows)
})
  
}

const postProducts = (req, res)=>{
  const {id,product,marca,price,qtd} = req.body
pool.query('INSERT INTO Products (id,product, marca, price, qtd) VALUES ($1,$2,$3,$4,$5) RETURNING *',[id,product,marca,price,qtd],(error,results)=>{
if (error){
throw error
}
res.status(201).send(`Product inserted ${results.rows[0].id}`)
})
}


module.exports= {getProducts,postProducts}

