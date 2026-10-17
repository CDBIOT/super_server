
const Caixa = require('./db_caixa')

//API HTTP dos Caixas

// Erros de regra (com .status) voltam com a mensagem; o resto vira 500
const responderErro = (res, error, mensagemPadrao) => {
    if (error && error.status) {
        return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: mensagemPadrao });
};


const getCaixa=(async(req, res) =>{
    try{
        const caixa = await Caixa.getCaixa();
         res.status(200).json({caixa})
     }catch(error){
        console.error(error);
         res.status(500).json({error:'Erro ao consultar o caixa'})
     }

  });


 //Post Abrir caixa
 const abrirCaixa=(async (req, res) =>{
        try{
            const caixa = await Caixa.abrirCaixa(req.body);
            res.status(201).json({caixa})
            }catch(error){
            // Validação e "já existe caixa aberto" voltam como 400/409 com a mensagem
            responderErro(res, error, 'Erro ao abrir caixa');
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

// POST /caixa/fechar  (fecha o caixa aberto)
const fecharCaixa = async (req, res) => {

    try {

        const caixa = await Caixa.fecharCaixa();

        res.status(200).json(caixa);

    } catch (error) {

        responderErro(res, error, 'Erro ao fechar caixa');

    }
};


module.exports={
    getCaixa,
    abrirCaixa,
    getCaixaAberto,
    fecharCaixa,
    }
