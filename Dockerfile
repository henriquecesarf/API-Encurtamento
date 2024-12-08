# Escolha uma imagem base
FROM node:18

# Crie e defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos do projeto para o container
COPY . .

# Instale as dependências
RUN npm install

# Exponha a porta que o aplicativo usará
EXPOSE 4130

# Comando para rodar a aplicação
CMD ["npm", "run", "dev"]
