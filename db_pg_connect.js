// Conexão de DATABASE SQL POSTGRE NEON
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


module.exports = pool;