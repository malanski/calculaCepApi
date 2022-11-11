// const http = require('http');
const express = require('express');
const freteMetodos = require('./calculadoraFretes');

const port = 3000;

const {
    prazoEntrega,
    valorEntrega,
    infoEndereco
} = freteMetodos;

const server = express()

server.get('/endereco/cep=:cep', async (req, res) => {
    try {

        const cep = req.params.cep;

        const endereco = await infoEndereco(cep);

        res.end(JSON.stringify({endereco}));

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    };
    
    return;   
 });

server.get('/frete/cep=:cep', async (req, res) => {
    try {

        const cep = req.params.cep;
        
        const prazo = await prazoEntrega(cep);
        const frete = await valorEntrega(cep);

        res.end(JSON.stringify({ 'prazo entrega': `${prazo}`, 'valor frete': `${frete}`}));

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    };
    return;   
 });
 
server.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}/`));
