const express = require('express');
const routers = express.Router();

//var fs = require('fs');

const Products = require('./db_products');


routers.get('/products',async(req, res) =>{
    try{
        const temps = await Products.find()
         res.status(200).json({temps})
     }catch(error){
         res.status(500).json({error: error})
     }  
   
  });

routers.post('/products',async(req, res) =>{
     const  produto = {
        nome: req.body.nome,
        preco: req.body.preco
     }
     res.status(201).send({
     mensagem: 'inserido',
     produtoCriado: produto
     })
   });
    
 //Create temps
 routers.post('/temps', async (req, res) =>{
const {local, temperatura, dia, mes, ano } = req.body
   // const temps = req.params
const temps = {local,temperatura, dia, mes, ano}
const create_temp = new Temps(req.body);
//temps.save()
    try{
        await Temps.create(temps)
        //temps.save()
        console.log(temps)
        res.status(201).json({message: "Temperatura inserida"})
        }catch(error){
        res.status(500).json({error: error})
    }  
})


//Read
routers.get('/temps', async (req, res) =>{
    try{
       const temps = await Temps.find()
        res.status(200).json({temps})
    }catch(error){
        res.status(500).json({error: error})
    }  
})

//Read
routers.get('/temps/:dia', async (req, res) =>{
    const dia = req.params.dia
    try{
       const dias = await Temps.findAll({dia})
        res.status(200).json({dias})
    }catch(error){
        res.status(500).json({error: error})
    }  
})

//Update
routers.patch('/temps/:id',async (req, res) =>{
    const id = req.params.id
    const {local, temperatura, dia, mes, ano } = req.body
    const temps = {local, temperatura, dia, mes, ano}
    try{
     const updateTemp = await Temps.updateOne({id: id},temps);
     res.status(200).json(temps);
    }catch(error){
    res.status(500).json({error: error})
    }  
})

routers.post('/temps/:id',async(req, res) =>{
    const  id = req.params.id
    
    res.status(201).send({
    mensagem: 'inserido',
    produtoCriado: produto
    })
  });

 //Delete
routers.delete('/temps/:id', async (req, res) => {
    const id= req.params.id
    //temps.remove({id: req.body.id})
    const temps = await Temps.deleteOne({ _id: id}, (err) => {
    
    if(err) return res.status(400).json({

        error:true,
        message: "Error: Artigo não foi apagado com sucesso!"
    });
   // if(!temps){
   // res.status(422).json({message:  'Temperatura não encontrada'});
    //res.redirect('/temps')
    return res.json({

        error: false,
        message: "Artigo apagado com sucesso!"
            })
        })
    })

   // try{
    //    await Temps.deleteOne({"_id": id});
    //    res.status(200).json({message: 'Temperatura removida com sucesso'});
        //res.redirect('/temps')
   // }catch(error){
  //  res.status(500).json({error: error})
//}  
//});


routers.use('/', express.static(__dirname + '/'))
routers.use('/css', express.static("/css"))
routers.use('/imagens', express.static("/imagens"))


 routers.get("/admin",function(req,res){
    res.sendFile(__dirname + "/admin.html");
});


module.exports = routers