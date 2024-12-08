const jwt = require('jsonwebtoken');
require('dotenv').config(); // Carregar variáveis de ambiente
const secretKey = process.env.JWT_SECRET_KEY;

// Função para gerar o token
const generateToken = (user) => {
  return jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
};

// Middleware de autenticação
const authenticate = async (req, res, next) => {
  if (req.path.startsWith('/api-docs')) {
    return next();
  }

  const authHeader = req.headers.authorization; // Verificando se o cabeçalho Authorization existe e está no formato correto
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido ou malformatado.' });
  }

  // Extrai o token do cabeçalho Authorization
  const token = authHeader.split(' ')[1]

  try {

    const decoded = await jwt.verify(token, secretKey);
    
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    console.error('Error verifying token:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, secretKey); // Decodifica o token
      req.user = { userId: decoded.userId }; // Popula o req.user com o userId
    } catch (error) {
      console.warn('Token inválido ou expirado:', error.message);
      req.user = null; // Define req.user como null se o token for inválido
    }
  } else {
    req.user = null; // Define req.user como null se o cabeçalho não existir
  }

  next(); // Passa para o próximo middleware ou rota
};

module.exports = { authenticate, optionalAuthenticate, generateToken };