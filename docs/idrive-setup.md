# Configuração do IDrive e2

Este documento explica como configurar e usar o IDrive e2 como provedor de storage no projeto Som Popular.

## Sobre o IDrive e2

O IDrive e2 é um serviço de armazenamento de objetos compatível com S3 que oferece:

- 11 noves de durabilidade de dados
- Armazenamento em nuvem acessível
- Compatibilidade total com a API S3
- Múltiplas regiões disponíveis

## Configuração

### 1. Criar conta no IDrive e2

1. Acesse [IDrive e2](https://www.idrive.com/s3-storage-e2/)
2. Crie uma conta e faça login
3. Crie um bucket para o seu projeto

### 2. Obter credenciais

1. No painel do IDrive e2, vá para "Access Keys"
2. Crie uma nova chave de acesso
3. Anote:
   - Access Key ID
   - Secret Access Key
   - Endpoint URL (ex: `https://l4g4.ch11.idrivee2-2.com`)
   - Região (ex: `chicago`)

### 3. Configurar variáveis de ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Configuração do IDrive e2
STORAGE_PROVIDER=idrive
IDRIVE_ACCESS_KEY_ID=sua_access_key_aqui
IDRIVE_SECRET_ACCESS_KEY=sua_secret_key_aqui
IDRIVE_BUCKET_NAME=nome_do_seu_bucket
IDRIVE_ENDPOINT_URL=https://l4g4.ch11.idrivee2-2.com
IDRIVE_REGION=chicago
```

### 4. Regiões disponíveis

O IDrive e2 oferece as seguintes regiões:

- **Chicago**: `l4g4.ch11.idrivee2-2.com`
- **Dallas**: `dallas.idrivee2-2.com`
- **Los Angeles**: `los-angeles.idrivee2-2.com`
- **Miami**: `miami.idrivee2-2.com`
- **New York**: `new-york.idrivee2-2.com`
- **Seattle**: `seattle.idrivee2-2.com`
- **Singapore**: `singapore.idrivee2-2.com`
- **Tokyo**: `tokyo.idrivee2-2.com`
- **Toronto**: `toronto.idrivee2-2.com`
- **Vancouver**: `vancouver.idrivee2-2.com`

## Uso no código

### Upload automático

O sistema detecta automaticamente o provider configurado e faz upload para o IDrive e2 quando:

- `NODE_ENV=production`
- `STORAGE_PROVIDER=idrive`

```typescript
import { uploadFile } from "@/server/upload";

// Upload automático baseado na configuração
const result = await uploadFile(file, {
  folder: "participants",
  allowedTypes: ["image/jpeg", "image/png"],
  maxSize: 5 * 1024 * 1024, // 5MB
});
```

### Upload específico para IDrive e2

Para forçar upload para o IDrive e2 independente da configuração:

```typescript
import { uploadToIDrive } from "@/server/upload";

const result = await uploadToIDrive(file, {
  folder: "documents",
  allowedTypes: ["application/pdf"],
  maxSize: 20 * 1024 * 1024, // 20MB
});
```

### Upload de fotos de participantes

```typescript
import { uploadParticipantPhoto } from "@/server/upload";

const result = await uploadParticipantPhoto(file);
```

### Upload de regulamentos

```typescript
import { uploadrulesFile } from "@/server/upload";

const result = await uploadrulesFile(file);
```

### Upload de documentos

```typescript
import { uploadDocument } from "@/server/upload";

const result = await uploadDocument(file);
```

## Estrutura de arquivos

Os arquivos são organizados no bucket da seguinte forma:

```
bucket-name/
├── participants/
│   ├── clh1234567890.jpg
│   └── clh0987654321.png
├── regulations/
│   ├── clh1111111111.pdf
│   └── clh2222222222.pdf
├── documents/
│   ├── clh3333333333.docx
│   └── clh4444444444.xlsx
└── general/
    └── clh5555555555.txt
```

## URLs públicas

Os arquivos ficam acessíveis publicamente através de URLs no formato:

```
https://{bucket-name}.{endpoint}/{folder}/{filename}
```

Exemplo:

```
https://meu-bucket.l4g4.ch11.idrivee2-2.com/participants/clh1234567890.jpg
```

## Limitações

- Tamanho máximo por arquivo: 5GB
- Tipos de arquivo suportados: configuráveis via `IDRIVE_CONFIG.ALLOWED_TYPES`
- Rate limits: seguem as limitações do IDrive e2

## Troubleshooting

### Erro de configuração

Se receber erro "Configuração do IDrive e2 inválida", verifique:

1. Todas as variáveis de ambiente estão definidas
2. As credenciais estão corretas
3. O bucket existe e está acessível
4. O endpoint URL está correto

### Erro de upload

Se o upload falhar:

1. Verifique se o arquivo não excede 5GB
2. Confirme se o tipo de arquivo é permitido
3. Verifique a conectividade com o IDrive e2
4. Confirme se as permissões do bucket estão corretas

### Erro de URL pública

Se as URLs não funcionarem:

1. Verifique se o bucket permite acesso público
2. Confirme se a configuração de CORS está correta
3. Teste a URL diretamente no navegador

## Desenvolvimento vs Produção

- **Desenvolvimento**: Sempre usa storage local (`public/upload/`)
- **Produção**: Usa o provider configurado em `STORAGE_PROVIDER`

Para testar o IDrive e2 em desenvolvimento, você pode:

1. Temporariamente definir `NODE_ENV=production`
2. Ou usar a função `uploadToIDrive()` diretamente

## Monitoramento

O sistema registra logs de:

- Sucesso/falha de uploads
- Erros de configuração
- Problemas de conectividade

Verifique os logs do servidor para diagnosticar problemas.
