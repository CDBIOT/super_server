const Products = require('./db_products')

//API HTTP dos produtos

// Erros de validação (com .status) voltam como estão; o resto vira 500
const responderErro = (res, error, mensagemPadrao) => {
    if (error && error.status) {
        return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: mensagemPadrao });
};


const getProducts = async (req, res) => {
    try {
        const products = await Products.getProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Erro ao buscar produtos'
        });
    }
};


// GET /products/:id
const getProductsId = async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Id de produto inválido' });
    }
    try {
        const product = await Products.getProductsId(id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        responderErro(res, error, 'Erro ao buscar produto');
    }
};

// GET /products/barcode/:barcode  -> um produto (somente leitura)
const getProductsBarcode = async (req, res) => {
    const barcode = String(req.params.barcode || '').trim();

    // Códigos de varejo (EAN-8, UPC-A, EAN-13, GTIN-14) são numéricos
    if (!/^\d{8,14}$/.test(barcode)) {
        return res.status(400).json({ error: 'Código de barras inválido' });
    }

    try {
        const product = await Products.getProductsBarcode(barcode);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado', barcode });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Erro ao buscar produto pelo código de barras'
        });
    }
};

// POST /products  { product, marca, price, qtd, barcode? }
const postProducts = async (req, res)=>{
    try{
        const produto = await Products.postProducts(req.body);
        res.status(201).json(produto);
    }
    catch(error){
        responderErro(res, error, 'Erro ao registrar produto');
    }
}

// PUT /products/:id  (atualização parcial)
const putProducts = async (req, res) => {
    try {
        const produto = await Products.putProducts(req.params.id, req.body);
        res.status(200).json(produto);
    } catch (error) {
        responderErro(res, error, 'Erro ao atualizar produto');
    }
};


module.exports={
    getProducts,
    getProductsId,
    getProductsBarcode,
    postProducts,
    putProducts,
}
