# 🎤 Plataforma de Gestão de Festival de Talentos e Música

## 🎯 Objetivo

Criar uma plataforma digital para organizar festivais de talentos e música, oferecendo:

- Inscrição pública e simples para participantes
- Gestão administrativa centralizada
- Publicação transparente de resultados
- Auditoria e histórico anual

---

## 🧩 Módulos do Sistema

### 1. 🌐 Web Pública (Participantes)

- Visualização de eventos futuros
- Formulário de inscrição online
  - Nome do candidato/banda/dupla
  - Representante da instituição
  - Email válido (confirmação e notificações)
  - Telefone de contacto
  - Estilo musical
  - Upload de foto (opcional, exibida no ranking)
  - Aceite obrigatório do regulamento (PDF deve ser lido antes)
- Aprovação automática da inscrição
  - O administrador pode **indeferir** com motivo justificado
- Geração de **QRCode** para credenciamento
- Página pública com:
  - Status da inscrição
  - Ranking em tempo real
  - Classificação por fases e premiação

---

### 2. 🛠️ Dashboard Administrativo

- Gestão de eventos
  - Nome, local, regulamento, premiação
  - Definição de fases: classificatórias, semi-final, final
  - Datas das fases definidas previamente e notificadas aos inscritos  
    (em caso de alteração, todos são novamente notificados)
- Gestão de participantes
  - Aprovação/indeferimento de inscrições (com motivo)
  - Penalização ou desclassificação
- Gestão das fases e classificação
  - Registro de notas pelo operador/administrador (sem login de jurado nesta versão)
  - Seleção automática de classificados para próximas fases
  - Registro de 1º, 2º e 3º lugares na final
- Notificações automáticas por e-mail
- Auditoria:
  - Logs de ações
  - Relatórios exportáveis (PDF/CSV)

---

### 3. 📱 Página Pública Mobile (Ranking e Etapas)

- Interface responsiva (mobile-first)
- Pesquisa por nome para verificar posição e status
- Exibição da foto do candidato (se enviada)
- Ranking atualizado em tempo real
- Destaque de classificados por etapa
- Resultado final com 1º, 2º e 3º colocados

---

## 📊 Regras de Negócio

- Inscrição pode ser **online** (pelo candidato) ou **presencial** (via operador)
- Aprovação automática, mas administrador pode indeferir com justificativa
- Regulamento deve ser aceito obrigatoriamente
- Classificação baseada na **soma das notas**
- Critérios de desempate definidos no regulamento
- Fases do evento: **classificatórias → semi-final → final**
- **Notas do dia** devem ser publicadas no mesmo dia da apresentação
- Transparência garantida para público e participantes
- Histórico reiniciado a cada edição, mas registros ficam disponíveis para auditoria

---

## 🛡️ Segurança e Auditoria

- Logs de todas as ações administrativas
- Registo de origem da inscrição (público ou operador)
- Registo de origem das notas (verbal/papel)
- Perfil auditor com acesso a relatórios

---

# 🎨 Design System — Festival Som Popular

## 🌈 Paleta de Cores

- **Marrom Terra**: `#4E342E` (tradição, fundo)
- **Dourado/Mostarda**: `#D9A441` (palco, calor, destaque)
- **Verde Folha**: `#2E7D32` (natureza, tradição)
- **Vermelho Cultura**: `#C62828` (paixão, energia)
- **Branco Neve**: `#FFFFFF` (texto em fundos escuros)
- **Cinza Escuro**: `#333333` (texto secundário)

## ✍️ Tipografia

- **Título / Branding:** _Rye_ ou _Baloo 2_ (Google Fonts) — estilo rústico e forte
- **Subtítulos / Destaques:** _Roboto Slab_ (Google Fonts) — clara e elegante
- **Texto Corrido / Interface:** _Inter_ ou _Roboto_ (Google Fonts) — alta legibilidade

## 🖼️ Estilo Visual

- **Formas:** circulares, faixas, selos de festival
- **Ícones:** violão/viola caipira, microfone vintage, notas musicais, folhas
- **Botões:**
  - Fundo marrom ou verde
  - Texto branco bold
  - Hover em dourado
- **Cards de Participantes:**
  - Fundo bege/dourado
  - Borda marrom
  - Foto circular
  - Nome em destaque + estilo musical secundário

## 📱 Estilo Mobile

- **Ranking:** fundo claro, medalhas (ouro, prata, bronze) para top 3
- **Botões:** arredondados, fundo verde/vermelho, texto branco
- **Destaques:** fotos circulares + posição no ranking
