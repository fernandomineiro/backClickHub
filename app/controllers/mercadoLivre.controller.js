let CLIENT_ID = '214942600183391';
let CLIENT_SECRET = 'qy9QJn4pUWuzvBtDu2VFOjrW9hIp69Os';
let email = ''
const REDIRECT_URI = 'https://backclickhub-e83be6f85c9d.herokuapp.com/api/callback';
const axios = require('axios');
exports.start = async (req, res) => {


  CLIENT_ID = req.body.CLIENT_ID
  CLIENT_SECRET = req.body.CLIENT_SECRET
  email = req.body.email
  // let {CLIENT_ID,  CLIENT_SECRET} = req.body;

  const authURL = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(authURL);
  };
  

  exports.getToken = async (req, res) => {
    const { code } = req.query;

  
    if (!code) {
      return res.status(400).send('Código de autorização não fornecido.');
    }
  

    axios.post('https://api.mercadolibre.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI
      }
    })
    .then(response => {
      const accessToken = response.data.access_token;

      const novaUrl = `http://localhost:3000/#/integracao/${accessToken}`; // URL para a qual você deseja redirecionar
      res.redirect(novaUrl);


      

       res.json({
       message: 'Token de acesso obtido com sucesso',
       accessToken: accessToken
       });
    })
    .catch(error => {

      const novaUrl = `http://localhost:3000/#/integracao/erro`; // URL para a qual você deseja redirecionar
      res.redirect(novaUrl);
      res.status(500).json({
        message: 'Erro ao obter o token de acesso',
       error: error.response.data
       });
    });
  };
  


