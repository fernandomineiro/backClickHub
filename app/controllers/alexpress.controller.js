const CLIENT_ID = 'your-client-id';
const CLIENT_SECRET = 'your-client-secret';
const REDIRECT_URI = 'your-redirect-uri';

// Iniciar o fluxo de autenticação
app.get('/aliexpress/auth', (req, res) => {
  const authUrl = `https://oauth.aliexpress.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=custom_state`;
  res.redirect(authUrl);
});

// Callback para tratar a resposta de autenticação
app.get('/aliexpress/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.post('https://oauth.aliexpress.com/token', querystring.stringify({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI
    }));

    const { access_token, refresh_token } = tokenResponse.data;

    // Armazene os tokens conforme necessário
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);

    res.status(200).send('Authentication successful');
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).send('Authentication failed');
  }
});