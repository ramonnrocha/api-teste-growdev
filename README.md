# Clone ChatAI - API

Projeto desenvolvido para teste de vaga na empresa Growdev.

## 📋 Sobre

Projeto desenvolvido para teste de vaga na empresa Growdev. API REST desenvolvida em Node.js com TypeScript para gerenciamento de salas de chat.

## 🛠️ Tecnologias

### Core

- **Fastify** - Framework web rápido e eficiente 
- **Drizzle ORM** - ORM type-safe para PostgreSQL 
- **PostgreSQL** - Banco de dados relacional (com pgvector) 
- **Zod** - Validação de schemas e tipos 
- **TypeScript** - Tipagem estática 
- **Biome** - Linter e formatter 
- **Docker** - Containerização do banco de dados

### Banco de Dados

- **PostgreSQL* Banco de dados relacional
- **TanStack React Query** 5.90.12 - Gerenciamento de estado de servidor e cache

## 🏗️ Padrões de Projeto

- **Type Providers** - Validação de tipos em tempo de execução com Zod 
- **Modularização** - Rotas organizadas em módulos separados 
- **Validação de Ambiente** - Variáveis de ambiente validadas com Zod 
- **Type-Safe Database** - Queries type-safe com Drizzle ORM 
- **CORS** - Configurado para desenvolvimento local

## 🚀 Setup e Instalação

### Pré-requisitos

- Node.js (versão 22 ou superior)
- npm ou yarn


### Instalação 

1. Clone o repositório
 
bash 
  - git clone <url-do-repositorio>

2. Instale as dependências:

bash
  - npm install

3. Configure as variáveis de ambiente criando um arquivo .env:

env
 - PORT=3333
 - NODE_ENV=development
 - DATABASE_URL=postgresql://docker:docker@localhost:5432/chat-api
 
4. Inicie o banco de dados com Docker:

bash
 - docker-compose up -d

5. Execute as migrations (se necessário):

bash
 - npx drizzle-kit migrate
 
## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Inicia o servidor em produção
- `npm run db:generate` - Cria as tabelas do banco de Dados quando ainda não existem
- `npm run db:migrate` - Inicia as migrates do Banco de dados no serviço atual(Docker


## 📁 Estrutura do Projeto

```
src/
├── db/                 # Configuração do banco de dados
│   ├── schema/         # Schemas do Drizzle ORM
│   └── migrations/     # Migrations do banco
├── http/
│   └── routes/         # Rotas da API
├── env.ts              # Validação das variáveis de ambiente
└── server.ts           # Configuração do servidor Fastify

```

## ⚙️ Configuração

- **CORS**: Habilitado para desenvolvimento local
- **Environment Validation**: Centralizada em env.ts
- **Banco de Dados:**: PostgreSQL gerenciado via Docker
