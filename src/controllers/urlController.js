const { URL } = require('../models');
const { nanoid } = require('nanoid');

module.exports = {
  async shorten(req, res) {
    try {
      const { url } = req.body;
      const userId = req.user?.id || null;

      const shortUrl = nanoid(6);

      await URL.create({
        url_original: url,
        url_encurtada: shortUrl,
        usuario_id: userId,
      });

      return res.status(201).json({ message: 'URL encurtada com sucesso.', shortUrl: `${req.headers.host}/${shortUrl}` });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao encurtar URL.', error: error.message });
    }
  },

  async redirect(req, res) {
    try {
      const { shortUrl } = req.params;

      const urlRecord = await URL.findOne({ where: { url_encurtada: shortUrl, deletado_em: null } });

      if (!urlRecord) {
        return res.status(404).json({ message: 'URL não encontrada.' });
      }

      await urlRecord.increment('cliques');

      return res.redirect(urlRecord.url_original);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao redirecionar URL.', error: error.message });
    }
  },

  async list(req, res) {
    try {
      const userId = req.user.id;

      const urls = await URL.findAll({
        where: { usuario_id: userId, deletado_em: null },
        attributes: ['id', 'url_original', 'url_encurtada', 'cliques', 'createdAt', 'updatedAt'],
      });

      return res.status(200).json(urls);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao listar URLs.', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { url } = req.body;
      const userId = req.user.id;

      const urlRecord = await URL.findOne({ where: { id, usuario_id: userId, deletado_em: null } });

      if (!urlRecord) {
        return res.status(404).json({ message: 'URL não encontrada.' });
      }

      urlRecord.url_original = url;
      await urlRecord.save();

      return res.status(200).json({ message: 'URL atualizada com sucesso.' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao atualizar URL.', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const urlRecord = await URL.findOne({ where: { id, usuario_id: userId, deletado_em: null } });

      if (!urlRecord) {
        return res.status(404).json({ message: 'URL não encontrada.' });
      }

      urlRecord.deletado_em = new Date();
      await urlRecord.save();

      return res.status(200).json({ message: 'URL excluída com sucesso.' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao excluir URL.', error: error.message });
    }
  },
};
