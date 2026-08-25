require ('./rotas_sales')

//SQL de Vendas

const getSales= (req, res)=>{
pool.query('SELECT * FROM vendas',(error,results)=>{
if (error){
   throw error
}
res.status(200).json(results.rows)
})
};


const postSales = (req, res)=>{
  const {id,product,marca,price,qtd} = req.body
pool.query('INSERT INTO vendas (caixa_id,itens, total) VALUES ($1,$2,$3) RETURNING *',[caixa_id,itens,total],(error,results)=>{
if (error){
throw error
}
res.status(201).send(`Venda inserted ${results.rows[0].id}`)
})
}



module.exports= {
    getSales,
    postSales
}




