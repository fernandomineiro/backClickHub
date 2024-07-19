const CLIENT_ID = '214942600183391';
const CLIENT_SECRET = 'qy9QJn4pUWuzvBtDu2VFOjrW9hIp69Os';
// let CLIENT_ID = '';
// let CLIENT_SECRET = '';
// let email = '';
const REDIRECT_URI = 'https://backclickhub-e83be6f85c9d.herokuapp.com/api/callback';
const axios = require('axios');
const opn = require('opn');
const nodemailer = require('nodemailer');


let clientData = {};

exports.start = async (req, res) => {

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

    console.log(code, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
    const email = 'fernandofitilan@hotmail.com'

    try {
      const tokenResponse = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
          params: {
              grant_type: 'authorization_code',
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
              code: code,
              redirect_uri: REDIRECT_URI
          }
      });

      const accessToken = tokenResponse.data.access_token;

      envioEmail(accessToken, 'fernandofitilan@hotmail.com')
      res.json({ access_token: accessToken });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }

     

    // axios.post('https://api.mercadolibre.com/oauth/token', null, {
    //   params: {
    //     grant_type: 'authorization_code',
    //     client_id: CLIENT_ID,
    //     client_secret: CLIENT_SECRET,
    //     code: code,
    //     redirect_uri: REDIRECT_URI
    //   }
    // })
    // .then(async response => {
    //   const accessToken = response.data.access_token;

    //   console.log(accessToken)

    // res.json({ access_token: accessToken });

      // const transporter = nodemailer.createTransport({
      //   service: 'hotmail',
      //   auth: {
      //     user: 'contatoclickhub@hotmail.com', // Seu email do Hotmail
      //     pass: 'clickhub123@' // Sua senha do Hotmail
      //   }
      // });
      

      // const mailOptions = {
      //   from: 'contatoclickhub@hotmail.com', // Seu email do Hotmail
      //   to: `${email}`, // Email do destinatário
      //   subject: 'Seu token de acesso!',
      //   text: `${dados}`,
      //   html: `<h1>${accessToken}</h1>` // Corpo do email em HTML
      // };
      

      // transporter.sendMail(mailOptions, function(error, info){
      //   if (error) {
      //     const novaUrl = 'http://localhost:3000/#/integracao';
      //     res.redirect(novaUrl);
      //   } else {
      //     console.log('Email enviado:', info.response);
    
      //   }
      // });
    // })
    // .catch(error => {
    //   console.log(error.response)
    //   res.status(500).json({
    //     message: 'Erro ao obter o token de acesso',
    //   });
    // });
  };
  

  const envioEmail = (dados, emailRecptor) => {
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
      to: `${emailRecptor}`, // Email do destinatário
      subject: 'Novo cadastro',
      text: `${dados}`,
      html: `<h1>${dados}</h1>` // Corpo do email em HTML
    };
    
    // Enviar o email
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('Erro ao enviar email:', error);
      } else {
        console.log('Email enviado:', info.response);
  
      }
    });
  }


