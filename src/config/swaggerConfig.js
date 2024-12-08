const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const yamljs = require('yamljs');
const path = require('path');

// Carregar o arquivo YAML
const swaggerYamlPath = path.join(__dirname, '../../swagger.yaml');
const swaggerYaml = yamljs.load(swaggerYamlPath);

// Configurações programáticas do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description: 'Documentação gerada automaticamente',
    },
    servers: [
      {
        url: 'http://localhost:4130',
      },
    ],
  },
  apis: ['./routes/**/*.js'], // Caminho para seus arquivos de rota
};

// Gerar documentação com `swagger-jsdoc`
const swaggerDocsDynamic = swaggerJsDoc(swaggerOptions);

// Combinar o YAML com a configuração dinâmica
const swaggerDocs = {
  ...swaggerYaml,
  paths: {
    ...swaggerYaml.paths,
    ...swaggerDocsDynamic.paths,
  },
};

module.exports = { swaggerDocs, swaggerUi };
