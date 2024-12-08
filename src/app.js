const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const { swaggerDocs, swaggerUi } = require('./config/swaggerConfig');
const { handleError } = require('./middlewares/errorMiddleware');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ignorar autenticação nas rotas do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Serve o Swagger sem autenticação

// Aplicar autenticação nas rotas principais
app.use('/auth', authRoutes); 
app.use('/urls', urlRoutes); // Aqui, autenticando as rotas /urls


// Middleware de erro
app.use((err, req, res, next) => {
  handleError(err, res);
});

module.exports = app;
