# Configuração do Banco de Dados PostgreSQL

Este projeto usa PostgreSQL como banco de dados principal, tanto para desenvolvimento quanto para produção.

## 🐘 PostgreSQL com Docker

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ 
- npm ou yarn

### 🚀 Início Rápido

1. **Clonar e instalar dependências:**
```bash
git clone <repo>
cd som_popular
npm install
```

2. **Iniciar PostgreSQL com Docker:**
```bash
npm run docker:up
```

3. **Configurar banco de dados:**
```bash
npm run db:setup
```

4. **Iniciar aplicação:**
```bash
npm run dev
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/som_popular

# Autenticação
BETTER_AUTH_SECRET=your-super-secret-key
BETTER_AUTH_TELEMETRY=0

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your-email@domain.com

# Upload de Arquivos
STORAGE_PROVIDER=local
```

### Docker Compose

O arquivo `docker-compose.yml` inclui:

- **PostgreSQL 16 Alpine** - Banco de dados principal
- **Adminer** - Interface web para administração (http://localhost:8080)

## 📝 Comandos Disponíveis

### Docker
```bash
npm run docker:up        # Iniciar containers
npm run docker:down      # Parar containers
npm run docker:logs      # Ver logs do PostgreSQL
```

### Banco de Dados
```bash
npm run db:generate      # Gerar migrações
npm run db:migrate       # Executar migrações
npm run db:push          # Push schema (desenvolvimento)
npm run db:setup         # Setup completo (generate + migrate)
npm run db:studio        # Abrir Drizzle Studio
```

### Aplicação
```bash
npm run dev              # Servidor de desenvolvimento
npm run build            # Build para produção
npm run start            # Servidor de produção
npm run lint             # Executar linter
```

## 🗄️ Schema do Banco

O projeto usa Drizzle ORM com os seguintes schemas:

### Principais Tabelas

- **`participants`** - Participantes do festival
- **`events`** - Eventos e competições
- **`judges`** - Jurados e avaliadores
- **`event_evaluations`** - Avaliações dos participantes
- **`system_logs`** - Logs do sistema
- **`user`** - Usuários do sistema
- **`session`** - Sessões de usuário

### Tipos PostgreSQL Utilizados

- `varchar()` - Strings com limite de caracteres
- `text` - Texto longo
- `boolean` - Valores verdadeiro/falso
- `integer` - Números inteiros
- `timestamp with timezone` - Data/hora com fuso horário

## 🌐 Ambientes

### Desenvolvimento
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/som_popular
```

### Produção
```env
DATABASE_URL=postgresql://username:password@prod-host:5432/som_popular
```

## 🔍 Administração

### Adminer (Interface Web)
- URL: http://localhost:8080
- Sistema: PostgreSQL
- Servidor: postgres
- Usuário: postgres
- Senha: postgres
- Base de dados: som_popular

### Drizzle Studio
```bash
npm run db:studio
```
- Interface moderna para visualizar e editar dados
- Geração automática de queries
- Visualização de relacionamentos

## 🛠️ Troubleshooting

### Container não inicia
```bash
# Verificar se a porta 5432 está livre
lsof -i :5432

# Parar containers existentes
npm run docker:down

# Limpar volumes (CUIDADO: apaga dados)
docker-compose down -v
```

### Erro de conexão
```bash
# Verificar se o container está rodando
docker-compose ps

# Ver logs do PostgreSQL
npm run docker:logs

# Testar conexão
psql postgresql://postgres:postgres@localhost:5432/som_popular
```

### Migrações falham
```bash
# Gerar novas migrações
npm run db:generate

# Verificar status das migrações
npm run db:studio

# Reset completo (CUIDADO: apaga dados)
npm run docker:down
docker volume rm som_popular_postgres_data
npm run docker:up
npm run db:setup
```

### Problemas de permissão
```bash
# Verificar permissões do Docker
sudo usermod -aG docker $USER
# Fazer logout/login após este comando
```

## 📊 Monitoramento

### Logs do PostgreSQL
```bash
npm run docker:logs
```

### Métricas do Container
```bash
docker stats som_popular_postgres
```

### Backup do Banco
```bash
docker exec som_popular_postgres pg_dump -U postgres som_popular > backup.sql
```

### Restaurar Backup
```bash
docker exec -i som_popular_postgres psql -U postgres som_popular < backup.sql
```
