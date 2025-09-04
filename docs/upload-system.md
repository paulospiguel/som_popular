# Sistema de Upload de Arquivos

## Visão Geral

Sistema de upload de arquivos implementado como Server Action, com suporte para desenvolvimento local e preparado para storage externo em produção.

## Funcionalidades

### ✅ **Upload Local (Desenvolvimento)**

- Armazena arquivos em `public/uploaded/`
- Organização por pastas (participants, events, regulations, etc.)
- Nomes únicos para evitar conflitos
- Validação de tipo e tamanho

### ✅ **Preparado para Produção**

- Estrutura configurável via variáveis de ambiente
- Suporte para múltiplos providers de storage
- Fallback para local se necessário

### ✅ **Tipos de Arquivo Suportados**

- **Imagens**: JPG, PNG, WebP, GIF
- **PDFs**: Documentos PDF
- **Documentos**: Word, Excel, Texto

### ✅ **Validações**

- Tipo MIME
- Tamanho máximo configurável
- Nomes únicos
- Estrutura de pastas organizada

## Estrutura de Arquivos

```
public/
  upload/
    participants/     # Fotos de participantes
    events/          # Imagens de eventos
    regulations/     # PDFs de regulamentos
    documents/       # Documentos gerais
    general/         # Arquivos diversos
```

## Funções Disponíveis

### **uploadFile(file, options)**

Função principal para upload de qualquer tipo de arquivo.

```typescript
const result = await uploadFile(file, {
  folder: "participants",
  allowedTypes: ["image/jpeg", "image/png"],
  maxSize: 5 * 1024 * 1024, // 5MB
  renameFile: true,
});
```

### **uploadParticipantPhoto(file)**

Upload específico para fotos de participantes.

```typescript
const result = await uploadParticipantPhoto(file);
// Configurações: pasta "participants", max 5MB, tipos de imagem
```

### **uploadrulesFile(file)**

Upload específico para regulamentos PDF.

```typescript
const result = await uploadrulesFile(file);
// Configurações: pasta "regulations", max 20MB, apenas PDF
```

### **uploadDocument(file)**

Upload para documentos gerais.

```typescript
const result = await uploadDocument(file);
// Configurações: pasta "documents", max 15MB, vários tipos
```

## Configuração

### **Variáveis de Ambiente**

```bash
# Desenvolvimento (padrão)
STORAGE_PROVIDER=local

# Produção - AWS S3
STORAGE_PROVIDER=s3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket

# Produção - Google Cloud Storage
STORAGE_PROVIDER=gcs
GOOGLE_CLOUD_PROJECT_ID=your_project
GOOGLE_CLOUD_BUCKET=your_bucket

# Produção - Azure Blob Storage
STORAGE_PROVIDER=azure
AZURE_STORAGE_ACCOUNT=your_account
AZURE_STORAGE_KEY=your_key
AZURE_STORAGE_CONTAINER=your_container
```

### **Configurações Padrão**

```typescript
const DEFAULT_OPTIONS = {
  folder: "general",
  allowedTypes: ["image/*", "application/pdf", "text/*"],
  maxSize: 10 * 1024 * 1024, // 10MB
  renameFile: true,
};
```

## Uso no Frontend

### **Componente de Upload**

```typescript
import { DiscreteImageUpload } from "@/components/ui/discrete-image-upload";

<DiscreteImageUpload
  value={formData.rankingPhoto}
  onChange={(url) => setFormData(prev => ({ ...prev, rankingPhoto: url }))}
  maxSize={3}
  acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
  placeholder="Adicionar foto para ranking"
/>
```

### **Upload Manual**

```typescript
import { uploadParticipantPhoto } from "@/server/upload";

const handleFileUpload = async (file: File) => {
  const result = await uploadParticipantPhoto(file);

  if (result.success) {
    console.log("Upload realizado:", result.url);
    // result.url contém o caminho público do arquivo
  } else {
    console.error("Erro no upload:", result.error);
  }
};
```

## Retorno da Função

```typescript
interface UploadResult {
  success: boolean;
  url?: string; // URL pública do arquivo
  path?: string; // Caminho completo no servidor
  filename?: string; // Nome do arquivo salvo
  error?: string; // Mensagem de erro se houver
}
```

## Segurança

### ✅ **Validações Implementadas**

- Tipo MIME verificado
- Tamanho máximo configurável
- Nomes únicos para evitar conflitos
- Pastas organizadas por tipo

### ✅ **Boas Práticas**

- Arquivos salvos fora da pasta pública
- URLs públicas seguras
- Validação no servidor
- Tratamento de erros robusto

## Próximos Passos

### **Storage Externo**

1. **AWS S3**: Implementar integração completa
2. **Google Cloud**: Adicionar suporte
3. **Azure**: Configurar blob storage
4. **CDN**: Configurar para melhor performance

### **Funcionalidades Adicionais**

1. **Compressão**: Reduzir tamanho de imagens
2. **Thumbnails**: Gerar miniaturas automaticamente
3. **Watermark**: Adicionar marca d'água
4. **Backup**: Sistema de backup automático

### **Monitoramento**

1. **Logs**: Rastrear uploads e erros
2. **Métricas**: Estatísticas de uso
3. **Alertas**: Notificações para problemas
4. **Limpeza**: Remoção automática de arquivos antigos

## Troubleshooting

### **Erro: "Storage externo não implementado"**

- Configure `STORAGE_PROVIDER=local` no `.env`
- Verifique se as variáveis de ambiente estão corretas

### **Erro: "Tipo de arquivo não permitido"**

- Verifique se o tipo MIME está na lista `allowedTypes`
- Confirme se o arquivo não está corrompido

### **Erro: "Arquivo muito grande"**

- Aumente o `maxSize` nas opções
- Verifique o limite do servidor (nginx, etc.)

### **Arquivo não aparece**

- Verifique se a pasta `public/upload/` existe
- Confirme permissões de escrita
- Verifique se o arquivo foi salvo corretamente
