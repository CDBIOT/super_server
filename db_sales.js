const pool = require ('./db_pg_connect')

//SQL de Vendas

const getSales= async()=>{ 
const results = await pool.query(
    'SELECT * FROM vendas ORDER BY vendas_id')

return results.rows;
};


const postSales = async(vendas)=>{
  const {caixa_id, items,total} = venda;
  const results = await pool.query(
    'INSERT INTO vendas (caixa_id,itens, total)VALUES ($1,$2,$3) RETURNING *',
    [caixa_id,itens,total],(error,results)=>{

return results.rows[0];
})
}

module.exports= {
    getSales,
    postSales
}




