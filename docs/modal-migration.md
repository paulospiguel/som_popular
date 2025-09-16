# Migração do Modal Antigo para o Novo

Este documento explica como migrar do componente `Modal` antigo para o novo `ModalNew` baseado no template do OriginUI.

## Principais Diferenças

### 1. **Baseado no Shadcn Dialog**

- O novo modal usa o componente `Dialog` do Shadcn/UI
- Melhor acessibilidade e comportamento padrão
- Integração nativa com o sistema de design

### 2. **API Compatível**

- Mantém a mesma interface do modal antigo
- Adiciona novos componentes auxiliares para formulários
- Suporte a trigger (botão que abre o modal)

## Como Migrar

### Passo 1: Importar o Novo Componente

```tsx
// Antes
import {
  Modal,
  ModalButtons,
  ModalPrimaryButton,
  ModalSecondaryButton,
} from "@/components/Modal";

// Depois
import {
  ModalNew as Modal,
  ModalButtons,
  ModalPrimaryButton,
  ModalSecondaryButton,
  ModalForm,
  ModalField,
  ModalInput,
  ModalTextarea,
} from "@/components/ModalNew";
```

### Passo 2: Usar Componentes de Formulário (Opcional)

Para formulários, use os novos componentes auxiliares:

```tsx
// Antes
<Modal isOpen={isOpen} onClose={onClose} title="Criar Evento">
  <form onSubmit={handleSubmit}>
    <div className="space-y-4">
      <div>
        <label>Nome</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </div>
    <div className="flex space-x-3 mt-6">
      <button onClick={onClose}>Cancelar</button>
      <button onClick={handleSave}>Salvar</button>
    </div>
  </form>
</Modal>

// Depois
<ModalNew isOpen={isOpen} onClose={onClose} title="Criar Evento">
  <ModalForm onSubmit={handleSubmit}>
    <ModalField label="Nome" required>
      <ModalInput
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Digite o nome do evento"
      />
    </ModalField>

    <ModalField label="Descrição">
      <ModalTextarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descreva o evento"
        rows={4}
      />
    </ModalField>

    <ModalButtons>
      <ModalSecondaryButton onClick={onClose}>
        Cancelar
      </ModalSecondaryButton>
      <ModalPrimaryButton onClick={handleSave}>
        Salvar
      </ModalPrimaryButton>
    </ModalButtons>
  </ModalForm>
</ModalNew>
```

### Passo 3: Usar com Trigger (Opcional)

```tsx
<ModalNew
  isOpen={isOpen}
  onClose={onClose}
  title="Editar Perfil"
  trigger={<Button>Editar Perfil</Button>}
>
  {/* Conteúdo do modal */}
</ModalNew>
```

## Novos Componentes Disponíveis

### ModalForm

Wrapper para formulários com estilização consistente.

### ModalField

Campo de formulário com label e validação.

```tsx
<ModalField label="Nome" required>
  <ModalInput value={name} onChange={setName} />
</ModalField>
```

### ModalInput

Input estilizado com props padrão.

```tsx
<ModalInput
  placeholder="Digite aqui..."
  value={value}
  onChange={setValue}
  required
/>
```

### ModalTextarea

Textarea estilizado com props padrão.

```tsx
<ModalTextarea
  placeholder="Descreva aqui..."
  value={value}
  onChange={setValue}
  rows={4}
  maxLength={500}
/>
```

## Vantagens do Novo Modal

1. **Melhor Acessibilidade**: Baseado no Dialog do Radix UI
2. **Componentes Auxiliares**: Facilita criação de formulários
3. **Consistência Visual**: Segue o design system do Shadcn
4. **Menos Código**: Componentes auxiliares reduzem boilerplate
5. **Validação Integrada**: Suporte nativo a validação de formulários
6. **Responsivo**: Melhor comportamento em dispositivos móveis

## Exemplo Completo

Veja o arquivo `src/components/examples/EventModalNew.tsx` para um exemplo completo de migração.

## Compatibilidade

O novo modal é 100% compatível com a API do modal antigo, então a migração pode ser feita gradualmente, componente por componente.
