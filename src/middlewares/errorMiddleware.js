module.exports.handleError = (error, res) => {
  return res.status(500).json({ error: error.message || 'Erro interno no servidor.' });
};
