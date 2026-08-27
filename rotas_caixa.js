
const Caixa = require('./db_caixa')

//API HTTP dos Caixas


const getCaixa=(async(req, res) =>{
    try{
        const caixa = await Caixa.getCaixa();
         res.status(200).json({caixa})
     }catch(error){
        console.error(error);
         res.status(500).json({error:'Error ao consultar o caixa'})
     }  
   
  });

   
 //Post Abrir caixa
 const abrirCaixa=(async (req, res) =>{
        try{
            const dados = req.body;
            const caixa = await Caixa.abrirCaixa(dados);
            res.status(201).json({message: "Caixa aberto!"})
            
            }catch(error){
            console.log(dados);
            console.error(error);
            res.status(400).json({error:error.message})
            
        }  
    })

const getCaixaAberto = async (req, res) => {

    try {

        const caixa = await Caixa.getCaixaAberto();

        if (!caixa) {
            return res.status(404).json({
                message: 'Nenhum caixa aberto'
            });
        }

        res.status(200).json(caixa);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Erro ao consultar caixa aberto'
        });
    }
};

// POST /caixa/fechar
const fecharCaixa = async (req, res) => {

    try {

        const dados = req.body;

        const caixa = await Caixa.fecharCaixa(dados);

        res.status(200).json(caixa);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Erro ao fechar caixa'
        });

    }
};
    

module.exports={
    getCaixa,
    abrirCaixa,
    getCaixaAberto,
    fecharCaixa,
    }