const express = require('express');
const router = express.Router();
const { authenticate, optionalAuthenticate } = require('../middlewares/authMiddleware');
const { validateUrl } = require('../middlewares/validateUrlMiddleware');
const urlService = require('../services/urlService');
const { handleError } = require('../middlewares/errorMiddleware');

router.post('/shorten', optionalAuthenticate, validateUrl, async (req, res) => {
  const { url } = req.body;
  const userId = req.user?.userId; // Captura o ID do usuário autenticado ou define como null

  try {
    // Chama o serviço para encurtar a URL
    const newUrl = await urlService.shortenUrl(url, userId);

    const fullShortUrl = `${req.protocol}://${req.get('host')}/urls/redirect/${newUrl.url_encurtada}`;

    return res.status(201).json({
      message: 'URL encurtada com sucesso.',
      id: newUrl?.id,
      shortUrl: fullShortUrl,
      originalUrl: url,
      userId: userId || 'Não associado a um usuário', // Responde se o URL pertence a um usuário ou não
    });
  } catch (error) {
    console.error('Erro ao encurtar URL:', error);
    handleError(error, res); // Middleware para tratamento de erros
  }
});

router.get('/redirect/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const urlRecord = await urlService.getOriginalUrl(shortUrl);
    await urlService.incrementClick(shortUrl);

    return res.redirect(urlRecord.url_original);
  } catch (error) {
    handleError(error, res);
  }
});

router.get('/', authenticate, async (req, res) => {
  const userId = req?.user?.id;

  try {
    const urls = await urlService.listUserUrls(userId);
    return res.status(200).json(urls);
  } catch (error) {
    handleError(error, res);
  }
});

router.put('/:id', authenticate, validateUrl, async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;
  const userId = req.user.id;

  try {
    console.log(id)
    console.log(url)
    console.log(userId)
    await urlService.updateUrl(id, url, userId);
    return res.status(200).json({ message: 'URL atualizada com sucesso.' });
  } catch (error) {
    handleError(error, res);
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await urlService.deleteUrl(id, userId);
    return res.status(200).json({ message: 'URL excluída com sucesso.' });
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
