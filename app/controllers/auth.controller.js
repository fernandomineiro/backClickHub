const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const CreateClients = db.createClients;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const { addMonths, format } = require('date-fns');

exports.signup = async (req, res) => {
  // Save User to Database
 
  try {
    const { name, email, password, phone, cpf_cnpj, companyName, address, token} = req.body;
  const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(200).json({ error: 'Email já existe' });
    }

    // Verificar se o número de telefone já existe
    const phoneExists = await User.findOne({ where: { phone } });
    if (phoneExists) {
      return res.status(200).json({ error: 'Telefone já existe' });
    }

    const tokensExists = await CreateClients.findOne({ where: { token } });


    if (!tokensExists) {
      return res.status(200).json({ error: 'Erro em token' });
    }

    const lastClient = await User.findOne({
      order: [['created_at', 'DESC']]
  });

  
  let code = bcrypt.hashSync(new Date() + name, 8);

  const now = new Date();

  const futureDate = addMonths(now, tokensExists.dataValues.months);

  const formattedDate = format(futureDate, "yyyy-MM-dd HH:mm:ss");

    User.create({
      name: name,
      client_id : code,
      email: email,
      password: bcrypt.hashSync(password, 8),
      phone: phone,
      cpf_cnpj:cpf_cnpj,
      plan_id:tokensExists.dataValues.id_plan,
      expired_plan:formattedDate,
      company_name: companyName,
      address: address,
      slug: name,
      image_path: null,
      status: 1,
    })
      .then(user => {
        CreateClients.destroy({
          where: {
               token: token
            }
           });
       res.send({ message: "Afiliado criado com sucesso!" });

      })
      .catch(err => {
        res.status(500).send({ message: err });
      });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};


// admddin@dsdd.coms 1235202
exports.signin = (req, res) => {

  console.log(req.body)

  let a =  User.findOne({
    where: {
      email: req.body.email
    }
  })


  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {       
      if (user == null) {
         return res.status(404).send({ message: "Usuário não encontrado." });
       }

       let passwordIsValid = bcrypt.compareSync(
         req.body.password,
         user.password
       );

       if (!passwordIsValid) {
         return res.status(401).send({
           accessToken: null,
           message: "Senha inválida!"
         });
       }

       const token = jwt.sign({ id: user.id },
                               config.secret,
                               {
                                 algorithm: 'HS256',
                                 allowInsecureKeySizes: true,
                                 expiresIn: 86400,  //24 hours
                               });


                               console.log(user)

                                res.status(200).send({
                                  email: user.email,
                                  id: user.client_id,
                                  accessToken: token,
                                  type: 1,
                                  status: user.status
                      
                                });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


exports.validateToken = async (req, res) => {
  try {
    // Verifica se o token está presente no corpo da requisição
    if (!req.body || !req.body.token) {
      return res.status(400).send({ success: false, message: 'Token é obrigatório' });
    }

    const token = req.body.token;

    console.log(token);

    // Consulta o banco de dados para verificar se o token existe
    const tokensExists = await CreateClients.findOne({ where: { token } });

    // Responde com true se o token existir, ou false caso contrário
    if (tokensExists == null) {
      return res.send(false);
    } else {
      return res.send(true);
    }
  } catch (error) {
    // Tratamento de erros
    console.error('Error validating token:', error);
    return res.status(500).send({ success: false, message: 'Internal server error' });
  }

}




exports.createAccountToken = (req, res) => {

  const email = req.body.email
  const cpf = req.body.cpf
  const plan = req.body.plan
  let simpleToken = `${new Date() + email}`
  let token = bcrypt.hashSync(simpleToken, 8);

  token = token.replace(/\//g, '');


  CreateClients.create({
    token: token,
    status: 0,
    cpf:cpf,
    id_plan : plan,
  })
    .then(user => {
      const dados = `Por gentileza, termine sua conta em localhost:3000/#/register/${token}`
      envioEmail(dados, email)
      res.send({ message: "Afiliado enviado a linha!" });
    })
    .catch(err => {
      res.status(500).send({ message: err });
    });

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