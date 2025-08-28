# Sistema de Logs com Classificação de Severidade

## Visão Geral

O sistema de logs implementa uma classificação de severidade para permitir que os administradores identifiquem rapidamente atividades que requerem atenção imediata.

## Níveis de Severidade

### 1. Critical (Crítico)

- **Cor**: Vermelho
- **Prioridade**: 1 (Mais alta)
- **Descrição**: Problemas que requerem atenção imediata
- **Exemplos**:
  - Falhas de segurança
  - Erros críticos do sistema
  - Tentativas de acesso não autorizado
  - Falhas na criação/edição de eventos

### 2. Major (Maior)

- **Cor**: Laranja
- **Prioridade**: 2
- **Descrição**: Problemas importantes que devem ser resolvidos em breve
- **Exemplos**:
  - Tentativas de ações inválidas
  - Falhas de validação
  - Problemas de permissões

### 3. Minor (Menor)

- **Cor**: Amarelo
- **Prioridade**: 3
- **Descrição**: Problemas menores ou informativos
- **Exemplos**:
  - Ações bem-sucedidas
  - Informações de auditoria
  - Atualizações de status

### 4. None (Sem Classificação)

- **Cor**: Cinza
- **Prioridade**: 4 (Mais baixa)
- **Descrição**: Logs informativos sem classificação específica
- **Exemplos**:
  - Logs de sistema padrão
  - Informações gerais

## Como Usar

### 1. Criar Log do Sistema

```typescript
import { createSystemLog } from "@/actions/logs";

// Log crítico
await createSystemLog({
  action: "security_breach",
  category: "security",
  severity: "critical",
  message: "Tentativa de acesso não autorizado detectada",
  status: "pending",
  ipAddress: "192.168.1.1",
});

// Log maior
await createSystemLog({
  action: "validation_failed",
  category: "user_action",
  severity: "major",
  message: "Dados inválidos fornecidos pelo usuário",
  status: "pending",
});
```

### 2. Criar Log de Evento

```typescript
import { createEventLog } from "@/actions/logs";

// Log de sucesso
await createEventLog({
  eventId: "event_123",
  action: "event_published",
  category: "event_management",
  severity: "minor",
  message: "Evento publicado com sucesso",
  status: "completed",
  userId: "user_456",
});

// Log de erro
await createEventLog({
  eventId: "event_123",
  action: "publish_failed",
  category: "event_management",
  severity: "critical",
  message: "Falha ao publicar evento",
  status: "failed",
  userId: "user_456",
});
```

### 3. Buscar Logs

```typescript
import { getSystemLogs, getEventLogs } from "@/actions/logs";

// Buscar logs críticos do sistema
const criticalLogs = await getSystemLogs({
  severity: "critical",
  status: "pending",
});

// Buscar logs de um evento específico
const eventLogs = await getEventLogs({
  eventId: "event_123",
  severity: "major",
});
```

### 4. Obter Estatísticas

```typescript
import { getLogStats } from "@/actions/logs";

const stats = await getLogStats();
// Retorna:
// - systemLogs: contagem por severidade
// - eventLogs: contagem por severidade
// - pendingCritical: logs pendentes críticos e maiores
```

## Dashboard

### Atividades Pendentes

O dashboard exibe automaticamente:

- **Contador de atividades pendentes** críticas e maiores
- **Cards visuais** com cores baseadas na severidade
- **Indicadores animados** para problemas urgentes
- **Filtros por tipo** (sistema vs evento)

### Estatísticas dos Logs

- **Distribuição por severidade** com barras de progresso
- **Contadores totais** por categoria
- **Alertas visuais** para problemas pendentes
- **Resumo de ações** necessárias

## Categorias Recomendadas

### Sistema

- `security`: Problemas de segurança
- `auth`: Autenticação e autorização
- `system_error`: Erros internos do sistema
- `performance`: Problemas de performance
- `maintenance`: Manutenção do sistema

### Eventos

- `event_management`: Gestão de eventos
- `participant_management`: Gestão de participantes
- `evaluation`: Avaliações e julgamentos
- `registration`: Inscrições e registros

### Usuários

- `user_action`: Ações dos usuários
- `permission_change`: Alterações de permissões
- `profile_update`: Atualizações de perfil

## Boas Práticas

1. **Use severidade apropriada**: Não classifique tudo como crítico
2. **Mensagens claras**: Descreva o problema de forma concisa
3. **Metadados úteis**: Inclua informações relevantes para debug
4. **Status consistente**: Use "pending" para problemas, "completed" para resoluções
5. **Categorização lógica**: Agrupe logs relacionados em categorias consistentes

## Monitoramento

### Alertas Automáticos

- **Críticos**: Requerem atenção imediata
- **Maiores**: Devem ser revisados em 24h
- **Menores**: Revisão semanal
- **Sem classificação**: Revisão mensal

### Ações Recomendadas

1. **Revisar logs críticos** diariamente
2. **Resolver problemas maiores** em 24-48h
3. **Analisar tendências** semanalmente
4. **Limpar logs antigos** mensalmente
