// const fetch = require('node-fetch');
const Axios = require('axios');


const CEPSTORE = '05421-001';
const cdService = '41106';


const bodyRequest = (cepDestination) => {
    return {
        'nCdServico': cdService,
        'sCepOrigem': CEPSTORE,
        'sCepDestino': cepDestination,
        'nVlPeso': "1",
        'nCdFormato': 1,
        'nVlComprimento': 20,
        'nVlAltura': 20,
        'nVlLargura': 20,
        'nVlDiametro': 0,
        'sCdMaoPropria': "N",
        'nVlValorDeclarado': 0,
        'sCdAvisoRecebimento': "N",
        'StrRetorno': "xml",
        'nIndicaCalculo': 3
    }
}

const customError = (message, status) => ({ message, status});

const consultaCEP = async (cep) => {
    
    const response = await Axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.data) {
        throw customError('CEP inválido',400)
    }
    return response.data;
}

const requestApiCorreios = async (cep) => {
    const url = bodyRequest(cep);

    const response = await Axios.get(
        'http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?' + new URLSearchParams(url).toString()
    );
       
    return response.data;
}

const infoEndereco = async (cep) => {
    const endereco = await consultaCEP(cep);

    return endereco;
}

const prazoEntrega = async (cep) => {
    const xmlCorreios = await requestApiCorreios(cep);
    const prazoEntrega = await xmlCorreios.match(/<PrazoEntrega>(.+)<\/PrazoEntrega>/);
    
    if (prazoEntrega[1]=== '0') {
        throw customError('O CEP inválido', 400)
    }

    return prazoEntrega[1];
}

const valorEntrega = async (cep) => {
    const xmlCorreios = await requestApiCorreios(cep);
    const valorEntrega = await xmlCorreios.match(/<Valor>(.+)<\/Valor>/);

    return valorEntrega[1];
}

module.exports = { 
    infoEndereco,
    prazoEntrega,
    valorEntrega
};


