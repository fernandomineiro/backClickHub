module.exports = (sequelize, Sequelize) => {
  
  const Categorys = sequelize.define("product_categories", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING
    },
    id_supplier: {
      type: Sequelize.STRING
    }, 
    // code: {
    //   type: Sequelize.STRING
    // }, 
    sku: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.NUMBER
    },
  }, {
    tableName: 'product_categories', // Nome da tabela no banco de dados
    underscored: true, // Usa `created_at` e `updated_at` em vez de camelCase
    timestamps: true // Inclui campos `created_at` e `updated_at`
});

  return Categorys;
};
