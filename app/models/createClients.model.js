module.exports = (sequelize, Sequelize) => {
  
    const Create_clients = sequelize.define("create_clients", {
      token: {
        type: Sequelize.STRING
      },
      cpf: {
        type: Sequelize.STRING
      },
      id_plan: {
        type: Sequelize.STRING
      },
      months: {
        type: Sequelize.STRING
      },

    }, {
      tableName: 'create_clients', // Nome da tabela no banco de dados
      underscored: true, // Usa `created_at` e `updated_at` em vez de camelCase
      timestamps: true // Inclui campos `created_at` e `updated_at`
  });
  
    return Create_clients;
  };
  