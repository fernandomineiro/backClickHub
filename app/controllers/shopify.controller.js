app.get('/shopify', async (req, res) => {
    const shop = req.query.shop;
  
    if (!shop) {
      return res.status(400).send('Missing shop parameter');
    }
  
    const authRoute = await Shopify.Auth.beginAuth(
      req,
      res,
      shop,
      '/shopify/callback',
      false,
    );
  
    return res.redirect(authRoute);
  });
  
  // Callback para tratar a resposta de autenticação
  app.get('/shopify/callback', async (req, res) => {
    try {
      const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query,
      );
  
      // Autenticação bem-sucedida
      res.status(200).send('Authentication successful');
    } catch (error) {
      console.error(error);
      res.status(500).send('Authentication failed');
    }
  });