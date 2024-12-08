describe('URL Shortener - Rota Não Autenticada', () => {
  it('Deve permitir encurtar URL sem autenticação', () => {
    cy.request({
      method: 'POST',
      url: '/urls/shorten',
      body: {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('shortUrl');
    });
  });
});

describe('URL Shortener - Rota Autenticada', () => {
  let token;
  let route;

  before(() => {
    const randomName = `user${Date.now()}`; // Gera um nome único
    const email = `${randomName}@exemplo.com`; // Email único para o usuário

    // Criação do usuário
    cy.request({
      method: 'POST',
      url: '/auth/register',
      body: {
        name: randomName,
        email: email,
        password: 'senha123',
      },
    }).then(() => {
      cy.request({
        method: 'POST',
        url: '/auth/login',
        body: {
          email: email,
          password: 'senha123',
        },
      }).then((loginResponse) => {
        token = loginResponse.body.token;
      });
    });
  });

  it('Deve permitir encurtar URL com autenticação', () => {
    cy.request({
      method: 'POST',
      url: '/urls/shorten',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('shortUrl');
      route = response.body.id; 

    });
  });

  it('Deve permitir atualizar uma URL existente', () => {
    cy.request({
      method: 'PUT',
      url: `/urls/${route}`,
      headers: { Authorization: `Bearer ${token}` },
      body: { url: 'https://www.updated-url.com' },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('URL atualizada com sucesso.');
    });
  });
});

describe('URL Shortener - Redirecionamento', () => {
  let shortUrl;

  before(() => {
    // Cria uma URL para encurtar antes de testar o redirecionamento
    cy.request({
      method: 'POST',
      url: '/urls/shorten',
      body: {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    }).then((response) => {
      shortUrl = response.body.shortUrl; // Captura o short URL gerado
    });
  });

  it('Deve redirecionar para a URL original', () => {
    cy.request({
      method: 'GET',
      url: shortUrl, // Usa apenas o short URL gerado sem a URL base
      followRedirect: false, // Impede o Cypress de seguir o redirecionamento
    }).then((response) => {
      expect(response.status).to.eq(302);
      expect(response.redirectedToUrl).to.eq('https://www.youtube.com/watch?v=dQw4w9WgXcQ'); // Substitua pela URL original
    });
  });
});


describe('URL Shortener - Listar URLs Autenticado', () => {
  let token;

  before(() => {
    // Cria um usuário aleatório e faz o login para obter o token JWT
    const randomName = `user${Date.now()}`; // Gera um nome único
    const email = `${randomName}@exemplo.com`; // Email único para o usuário

    // Criação do usuário
    cy.request({
      method: 'POST',
      url: '/auth/register',
      body: {
        name: randomName,
        email: email,
        password: 'senha123',
      },
    }).then(() => {
      // Faz login para obter o token
      cy.request({
        method: 'POST',
        url: '/auth/login',
        body: {
          email: email,
          password: 'senha123',
        },
      }).then((loginResponse) => {
        token = loginResponse.body.token;
      });
    });
  });

  it('Deve listar URLs do usuário autenticado', () => {
    cy.request({
      method: 'GET',
      url: '/urls',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array'); // Retorna um array de URLs
    });
  });

});

