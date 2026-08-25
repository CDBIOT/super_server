require ('./rotas_sales')

//SQL de Vendas


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

const getSales('/vendas',async(req, res) =>{
    
    res.status(201).send({
    mensagem: 'Vendas Cadastradas',
    })
  });

const postSales('/vendas',async(req, res) =>{
    const  produto = {
       nome: req.body.nome,
       preco: req.body.preco
    }
    res.status(201).send({
    mensagem: 'Venda Cadastrada',
    produtoCriado: produto
    })
  });
    

module.exports= {
    getProducts,
    postProducts,
    getSales,
    postSales
}




