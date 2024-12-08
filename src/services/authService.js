// services/authService.js
const jwt = require('jsonwebtoken');
const { User } = require('../models'); 
const bcrypt = require('bcryptjs');   
const { generateToken } = require('../middlewares/authMiddleware')

const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password); 
  if (!isPasswordCorrect) {
    throw new Error('Senha incorreta');
  }

  const token = generateToken(user)
  return token;
};

const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email já está em uso');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user)


  return token;
};

module.exports = { loginUser, registerUser };
