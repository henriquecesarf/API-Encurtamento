const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // URL base da aplicação sendo testada
    baseUrl: 'http://localhost:4130',
    // Timeout padrão para comandos
    defaultCommandTimeout: 10000,
    // Timeout padrão para carregamento de páginas
    pageLoadTimeout: 60000,
    // Diretório onde os testes estão localizados
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    // Configuração de captura de screenshots
    screenshotOnRunFailure: true,
    video: true, // Gravação de vídeos durante os testes
    retries: {
      // Repetições automáticas para falhas
      runMode: 2, // Durante execução de `cypress run`
      openMode: 0, // Durante execução de `cypress open`
    },
    env: {
      // Variáveis de ambiente para os testes
      API_URL: 'http://localhost:4130/api', // Altere conforme sua API
    },
    setupNodeEvents(on, config) {
      // Adicione eventos personalizados aqui, se necessário
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
  },
  // Configuração para executar testes em diferentes navegadores
  component: {
    devServer: {
      framework: 'react', // Ou vue, angular, etc.
      bundler: 'webpack',
    },
  },
});
