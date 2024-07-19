// let CLIENT_ID = '214942600183391';
// let CLIENT_SECRET = 'qy9QJn4pUWuzvBtDu2VFOjrW9hIp69Os';
let CLIENT_ID = '';
let CLIENT_SECRET = '';
let email = '';
let REDIRECT_URI = 'https://backclickhub-e83be6f85c9d.herokuapp.com/api/callback';
const axios = require('axios');
const opn = require('opn');
const nodemailer = require('nodemailer');

exports.start = async (req, res) => {

  CLIENT_ID = req.body.CLIENT_ID
  CLIENT_SECRET = req.body.CLIENT_SECRET
  email = req.body.email
  // = req.body.plan

  const url = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  
  opn(url).then(() => {
    console.log(`URL aberta: ${url}`);
}).catch(err => {
    console.error(`Erro ao abrir a URL: ${err}`);
});
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


      const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'contatoclickhub@hotmail.com', // Seu email do Hotmail
          pass: 'clickhub123@' // Sua senha do Hotmail
        }
      });
      
      // Configurar os detalhes do email
      const mailOptions = {
        from: 'contatoclickhub@hotmail.com', // Seu email do Hotmail
        to: `${email}`, // Email do destinatário
        subject: 'Seu token de acesso!',
        text: `${dados}`,
        html: `<h1>${accessToken}</h1>` // Corpo do email em HTML
      };
      
      // Enviar o email
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          const novaUrl = 'http://localhost:3000/#/integracao';
          res.redirect(novaUrl);
        } else {
          console.log('Email enviado:', info.response);
    
        }
      });






      res.json({
        message: 'Token de acesso obtido com sucesso',
        accessToken: accessToken
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Erro ao obter o token de acesso',
        error: error.response.data
      });
    });
  };
  


