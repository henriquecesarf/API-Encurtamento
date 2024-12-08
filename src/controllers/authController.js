const bcrypt = require('bcrypt');
const { User } = require('../models');
const { generateToken } = require('../middlewares/authMiddleware');

module.exports = {
  async register(req, res) {
    try {
      const { email, password } = req.body;

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: 'Usuário já registrado.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword });

      return res.status(201).json({ message: 'Usuário registrado com sucesso.', userId: user.id });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao registrar o usuário.', error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      const token = generateToken({ userId: user.id, email: user.email });

      return res.status(200).json({ message: 'Login realizado com sucesso.', token });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao realizar login.', error: error.message });
    }
  },
};
