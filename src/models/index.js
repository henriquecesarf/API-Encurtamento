const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const User = require('./user');
const URL = require('./url');

// Carregar variáveis de ambiente
dotenv.config();

// Configuração do Sequelize para MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,  // Nome do banco de dados
  process.env.DB_USER,  // Usuário do banco de dados
  process.env.DB_PASSWORD,  // Senha do banco de dados
  {
    host: process.env.DB_HOST,  // Host do banco de dados (deve ser o nome do serviço no Docker)
    dialect: 'mysql',  // Usar o dialeto do MySQL
    port: process.env.DB_PORT,  // Porta do banco de dados (geralmente 3306 para MySQL)
    logging: process.env.NODE_ENV === 'development' ? console.log : false, // Logs em ambiente de desenvolvimento
  }
);

// Definição dos modelos
const models = {
  User: User(sequelize),
  URL: URL(sequelize, DataTypes),
};

// Definindo os relacionamentos
models.User.hasMany(models.URL, { foreignKey: 'usuario_id' });
models.URL.belongsTo(models.User, { foreignKey: 'usuario_id' });

module.exports = { sequelize, ...models };
