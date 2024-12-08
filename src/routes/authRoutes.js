const express = require('express');
const { loginUser, registerUser } = require('../services/authService'); 
const { handleError } = require('../middlewares/errorMiddleware'); 

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.json({ token });
  } catch (error) {
    handleError(error, res);
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const token = await registerUser(name, email, password);
    res.status(201).json({ token });
  } catch (error) {
    handleError(error, res); 
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    const decoded = jwt.verify(refreshToken, 'seu-segredo-refresh');
    
    // Gerar um novo access token
    const newAccessToken = jwt.sign({ userId: decoded.userId }, 'seu-segredo', { expiresIn: '1h' });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Refresh token inválido ou expirado.' });
  }
});


module.exports = router;
