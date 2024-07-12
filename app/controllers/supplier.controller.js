const db = require("../models");
const config = require("../config/auth.config");
const Supplier = db.supplier;
const nodemailer = require('nodemailer');


const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // Save supplier to Database
 
  try {
    const { name, email, password, phone, cpf_cnpj, companyName, address} = req.body;

 const emailExists = await Supplier.findOne({ where: { email } });
   if (emailExists) {
     return res.status(200).json({ error: 'Email já existe' });
   }


//     // Verificar se o número de telefone já existe
    const phoneExists = await Supplier.findOne({ where: { phone } });
    if (phoneExists) {
      return res.status(200).json({ error: 'Telefone já existe' });
    }

    const lastClient = await Supplier.findOne({
      order: [['created_at', 'DESC']]
  });
  let code = parseInt(lastClient.supplier_id) + 1
 

  let userId = bcrypt.hashSync(new Date() + name, 8);

   Supplier.create({
       name: name,
       client_id : code,
       email: email,
       password: bcrypt.hashSync(password, 8),
       supplier_id: userId,
       phone: phone,
       cpf_cnpj:cpf_cnpj,
       company_name: companyName,
       address: address,
       slug: name,
       image_path: null,
       status: 0,
     })
       .then(user => {
        let data = {
          endereço: address,
          telefone: phone,
          tipo: "fornecedor"
        }

        envioEmail(data,email)
        res.send({ message: "Fornecedor criado com sucesso!" });

      
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
    Supplier.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(supplier => {
      if (!supplier) {
        return res.status(404).send({ message: "Usuário não encontrado." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        supplier.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Senha inválida!"
        });
      }

      const token = jwt.sign({ id: supplier.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });


        res.status(200).send({
          email: supplier.email,
          id: supplier.supplier_id,
          accessToken: token,
          type: 2,
          status: supplier.status

        });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

const envioEmail = (dados, emailRecptor) => {
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'fernandofitilan@hotmail.com', // Seu email do Hotmail
      pass: '!asds' // Sua senha do Hotmail
    }
  });
  
  // Configurar os detalhes do email
  const mailOptions = {
    from: 'fernandofitilan@hotmail.com', // Seu email do Hotmail
    to: `${emailRecptor}`, // Email do destinatário
    subject: 'Novo cadastro',
    text: `${dados}`,
    html: '<h1>Corpo do email em HTML</h1>' // Corpo do email em HTML
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
