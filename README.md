
# URL Shortener Project

Este é um projeto de encurtador de URLs com testes automatizados usando **Cypress**. O projeto permite que os usuários encurtem URLs, listem URLs encurtadas e atualizem uma URL existente, com autenticação JWT para proteger rotas sensíveis.

## Funcionalidades

- **Registrar um usuário**: Permite que novos usuários se registrem.
- **Login do usuário**: Usuários podem fazer login e obter um token JWT.
- **Encurtar URLs**: Usuários autenticados podem encurtar URLs.
- **Redirecionamento**: Quando o usuário acessa um link encurtado, ele é redirecionado para a URL original.
- **Listar URLs**: Usuários autenticados podem listar todas as URLs encurtadas.
- **Atualizar URLs**: Usuários autenticados podem atualizar as URLs encurtadas.

## Estrutura do Projeto

- **Backend (Node.js + Express)**: O servidor backend responsável pela lógica do encurtador de URLs e autenticação.
- **Banco de Dados (MySQL)**: Armazena as URLs encurtadas e os dados dos usuários.
- **Cypress**: Framework de testes end-to-end para validar as funcionalidades do encurtador de URLs.

## Instalação

Para rodar o projeto localmente, siga as etapas abaixo:

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/url-shortener.git
cd url-shortener
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Rodar a aplicação

```bash
docker-compose up
```

### 4. Rodar os testes com Cypress

```bash
npx cypress open
```

## Endpoints da API

### `POST /auth/register`
Cria um novo usuário.
- **Body**: 
  ```json
  {
    "name": "user",
    "email": "user@example.com",
    "password": "password"
  }
  ```

### `POST /auth/login`
Realiza o login e retorna um token JWT.
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```

### `POST /urls/shorten`
Encurta uma URL.
- **Body**:
  ```json
  {
    "url": "https://www.example.com"
  }
  ```

### `GET /urls`
Lista todas as URLs encurtadas do usuário autenticado.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer {token}"
  }
  ```

### `PUT /urls/:id`
Atualiza uma URL encurtada.
- **Body**:
  ```json
  {
    "url": "https://www.updated-url.com"
  }
  ```

### `GET /urls/redirect/:shortUrl`
Redireciona para a URL original associada ao `shortUrl`.
- **URL Example**: `http://localhost:4130/urls/redirect/abc123`

## Documentação da API - Swagger

Este projeto utiliza o **Swagger** para fornecer uma documentação interativa da API. O Swagger permite que você visualize e interaja com os endpoints da API de maneira fácil e eficiente.

### Como acessar o Swagger

Após rodar o servidor localmente, você pode acessar a documentação do Swagger navegando para a URL:

```
http://localhost:4130/api-docs
```

### Funcionalidades do Swagger

- **Visualização de Endpoints**: A documentação exibe todos os endpoints disponíveis, incluindo o método HTTP, a URL e uma descrição de cada funcionalidade.
- **Interatividade**: Você pode testar os endpoints diretamente na interface do Swagger, enviando requisições de exemplo e visualizando as respostas.

### Exemplo de uso:

1. **Registrar um usuário**
   - Endpoint: `POST /auth/register`
   - Parâmetros:
     ```json
     {
       "name": "user",
       "email": "user@example.com",
       "password": "password"
     }
     ```
   - Resposta esperada: Status 201 (Criado)

2. **Encurtar uma URL**
   - Endpoint: `POST /urls/shorten`
   - Parâmetros:
     ```json
     {
       "url": "https://www.example.com"
     }
     ```
   - Resposta esperada: Status 201 (Criado) com o link encurtado

3. **Redirecionar para URL original**
   - Endpoint: `GET /urls/redirect/{shortUrl}`
   - Parâmetros: `{shortUrl}` (Código da URL encurtada)
   - Resposta esperada: Status 302 (Redirecionado)

## Testes Automatizados com Cypress

