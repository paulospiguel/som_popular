# Sistema de Upload com Vercel Blob

Este documento descreve o novo sistema de upload de arquivos usando Vercel Blob, ideal para aplicações SaaS.

## Visão Geral

O Vercel Blob é uma solução de armazenamento de arquivos simples e escalável, perfeita para aplicações SaaS. Ele oferece:

- ✅ **Configuração automática** no Vercel
- ✅ **CDN global** para entrega rápida
- ✅ **Escalabilidade automática**
- ✅ **URLs públicas seguras**
- ✅ **Custo-efetivo** (pague apenas pelo que usar)
- ✅ **Integração nativa** com Next.js

## Configuração

### 1. Variáveis de Ambiente

Adicione ao seu `.env.local`:

```env
# Configuração do Vercel Blob
STORAGE_PROVIDER=vercel-blob
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here
```

**Nota:** No Vercel, o `BLOB_READ_WRITE_TOKEN` é configurado automaticamente. Para desenvolvimento local, você pode usar um token de teste.

### 2. Instalação

```bash
npm install @vercel/blob
```

## Uso

### Upload Básico

```typescript
import { uploadFile } from "@/server/upload-vercel";

const result = await uploadFile(file, {
  folder: "documents",
  allowedTypes: ["application/pdf"],
  maxSize: 10 * 1024 * 1024, // 10MB
  renameFile: true,
});
```

### Upload Específico para Participantes

```typescript
import { uploadParticipantPhoto } from "@/server/upload-vercel";

const result = await uploadParticipantPhoto(file);
// Upload para pasta "participants" com validação de imagem
```

### Upload de Regulamentos

```typescript
import { uploadRegulationFile } from "@/server/upload-vercel";

const result = await uploadRegulationFile(file);
// Upload para pasta "regulations" com validação de PDF
```

### Upload de Documentos de Eventos

```typescript
import { uploadEventDocument } from "@/server/upload-vercel";

const result = await uploadEventDocument(file);
// Upload para pasta "events" com validação de documentos
```

## Estrutura de Pastas

O sistema organiza os arquivos em pastas específicas:

```
vercel-blob/
├── participants/     # Fotos de participantes
├── events/          # Documentos de eventos
├── regulations/     # Regulamentos PDF
├── documents/       # Documentos gerais
└── general/         # Arquivos diversos
```

## Tipos de Arquivo Suportados

### Imagens

- `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`

### Documentos

- `application/pdf`
- `application/msword`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- `application/vnd.ms-excel`
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- `application/vnd.ms-powerpoint`
- `application/vnd.openxmlformats-officedocument.presentationml.presentation`
- `text/plain`, `text/csv`

### Áudio

- `audio/mpeg`, `audio/wav`, `audio/ogg`, `audio/mp3`

### Vídeo

- `video/mp4`, `video/avi`, `video/mov`, `video/quicktime`, `video/webm`

### Arquivos Compactados

- `application/zip`
- `application/x-rar-compressed`
- `application/x-7z-compressed`

### Outros

- `application/json`, `application/xml`

## Limites

- **Tamanho máximo por arquivo:** 100MB
- **Cache:** 1 ano (configurável)
- **Acesso:** Público por padrão

## Funções Disponíveis

### Upload

- `uploadFile(file, options)` - Upload genérico
- `uploadParticipantPhoto(file)` - Upload de foto de participante
- `uploadRegulationFile(file)` - Upload de regulamento PDF
- `uploadEventDocument(file)` - Upload de documento de evento
- `uploadDocument(file)` - Upload de documento geral

### Gerenciamento

- `removeFile(url)` - Remover arquivo
- `checkFileExists(url)` - Verificar se arquivo existe
- `getFileInfoFromUrl(url)` - Obter informações do arquivo
- `listFilesInFolder(folder, limit)` - Listar arquivos de uma pasta

## Integração com Banco de Dados

O sistema salva automaticamente metadados no banco de dados:

```typescript
{
  id: "unique-id",
  originalName: "documento.pdf",
  filename: "unique-id.pdf",
  filePath: "documents/unique-id.pdf",
  publicUrl: "https://[hash].public.blob.vercel-storage.com/documents/unique-id.pdf",
  mimeType: "application/pdf",
  fileSize: 1024000,
  storageProvider: "vercel-blob",
  folder: "documents",
  uploadedBy: "user-id",
  relatedEntityType: "event",
  relatedEntityId: "event-id",
  isPublic: true,
  metadata: "{\"custom\": \"data\"}",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

## Utilitários

### Extração de ID da URL

```typescript
import { extractUploadIdFromUrl } from "@/lib/upload-utils";

const uploadId = extractUploadIdFromUrl(
  "https://[hash].public.blob.vercel-storage.com/documents/file.pdf"
);
// Retorna: "file"
```

### Verificação de Tipo de URL

```typescript
import {
  isVercelBlobUrl,
  isLocalUploadUrl,
  isExternalStorageUrl,
} from "@/lib/upload-utils";

const isBlob = isVercelBlobUrl(url);
const isLocal = isLocalUploadUrl(url);
const isExternal = isExternalStorageUrl(url);
```

## Migração do Sistema Anterior

Para migrar do sistema anterior (local/S3/IDrive) para Vercel Blob:

1. **Atualize as importações:**

   ```typescript
   // Antes
   import { uploadrulesFile } from "@/server/upload";

   // Depois
   import { uploadRegulationFile } from "@/server/upload-vercel";
   ```

2. **Configure as variáveis de ambiente:**

   ```env
   STORAGE_PROVIDER=vercel-blob
   BLOB_READ_WRITE_TOKEN=your_token
   ```

3. **Atualize os componentes:**
   - Substitua chamadas de funções antigas pelas novas
   - As URLs retornadas serão do Vercel Blob

## Exemplo Completo

```typescript
"use client";

import { useState } from "react";
import { uploadRegulationFile } from "@/server/upload-vercel";

export function FileUploadExample() {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const result = await uploadRegulationFile(file);
      setResult(result);

      if (result.success) {
        console.log("Upload realizado:", result.url);
      } else {
        console.error("Erro no upload:", result.error);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
        disabled={isUploading}
      />
      {isUploading && <p>Fazendo upload...</p>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
```

## Vantagens para SaaS

1. **Simplicidade:** Sem configuração complexa de buckets ou credenciais
2. **Escalabilidade:** Cresce automaticamente com sua aplicação
3. **Performance:** CDN global para entrega rápida
4. **Custo:** Pague apenas pelo que usar
5. **Integração:** Funciona perfeitamente com Next.js e Vercel
6. **Segurança:** URLs públicas seguras e controladas
7. **Manutenção:** Gerenciado pelo Vercel, sem necessidade de manutenção

## Troubleshooting

### Erro: "BLOB_READ_WRITE_TOKEN not found"

- Verifique se a variável de ambiente está configurada
- No Vercel, ela é configurada automaticamente
- Para desenvolvimento local, use um token de teste

### Erro: "File too large"

- Verifique o limite de tamanho (100MB por arquivo)
- Reduza o tamanho do arquivo ou use compressão

### Erro: "Invalid file type"

- Verifique se o tipo de arquivo está na lista de tipos permitidos
- Use a função `uploadFile` com `allowedTypes` customizado

### URLs não funcionam

- Verifique se o arquivo foi realmente enviado
- Confirme se a URL está correta
- Verifique se o arquivo não foi removido
