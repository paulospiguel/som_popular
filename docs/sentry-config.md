# Configuração do Sentry - Apenas em Produção

Este documento explica como o Sentry está configurado no projeto Som Popular para funcionar **apenas em produção**.

## Visão Geral

O Sentry está configurado para ser ativado automaticamente apenas quando `NODE_ENV=production`, garantindo que:

- ✅ **Desenvolvimento**: Sentry desabilitado (sem overhead)
- ✅ **Produção**: Sentry ativado (monitoramento completo)
- ✅ **Performance**: Sem impacto no desenvolvimento
- ✅ **Segurança**: DSNs não expostos em desenvolvimento

## Arquivos de Configuração

### 1. Cliente (Browser)

**Arquivo**: `sentry.client.config.ts`

```typescript
// Só inicializar o Sentry em produção
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.1,
    // ... outras configurações
  });
}
```

### 2. Servidor (Node.js)

**Arquivo**: `sentry.server.config.ts`

```typescript
// Só inicializar o Sentry em produção
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
    // ... outras configurações
  });
}
```

### 3. Edge Runtime

**Arquivo**: `sentry.edge.config.ts`

```typescript
// Só inicializar o Sentry em produção
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
    // ... outras configurações
  });
}
```

### 4. Instrumentação

**Arquivo**: `src/instrumentation.ts`

```typescript
export async function register() {
  // Só carregar Sentry em produção
  if (process.env.NODE_ENV === "production") {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      await import("../sentry.server.config");
    }
    if (process.env.NEXT_RUNTIME === "edge") {
      await import("../sentry.edge.config");
    }
  }
  // ... resto da configuração
}
```

## Configuração de Ambiente

### Desenvolvimento

**Não é necessário configurar nada!** O Sentry fica automaticamente desabilitado.

```env
# NODE_ENV=development (padrão)
# Sentry desabilitado automaticamente
```

### Produção

Configure as seguintes variáveis de ambiente:

```env
NODE_ENV=production
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ENVIRONMENT=production
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
NEXT_PUBLIC_SENTRY_DSN=your_public_sentry_dsn_here
```

## Recursos do Sentry em Produção

### 1. Error Tracking

- Captura automática de erros JavaScript
- Stack traces completos
- Contexto do usuário e sessão

### 2. Performance Monitoring

- **Sample Rate**: 10% das transações
- Métricas de performance de páginas
- Tempo de resposta de APIs

### 3. Session Replay

- **Sample Rate**: 10% das sessões
- **Error Rate**: 100% quando há erros
- Gravação de interações do usuário

### 4. Logs

- Logs estruturados enviados para Sentry
- Correlação com erros e performance

## Verificação da Configuração

### Desenvolvimento

```bash
npm run dev
# Sentry não aparece nos logs
# Sem overhead de performance
```

### Produção

```bash
npm run build
npm start
# Sentry ativado automaticamente
# Logs de inicialização do Sentry
```

## Benefícios da Configuração

### 1. **Performance em Desenvolvimento**

- Sem overhead do Sentry
- Builds mais rápidos
- Menos dependências carregadas

### 2. **Segurança**

- DSNs não expostos em desenvolvimento
- Configurações sensíveis apenas em produção

### 3. **Simplicidade**

- Configuração automática baseada no ambiente
- Sem necessidade de flags adicionais

### 4. **Monitoramento Completo em Produção**

- Error tracking ativo
- Performance monitoring
- Session replay
- Logs estruturados

## Troubleshooting

### Sentry não está funcionando em produção

1. **Verificar NODE_ENV**:

   ```bash
   echo $NODE_ENV
   # Deve retornar "production"
   ```

2. **Verificar variáveis de ambiente**:

   ```bash
   # Todas devem estar definidas
   echo $SENTRY_DSN
   echo $NEXT_PUBLIC_SENTRY_DSN
   ```

3. **Verificar logs de inicialização**:
   - Em produção, deve aparecer logs do Sentry
   - Em desenvolvimento, não deve aparecer nada

### Sentry aparecendo em desenvolvimento

1. **Verificar NODE_ENV**:

   ```bash
   # Deve ser "development"
   echo $NODE_ENV
   ```

2. **Verificar se não há override**:
   - Não definir `NEXT_PUBLIC_ENABLE_SENTRY=true`
   - Não definir `NODE_ENV=production` em desenvolvimento

## Customização

### Alterar Sample Rates

Para ajustar as taxas de amostragem em produção:

```typescript
// sentry.client.config.ts
tracesSampleRate: 0.2, // 20% das transações
profilesSampleRate: 0.1, // 10% dos perfis
replaysSessionSampleRate: 0.05, // 5% das sessões
```

### Adicionar Contexto Customizado

```typescript
// Em qualquer lugar do código (só funciona em produção)
Sentry.setUser({ id: "123", email: "user@example.com" });
Sentry.setTag("feature", "upload");
Sentry.setContext("upload", { fileSize: 1024 });
```

## Monitoramento

### Dashboard do Sentry

- Acesse o dashboard do Sentry
- Visualize erros, performance e sessões
- Configure alertas e notificações

### Métricas Importantes

- **Error Rate**: Taxa de erros por minuto
- **Performance**: Tempo de resposta das páginas
- **Sessions**: Número de sessões ativas
- **Replays**: Sessões com problemas

## Conclusão

Esta configuração garante que o Sentry funcione de forma otimizada:

- **Desenvolvimento**: Sem overhead, foco na produtividade
- **Produção**: Monitoramento completo, insights valiosos

A configuração é automática e não requer intervenção manual para alternar entre os ambientes.
