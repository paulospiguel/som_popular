# Quickstart: Plataforma de Festivais de Talentos e Música

## Pré-requisitos

- Node.js 20+
- PostgreSQL
- Instalar dependências: `npm install`
- Configurar `.env` conforme `env.example`

## Passos para rodar localmente

1. Clone o repositório e acesse a pasta do projeto
2. Instale as dependências: `npm install`
3. Configure o banco de dados PostgreSQL e ajuste as variáveis de ambiente
4. Rode as migrações: `npm run db:migrate`
5. Inicie o servidor: `npm run dev`
6. Acesse `http://localhost:3000` para visualizar a aplicação

## Fluxo de Testes

- Para rodar testes: `npm test`
- Para rodar testes de contrato: `npm run test:contracts`
- Para rodar testes de integração: `npm run test:integration`

## Observações

- Utilize sempre os componentes definidos no stack (`shadcn-ui`, `reui.io`, `OriginUi`, etc.)
- Siga as instruções de componentização e evite duplicidade de código
- Para dúvidas sobre padrões, consulte `dev-instructions.md` e a documentação dos pacotes