O projeto usa o Cypress para testar as funcionalidades do encurtador de URLs. Os testes incluem as seguintes funcionalidades:

1. **Encurtar URL sem autenticação**.
2. **Encurtar URL com autenticação**.
3. **Redirecionar para a URL original** a partir de um link encurtado.
4. **Listar URLs do usuário autenticado**.
5. **Atualizar uma URL existente**.

### Comandos de Teste

- **Rodar os testes no Cypress**:
  - No terminal, execute o comando abaixo para rodar os testes:

    ```bash
    npx cypress open
    ```

    Isso abrirá a interface do Cypress para você interagir com os testes.

- **Rodar os testes em modo headless (sem interface gráfica)**:

    ```bash
    npx cypress run
    ```

## Exemplos de Testes com Cypress

Aqui estão alguns exemplos de testes realizados no projeto com o framework Cypress:

### **1. Encurtar uma URL**

O primeiro teste verifica se o encurtamento de uma URL está funcionando corretamente. Ele faz um `POST` para o endpoint `/urls/shorten` e valida a resposta.

```javascript
describe('URL Shortener - Encurtar URL', () => {
  let token;

  before(() => {
    // Criação e login do usuário
    cy.request({
      method: 'POST',
      url: '/auth/register',
      body: {
        name: 'user',
        email: 'user@example.com',
        password: 'password',
      },
    }).then(() => {
      cy.request({
        method: 'POST',
        url: '/auth/login',
        body: {
          email: 'user@example.com',
          password: 'password',
        },
      }).then((response) => {
        token = response.body.token;
      });
    });
  });

  it('Deve encurtar uma URL com sucesso', () => {
    cy.request({
      method: 'POST',
      url: '/urls/shorten',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        url: 'https://www.example.com',
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.shortUrl).to.exist;
    });
  });
});
```

### **2. Listar URLs do usuário autenticado**

Este teste verifica se a listagem de URLs do usuário autenticado funciona corretamente.

```javascript
describe('URL Shortener - Listar URLs Autenticado', () => {
  let token;

  before(() => {
    // Criação e login do usuário
    cy.request({
      method: 'POST',
      url: '/auth/register',
      body: {
        name: 'user',
        email: 'user@example.com',
        password: 'password',
      },
    }).then(() => {
      cy.request({
        method: 'POST',
        url: '/auth/login',
        body: {
          email: 'user@example.com',
          password: 'password',
        },
      }).then((response) => {
        token = response.body.token;
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
      expect(response.body).to.be.an('array');
    });
  });
});
```

### **3. Atualizar uma URL existente**

Este teste valida se é possível atualizar uma URL previamente encurtada.

```javascript
describe('URL Shortener - Atualizar URL', () => {
  let token;
  let urlId;

  before(() => {
    // Criação e login do usuário
    cy.request({
      method: 'POST',
      url: '/auth/register',
      body: {
        name: 'user',
        email: 'user@example.com',
        password: 'password',
      },
    }).then(() => {
      cy.request({
        method: 'POST',
        url: '/auth/login',
        body: {
          email: 'user@example.com',
          password: 'password',
        },
      }).then((response) => {
        token = response.body.token;

        // Criação de uma URL para teste
        cy.request({
          method: 'POST',
          url: '/urls/shorten',
          headers: { Authorization: `Bearer ${token}` },
          body: { url: 'https://www.example.com' },
        }).then((response) => {
          urlId = response.body.id;
        });
      });
    });
  });

  it('Deve permitir atualizar uma URL existente', () => {
    cy.request({
      method: 'PUT',
      url: `/urls/${urlId}`,
      headers: { Authorization: `Bearer ${token}` },
      body: { url: 'https://www.updated-url.com' },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('URL atualizada com sucesso.');
    });
  });
});
```


---

**Nota**: Certifique-se de ter o Node.js e o MySQL instalados para rodar o projeto localmente.
