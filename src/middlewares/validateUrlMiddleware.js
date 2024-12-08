module.exports.validateUrl = (req, res, next) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string' || !/^https?:\/\/.+/i.test(url)) {
    return res.status(400).json({ error: 'URL fornecida não é válida.' });
  }
  next();
};
