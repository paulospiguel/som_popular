# ModalNew Component

Componente de modal moderno baseado no template OriginUI (comp-331) e integrado com o sistema de design do projeto.

## Características

- ✅ Baseado no Shadcn Dialog (Radix UI)
- ✅ API compatível com o Modal antigo
- ✅ Componentes auxiliares para formulários
- ✅ Suporte a trigger (botão que abre o modal)
- ✅ Melhor acessibilidade
- ✅ Design responsivo
- ✅ Integração com o tema do festival

## Uso Básico

```tsx
import { ModalNew } from "@/components/ModalNew";

<ModalNew
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Título do Modal"
  subtitle="Subtítulo opcional"
>
  <p>Conteúdo do modal</p>
</ModalNew>;
```

## Uso com Trigger

```tsx
<ModalNew
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Editar Perfil"
  trigger={<Button>Editar Perfil</Button>}
>
  <p>Conteúdo do modal</p>
</ModalNew>
```

## Componentes Auxiliares

### ModalForm

Wrapper para formulários com estilização consistente.

```tsx
<ModalForm onSubmit={handleSubmit}>{/* Campos do formulário */}</ModalForm>
```

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
  type="email"
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

### ModalButtons

Container para botões do modal.

```tsx
<ModalButtons>
  <ModalSecondaryButton onClick={onClose}>Cancelar</ModalSecondaryButton>
  <ModalPrimaryButton onClick={onSave}>Salvar</ModalPrimaryButton>
</ModalButtons>
```

## Props

### ModalNew

| Prop                  | Tipo                                                | Padrão | Descrição                        |
| --------------------- | --------------------------------------------------- | ------ | -------------------------------- |
| `isOpen`              | `boolean`                                           | -      | Controla se o modal está aberto  |
| `onClose`             | `() => void`                                        | -      | Função chamada ao fechar o modal |
| `title`               | `string`                                            | -      | Título do modal                  |
| `subtitle`            | `string`                                            | -      | Subtítulo opcional               |
| `icon`                | `ReactNode`                                         | -      | Ícone no header                  |
| `showCloseButton`     | `boolean`                                           | `true` | Mostra botão de fechar           |
| `closeOnOverlayClick` | `boolean`                                           | `true` | Fecha ao clicar fora             |
| `className`           | `string`                                            | -      | Classes CSS adicionais           |
| `size`                | `"sm" \| "md" \| "lg" \| "xl" \| "large" \| "full"` | `"xl"` | Tamanho do modal                 |
| `children`            | `ReactNode`                                         | -      | Conteúdo do modal                |
| `headerActions`       | `ReactNode`                                         | -      | Ações no header                  |
| `trigger`             | `ReactNode`                                         | -      | Elemento que abre o modal        |

## Exemplo Completo

```tsx
import {
  ModalNew,
  ModalForm,
  ModalField,
  ModalInput,
  ModalTextarea,
  ModalButtons,
  ModalPrimaryButton,
  ModalSecondaryButton,
} from "@/components/ModalNew";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados:", formData);
    setIsOpen(false);
  };

  return (
    <ModalNew
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Contato"
      subtitle="Envie sua mensagem"
      size="lg"
    >
      <ModalForm onSubmit={handleSubmit}>
        <ModalField label="Nome" required>
          <ModalInput
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Seu nome completo"
            required
          />
        </ModalField>

        <ModalField label="Email" required>
          <ModalInput
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="seu@email.com"
            required
          />
        </ModalField>

        <ModalField label="Mensagem">
          <ModalTextarea
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
            placeholder="Sua mensagem aqui..."
            rows={4}
            maxLength={500}
          />
        </ModalField>

        <ModalButtons>
          <ModalSecondaryButton onClick={() => setIsOpen(false)}>
            Cancelar
          </ModalSecondaryButton>
          <ModalPrimaryButton type="submit">Enviar Mensagem</ModalPrimaryButton>
        </ModalButtons>
      </ModalForm>
    </ModalNew>
  );
}
```

## Migração do Modal Antigo

O novo modal é 100% compatível com a API do modal antigo. Para migrar:

1. Substitua `Modal` por `ModalNew`
2. Use os componentes auxiliares para formulários (opcional)
3. Aproveite as novas funcionalidades como trigger

Veja `docs/modal-migration.md` para mais detalhes sobre migração.
