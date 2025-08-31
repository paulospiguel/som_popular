# Sistema de Regulamentos por Evento

## Visão Geral

O sistema de regulamentos foi atualizado para ser individual por evento, permitindo que cada evento tenha seu próprio regulamento em PDF e regras específicas. Além disso, foram implementadas funcionalidades para permitir que participantes existentes se inscrevam em múltiplos eventos.

## Mudanças Implementadas

### 1. Banco de Dados

- **Novo campo**: `regulation_pdf` na tabela `events`
- **Novo campo**: `ranking_photo` na tabela `participants` (foto opcional para ranking)
- **Tipo**: TEXT (imagem em base64)
- **Migrações**: Serão geradas automaticamente pelo CLI do Drizzle

### 2. Estrutura de Arquivos

- **Página principal**: `/regulation` - Lista todos os eventos disponíveis
- **Página específica**: `/regulation/[id]` - Exibe regulamento de um evento específico
- **Componente**: `PDFViewer.tsx` - Visualizador PDF reutilizável

### 3. Funcionalidades

#### Página Principal de Regulamentos (`/regulation`)

- Lista todos os eventos públicos
- Mostra informações básicas de cada evento (nome, data, local, categoria)
- Botão "Ver Regulamento" para cada evento
- Mensagem informativa sobre como acessar os regulamentos

#### Página Específica de Regulamento (`/regulation/[id]`)

- Carrega dados do evento específico
- Exibe regulamento em PDF usando visualizador integrado
- Fallback para regras textuais se PDF não estiver disponível
- Botões para download e abertura em nova aba
- Navegação de volta ao evento

#### Componente PDFViewer

- Visualizador PDF responsivo
- Estados de carregamento e erro
- Botões para download e abertura em nova aba
- Fallback para conteúdo alternativo
- Tratamento de erros robusto

#### Sistema de Participantes Multi-Eventos

- **Email como validador único**: Um participante pode participar em múltiplos eventos
- **Atualização automática**: Participantes existentes podem atualizar informações e se inscrever em novos eventos
- **Foto para ranking**: Upload discreto de imagem opcional para exibir no ranking (sistema de upload integrado)
- **Verificação em tempo real**: Sistema detecta emails duplicados e oferece opções

### 4. Integração com Eventos

- **EventsSection**: Adicionado botão "Regulamento" em cada card de evento
- **Links dinâmicos**: Cada evento linka para seu regulamento específico
- **Dados em tempo real**: Busca eventos do banco de dados
- **Regulamento contextual**: Link do regulamento muda baseado no evento selecionado

### 5. Rotas

```
/regulation                    # Lista todos os eventos
/regulation/[id]              # Regulamento específico de um evento
```

## Como Usar

### Para Administradores

1. **Adicionar PDF**: Configure o campo `regulation_pdf` no evento
2. **Regras textuais**: Use o campo `rules` como fallback
3. **Status**: Eventos devem estar como "published" ou "ongoing"

### Para Usuários

1. **Acessar regulamentos**: Navegue para `/regulation`
2. **Ver evento específico**: Clique em "Ver Regulamento" no card do evento
3. **Visualizar PDF**: Use o visualizador integrado ou baixe o arquivo
4. **Navegação**: Use os botões de navegação para voltar aos eventos
5. **Participação múltipla**: Use o mesmo email para se inscrever em diferentes eventos

### Para Participantes

1. **Registro inicial**: Preencha o formulário com suas informações
2. **Foto opcional**: Faça upload discreto de uma imagem para aparecer no ranking
3. **Participação múltipla**: Use o mesmo email para se inscrever em novos eventos
4. **Atualizações**: Suas informações são atualizadas automaticamente

## Benefícios

- **Individualização**: Cada evento tem seu próprio regulamento
- **Flexibilidade**: Suporte para PDFs e regras textuais
- **Experiência do usuário**: Visualizador PDF integrado e responsivo
- **Manutenibilidade**: Componente reutilizável e código limpo
- **Fallbacks**: Múltiplas opções de exibição de conteúdo
- **Multi-eventos**: Participantes podem participar em múltiplos eventos
- **Validação única**: Email como identificador único do participante
- **Ranking visual**: Fotos opcionais para melhorar a experiência do ranking

## Próximos Passos

1. **Upload de PDFs**: Implementar sistema de upload para administradores
2. **Upload de fotos**: Sistema de upload de fotos para ranking (sistema completo implementado)
3. **Cache**: Adicionar cache para melhorar performance
4. **Versões**: Sistema de versionamento de regulamentos
5. **Notificações**: Alertas quando regulamentos são atualizados
6. **Analytics**: Rastreamento de visualizações de regulamentos
7. **Gestão de fotos**: Sistema de moderação de fotos do ranking

## Migrações do Banco de Dados

⚠️ **IMPORTANTE**: Nunca edite manualmente os arquivos de migração do Drizzle!

### Processo Correto para Migrações:

1. **Atualizar o schema** em `src/server/database/schema.ts`
2. **Executar o comando** para gerar migrações:
   ```bash
   npx drizzle-kit generate
   ```
3. **Aplicar as migrações**:
   ```bash
   npx drizzle-kit push
   ```

### Arquivos que NÃO devem ser editados manualmente:

- `drizzle/*.sql` - Arquivos de migração
- `drizzle/meta/*.json` - Snapshots e journal
- `drizzle.config.ts` - Configuração do Drizzle

### Arquivos que DEVEM ser editados:

- `src/server/database/schema.ts` - Schema do banco de dados
- Interfaces TypeScript relacionadas
- Código da aplicação que usa os novos campos

## Arquivos Modificados

- `src/server/database/schema.ts` - Adicionado campo regulationPdf e rankingPhoto
- `src/server/events-public.ts` - Interface e funções atualizadas
- `src/server/participants-public.ts` - Sistema de participantes multi-eventos
- `src/components/EventsSection.tsx` - Botão de regulamento adicionado
- `src/app/regulation/page.tsx` - Página principal atualizada
- `src/app/regulation/[id]/page.tsx` - Nova página específica
- `src/app/participant-registration/page.tsx` - Sistema de registro atualizado
- `src/components/PDFViewer.tsx` - Novo componente
- `src/components/ui/discrete-image-upload.tsx` - Componente de upload discreto
- `src/server/upload.ts` - Sistema de upload de arquivos (Server Action)
- `src/schemas/participant.ts` - Schema atualizado com rankingPhoto
- `drizzle/meta/_journal.json` - Journal (será atualizado automaticamente pelo CLI)

## Fluxo de Participação Multi-Eventos

1. **Primeira inscrição**: Participante se registra com email único
2. **Inscrições subsequentes**: Usa o mesmo email para novos eventos
3. **Atualizações**: Informações são atualizadas automaticamente
4. **Validação**: Email sempre serve como identificador único
5. **Ranking**: Foto opcional é exibida em todos os rankings
