const CLIENT_ID = '2799571947908418';
const CLIENT_SECRET = 'seu-client-secret';
const REDIRECT_URI = 'https://backclickhub-e83be6f85c9d.herokuapp.com/api/callback';
exports.start = async (req, res) => {


  const authURL = `https://auth.mercadolivre.com.ab/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(authURL);
  };
  

  exports.getToken = async (req, res) => {
    const { code } = req.query;
  
    if (!code) {
      return res.status(400).send('Código de autorização não fornecido.');
    }
  
    try {
      const tokenResponse = await axios.post('https://api.mercadolivre.com/oauth/token', querystring.stringify({
        grant_type: 'authorization_code',
        client_id: '2799571947908418',
        client_secret: 'ysUgrTxvYwNbQ4JCYKm372AR9B95MXhN',
        code,
        redirect_uri: 'https://backclickhub-e83be6f85c9d.herokuapp.com',
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      console.log(access_token, refresh_token, expires_in)
      const { access_token, refresh_token, expires_in } = tokenResponse.data;
      res.json({ access_token, refresh_token, expires_in });
    } catch (error) {
      console.error('Erro ao obter o token de acesso:', error);
      res.status(500).send('Erro ao obter o token de acesso.');
    }
  };
  


