
const pool = require('./db_pg_connect');

//Read from postgre
 const getProducts = async (req, res) => {
    try {
        const results = await pool.query(
            'SELECT * FROM products ORDER BY id'
        );

        res.status(200).json(results.rows);

    } catch (error) {
        console.error('Erro ao buscar produtos:', error);

        res.status(500).json({
            error: 'Erro ao buscar produtos'
        });
    }
};

const postProducts = (req, res)=>{
  const {id,product,marca,price,qtd} = req.body
pool.query('INSERT INTO Products (id,product, marca, price, qtd) VALUES ($1,$2,$3,$4,$5) RETURNING *',[id,product,marca,price,qtd],(error,results)=>{
if (error){
throw error
}
res.status(201).send(`Product inserted ${results.rows[0].id}`)
})
}


module.exports= {
                getProducts,
                postProducts
                }



