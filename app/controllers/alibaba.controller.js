const client = require('./config'); // Arquivo de configuração criado anteriormente

async function authenticateUser(username, password) {
  try {
    const params = {
      "Action": "GetUser",
      "UserName": username
    };

    const requestOption = {
      method: 'POST'
    };

    const result = await client.request('GetUser', params, requestOption);
    if (result.User) {
      // Verifique a senha (isso depende da sua implementação de armazenamento de senhas)
      if (verifyPassword(result.User.Password, password)) {
        return { authenticated: true, user: result.User };
      }
    }
    return { authenticated: false };
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, error };
  }
}

function verifyPassword(storedPassword, providedPassword) {
  // Implemente a verificação de senha aqui (por exemplo, hash e comparação)
  return storedPassword === providedPassword;
}

module.exports = { authenticateUser };