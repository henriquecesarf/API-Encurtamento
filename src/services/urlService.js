const { URL } = require('../models');
const { nanoid } = require('nanoid');

module.exports = {
  async shortenUrl(url, userId) {
    try {
      // Validação de URL simples
      const isValidUrl = /^(https?:\/\/)?([\w\d\-]+\.)+[a-z]+(\/[^\s]*)?$/i.test(url);
      if (!isValidUrl) {
        throw new Error('URL fornecida não é válida.');
      }
  
      // Geração de um ID curto único
      const shortUrl = nanoid(6);
  
      // Criação da entrada no banco de dados
      const newUrl = await URL.create({
        url_original: url,
        url_encurtada: shortUrl,
        usuario_id: userId, // Pode ser null se o usuário não estiver autenticado
      });
  
      return newUrl;
    } catch (error) {
      console.error('Erro no serviço de encurtamento:', error);
      throw error; // Propaga o erro para ser tratado pela rota
    }
  },

  async getOriginalUrl(shortUrl) {
    try {
      const urlRecord = await URL.findOne({
        where: { url_encurtada: shortUrl, deletedAt: null },
      });

      if (!urlRecord) {
        throw new Error('URL não encontrada.');
      }

      return urlRecord;
    } catch (error) {
      throw new Error(`Erro ao encontrar URL original: ${error.message}`);
    }
  },

  async incrementClick(shortUrl) {
    try {
      const urlRecord = await URL.findOne({
        where: { url_encurtada: shortUrl, deletedAt: null },
      });

      if (!urlRecord) {
        throw new Error('URL não encontrada.');
      }

      await urlRecord.increment('cliques');

      return urlRecord;
    } catch (error) {
      throw new Error(`Erro ao incrementar cliques: ${error.message}`);
    }
  },

  async listUserUrls(userId) {
    try {
      const urls = await URL.findAll({
        where: { usuario_id: userId, deletedAt: null },
        attributes: ['id', 'url_original', 'url_encurtada', 'cliques', 'createdAt', 'updatedAt', 'deletedAt'],
      });

      return urls;
    } catch (error) {
      throw new Error(`Erro ao listar URLs: ${error.message}`);
    }
  },

  async updateUrl(id, newUrl, userId) {
    try {
      const urlRecord = await URL.findOne({
        where: { id, usuario_id: userId, deletedAt: null },
      });

      if (!urlRecord) {
        throw new Error('URL não encontrada.');
      }

      urlRecord.url_original = newUrl;
      await urlRecord.save();

      return urlRecord;
    } catch (error) {
      throw new Error(`Erro ao atualizar URL: ${error.message}`);
    }
  },

  async deleteUrl(id, userId) {
    try {
      const urlRecord = await URL.findOne({
        where: { id, usuario_id: userId, deletedAt: null },
      });

      if (!urlRecord) {
        throw new Error('URL não encontrada.');
      }

      urlRecord.deletedAt = new Date();
      await urlRecord.save();

      return urlRecord;
    } catch (error) {
      throw new Error(`Erro ao excluir URL: ${error.message}`);
    }
  },
};
