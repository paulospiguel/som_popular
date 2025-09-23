# React Query Setup e Uso

## 📦 Instalação

O React Query foi instalado e configurado no projeto:

```bash
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools --save-dev
```

## ⚙️ Configuração

### 1. QueryClient Configurado

O `QueryClient` está configurado em `src/lib/query-client.ts` com:

- **Cache padrão:** 5 minutos
- **Garbage collection:** 10 minutos
- **Retry automático:** Até 3 tentativas (exceto erros 4xx)
- **Refetch:** Apenas na reconexão (não no foco da janela)

### 2. Provider Integrado

O `QueryProvider` está integrado no layout principal (`src/app/layout.tsx`) e inclui:

- DevTools em desenvolvimento
- Configuração global do QueryClient

## 🎣 Hooks Customizados

### Eventos (`src/hooks/use-events.ts`)

```typescript
// Buscar todos os eventos
const {
  data: events,
  isLoading,
  error,
} = useEvents({
  status: "published",
  search: "fado",
});

// Buscar evento específico
const { data: event } = useEvent(eventId);

// Mutations
const createEvent = useCreateEvent();
const updateEvent = useUpdateEvent();
const deleteEvent = useDeleteEvent();
const publishEvent = usePublishEvent();
```

### Participantes (`src/hooks/use-participants.ts`)

```typescript
// Buscar participantes
const { data: participants } = useParticipants({
  status: "approved",
  category: "fado",
});

// Participantes de um evento
const { data: eventParticipants } = useEventParticipants(eventId);

// Mutations
const createParticipant = useCreateParticipant();
const registerInEvent = useRegisterParticipantInEvent();
```

### Jurados (`src/hooks/use-judges.ts`)

```typescript
// Buscar jurados
const { data: judges } = useJudges({ isActive: true });

// Jurados de um evento
const { data: eventJudges } = useEventJudges(eventId);

// Mutations
const createJudge = useCreateJudge();
const addToEvent = useAddJudgeToEvent();
```

### Uploads (`src/hooks/use-uploads.ts`)

```typescript
// Buscar uploads por entidade
const { data: uploads } = useUploadsByEntity("event", eventId);

// Buscar upload por URL
const { data: uploadInfo } = useUploadByUrl(fileUrl);

// Verificar existência
const { data: exists } = useCheckFileExists(filePath);
```

## 🔄 Cache e Invalidação

### Invalidação Automática

As mutations invalidam automaticamente o cache relacionado:

```typescript
const updateEvent = useUpdateEvent();

// Após sucesso, invalida:
// - Lista de eventos
// - Cache específico do evento
// - Queries relacionadas
```

### Invalidação Manual

```typescript
import { invalidateEventQueries } from "@/lib/query-client";

// Invalidar todas as queries de eventos
invalidateEventQueries();
```

## 📊 Exemplo de Uso

### Componente de Lista com React Query

```typescript
import { useEvents, useCreateEvent } from "@/hooks/use-events";

function EventsList() {
  const { data: events, isLoading, refetch } = useEvents();
  const createEvent = useCreateEvent();

  const handleCreate = async () => {
    await createEvent.mutateAsync({
      name: "Novo Evento",
      // ... outros campos
    });
    // Cache é invalidado automaticamente
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      {events?.data?.map(event => (
        <div key={event.id}>{event.name}</div>
      ))}
    </div>
  );
}
```

## 🛠️ DevTools

Em desenvolvimento, o React Query DevTools está disponível:

- **Posição:** Canto inferior direito
- **Ativação:** Automática em `NODE_ENV === "development"`
- **Funcionalidades:**
  - Visualizar queries ativas
  - Inspecionar cache
  - Forçar refetch
  - Invalidar queries

## 🎯 Benefícios

### 1. **Cache Inteligente**

- Dados em cache por 5 minutos
- Evita requisições desnecessárias
- Sincronização automática

### 2. **Gerenciamento de Estado**

- Loading states automáticos
- Error handling integrado
- Retry automático

### 3. **Performance**

- Background refetch
- Stale-while-revalidate
- Otimistic updates

### 4. **Developer Experience**

- DevTools integradas
- TypeScript support
- Hooks customizados

## 🔧 Configurações Avançadas

### Query Keys Estruturadas

```typescript
export const eventKeys = {
  all: ["events"],
  lists: () => [...eventKeys.all, "list"],
  list: (filters) => [...eventKeys.lists(), filters],
  details: () => [...eventKeys.all, "detail"],
  detail: (id) => [...eventKeys.details(), id],
};
```

### Invalidação Seletiva

```typescript
// Invalidar apenas eventos específicos
queryClient.invalidateQueries({
  queryKey: eventKeys.detail(eventId),
});

// Invalidar todas as listas de eventos
queryClient.invalidateQueries({
  queryKey: eventKeys.lists(),
});
```

## 🚀 Próximos Passos

1. **Implementar em mais componentes**
2. **Adicionar optimistic updates**
3. **Configurar background sync**
4. **Implementar paginação**
5. **Adicionar infinite queries**

O React Query está pronto para uso em todo o projeto! 🎉
