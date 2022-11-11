const http = require('http');
const url = require('url');
const freteMetodos = require('./calculadoraFretes');

const port = 3000;

const {
    prazoEntrega,
    valorEntrega,
    infoEndereco
} = freteMetodos;

const server = http.createServer(async (req, res) => {
    try {
        const { 
            pathname,
            query: { cep }
        } = url.parse(req.url, true);

        if (pathname && pathname.includes('/endereco')) {
            const endereco = await infoEndereco(cep);
        
            res.end(JSON.stringify({endereco}));
        } 
        
        if (pathname && pathname.includes('/frete')) {
            const prazo = await prazoEntrega(cep);
            const frete = await valorEntrega(cep);

            res.end(JSON.stringify({ 'prazo entrega': `${prazo}`, 'valor frete': `${frete}`}));
        } 

    } catch (error) {
        res
        .writeHead(error.status ?? 500, { 'Content-Type': 'text/html; charset=utf-8' })
        .end(JSON.stringify({ message: error.message}));   
    }
    
    return;   
 });
 
server.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}/`));
