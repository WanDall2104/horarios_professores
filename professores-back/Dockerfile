FROM node:20

# Instalar Yarn
RUN npm install -g yarn --force

WORKDIR /app

# Copiar package.json e yarn.lock
COPY package*.json yarn.lock* ./

# Instalar dependências
RUN yarn install

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN yarn prisma generate

# Build da aplicação
RUN yarn build

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["yarn", "start"]
