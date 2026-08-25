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