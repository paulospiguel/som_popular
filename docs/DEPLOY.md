# 🚀 Guia de Deploy - Festival Som Popular

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Acesso ao Vercel (ou plataforma de deploy)

## 🔧 Configuração Local

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar banco de dados local
```bash
npm run db:setup
```

### 3. Testar build localmente
```bash
npm run build
```

## 🚀 Deploy no Vercel

### 1. Configuração Automática
O projeto está configurado para deploy automático no Vercel.

### 2. Configuração Manual (se necessário)
```bash
# Fazer login no Vercel
npx vercel login

# Deploy
npx vercel --prod
```

## 📊 Configuração do Banco de Dados

### ⚠️ IMPORTANTE: Após o Deploy

Após o deploy, você DEVE executar as migrations manualmente:

```bash
# Opção 1: Via Vercel CLI
npx vercel env pull .env.production.local
npm run db:setup

# Opção 2: Via Vercel Dashboard
# Execute no terminal do Vercel:
npm run db:setup
```

### Scripts Disponíveis

```bash
# Gerar novas migrations
npm run db:generate

# Aplicar migrations
npm run db:migrate

# Setup completo (generate + migrate)
npm run db:setup

# Abrir Drizzle Studio
npm run db:studio
```

## 🔍 Solução de Problemas

### Erro de Build
Se o build falhar, verifique:

1. **Dependências**: `npm install`
2. **TypeScript**: `npm run lint`
3. **Configuração**: Verifique `next.config.ts`

### Erro de Banco de Dados
Se houver problemas com o banco:

1. **Verificar migrations**: `npm run db:generate`
2. **Aplicar migrations**: `npm run db:migrate`
3. **Verificar schema**: Abra `drizzle/0000_initial_schema.sql`

### Erro de SQLite
Para problemas com SQLite:

1. **Verificar arquivo**: `src/server/database/sqlite.db`
2. **Permissões**: Verificar permissões do arquivo
3. **Caminho**: Verificar `drizzle.config.ts`

## 📁 Estrutura de Arquivos

```
├── drizzle/                 # Migrations e snapshots
├── src/
│   └── server/
│       └── database/       # Schema e conexão
├── scripts/
│   └── setup-db.js        # Script de setup
├── vercel.json            # Configuração Vercel
├── next.config.ts         # Configuração Next.js
└── drizzle.config.ts      # Configuração Drizzle
```

## 🔄 Workflow de Deploy

1. **Desenvolvimento**: `npm run dev`
2. **Teste**: `npm run build`
3. **Deploy**: Push para branch main
4. **Setup DB**: Executar `npm run db:setup` no Vercel
5. **Verificação**: Testar funcionalidades

## 📞 Suporte

Se encontrar problemas:

1. Verificar logs do Vercel
2. Executar `npm run db:setup` localmente
3. Verificar configurações em `next.config.ts`
4. Consultar documentação do Drizzle

---

**Nota**: Este projeto usa SQLite para desenvolvimento. Para produção, considere migrar para PostgreSQL ou MySQL.
