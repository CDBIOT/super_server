// Do not expose your Neon credentials to the browser
// .env


// app.js
const postgres = require('postgres');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
//const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;
CONNECTION_STRING= `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}`;
const URL = CONNECTION_STRING
const sql = postgres(URL, { ssl: 'require' });

async function connect() {
  if (global.connection)
  return global.connection.connect();
  const {Pool} = require('pg')
  const pool = new Pool({
    connectionString: URL
  })
  const client = await pool.connect();
  console.log("Criou pool de conexões no PostgreSQL");

  const res = await client.query('SELECT NOW'());
  console.log(res.rows[0]);
  client.release();
  global.connection = pool;
  return pool.connect();
 }

//connect();