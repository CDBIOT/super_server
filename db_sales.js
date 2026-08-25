const pool = require ('./db_pg_connect')

//SQL de Vendas

const getSales= ()=>{
pool.query('SELECT * FROM vendas',(error,results)=>{
if (error){
   throw error
}

return results.rows;
})
};


const postSales = ()=>{
  const {id,product,marca,price,qtd} = req.body
pool.query('INSERT INTO vendas (caixa_id,itens, total) VALUES ($1,$2,$3) RETURNING *',[caixa_id,itens,total],(error,results)=>{
if (error){
throw error
}

return results.rows;
})
}



module.exports= {
    getSales,
    postSales
}




