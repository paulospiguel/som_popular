# 🎵 Som Popular - Plataforma de Gestão de Festivais

Uma plataforma moderna e completa para organizar festivais de talentos e música popular, construída com Next.js 15, PostgreSQL e Docker.

## ✨ Funcionalidades

- 🎤 **Gestão de Participantes** - Cadastro, aprovação e acompanhamento
- 🎪 **Gestão de Eventos** - Criação e configuração de competições
- 👨‍⚖️ **Sistema de Avaliação** - Interface para jurados avaliarem participantes
- 📊 **Rankings e Relatórios** - Visualização de resultados e estatísticas
- 🔐 **Autenticação Segura** - Sistema completo de login e permissões
- 📧 **Notificações por Email** - Comunicação automatizada
- 📱 **Interface Responsiva** - Funciona em desktop e mobile

## 🚀 Início Rápido

### Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/) e Docker Compose
- [Git](https://git-scm.com/)

### Instalação

1. **Clone o repositório:**
```bash
git clone <repository-url>
cd som_popular
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Inicie o PostgreSQL:**
```bash
npm run docker:up
```

5. **Configure o banco de dados:**
```bash
npm run db:setup
```

6. **Inicie a aplicação:**
```bash
npm run dev
```

7. **Acesse a aplicação:**
- Aplicação: http://localhost:3000
- Adminer (DB): http://localhost:8080
- Drizzle Studio: `npm run db:studio`

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Framework CSS
- **Radix UI** - Componentes acessíveis
- **Framer Motion** - Animações
- **Lucide React** - Ícones

### Backend
- **Next.js API Routes** - Backend integrado
- **PostgreSQL 16** - Banco de dados principal
- **Drizzle ORM** - ORM type-safe
- **Better Auth** - Sistema de autenticação
- **Resend** - Serviço de email
- **Zod** - Validação de schemas

### DevOps & Ferramentas
- **Docker & Docker Compose** - Containerização
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Drizzle Studio** - Interface de banco de dados

## 📁 Estrutura do Projeto

```
som_popular/
├── src/
│   ├── app/                 # App Router (Next.js 15)
│   │   ├── (protected)/     # Rotas protegidas
│   │   ├── api/            # API Routes
│   │   └── auth/           # Páginas de autenticação
│   ├── components/         # Componentes React
│   │   ├── ui/             # Componentes base
│   │   └── dashboard/      # Componentes específicos
│   ├── server/             # Lógica do servidor
│   │   ├── database/       # Schemas e configuração DB
│   │   └── *.ts           # Funções do servidor
│   ├── lib/               # Utilitários e configurações
│   └── styles/            # Estilos globais
├── docs/                  # Documentação
├── drizzle/              # Migrações do banco
├── docker-compose.yml    # Configuração Docker
└── package.json         # Dependências e scripts
```

## 📋 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev              # Servidor de desenvolvimento
npm run lint             # Executar linter
npm run build            # Build para produção
npm run start            # Servidor de produção
```

### Banco de Dados
```bash
npm run db:generate      # Gerar migrações
npm run db:migrate       # Executar migrações
npm run db:push          # Push schema (desenvolvimento)
npm run db:setup         # Setup completo
npm run db:studio        # Abrir Drizzle Studio
```

### Docker
```bash
npm run docker:up        # Iniciar PostgreSQL
npm run docker:down      # Parar containers
npm run docker:logs      # Ver logs do PostgreSQL
```

## 🔧 Configuração

### Variáveis de Ambiente

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

### Banco de Dados

O projeto usa PostgreSQL com as seguintes tabelas principais:

- `participants` - Participantes do festival
- `events` - Eventos e competições
- `judges` - Jurados e avaliadores
- `event_evaluations` - Avaliações
- `system_logs` - Logs do sistema
- `user`, `session`, `account` - Autenticação

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte seu repositório no Vercel**
2. **Configure as variáveis de ambiente**
3. **Configure o banco PostgreSQL** (Vercel Postgres, Supabase, etc.)
4. **Deploy automático** ✨

### Docker

```bash
# Build da imagem
docker build -t som-popular .

# Executar com docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Documentação

- [Configuração do Banco de Dados](docs/database-setup.md)
- [Sistema de Upload](docs/upload-system.md)
- [Sistema de Logs](docs/logs-system.md)
- [Regulamento de Eventos](docs/regulamento-eventos.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a [documentação](docs/)
2. Procure em [Issues existentes](../../issues)
3. Crie uma [nova Issue](../../issues/new)

---

**Desenvolvido com ❤️ para a comunidade musical**
