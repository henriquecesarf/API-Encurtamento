const { sequelize } = require('./models'); // Certifique-se de ter os modelos importados corretamente
const app = require('./app'); // Sua aplicação Express

const PORT = process.env.API_PORT || 4130;

(async () => {
  try {
    // Tenta se conectar com o banco
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');

    // Sincroniza os modelos com o banco (cria as tabelas automaticamente)
    await sequelize.sync({ force: false }); // Se for `force: true`, ele apaga as tabelas existentes. Não use isso em produção!

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1); // Encerra o processo se houver falha na conexão com o banco
  }
})();
