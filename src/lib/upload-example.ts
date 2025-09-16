// Exemplo de como usar upload com Server Actions
import { uploadFile } from "@/server/upload";
import { UPLOAD_CONFIG } from "@/lib/upload-config";

/**
 * Exemplo de Server Action para upload de arquivo
 * Este é um exemplo de como usar o uploadFile em uma Server Action
 */
export async function uploadFileAction(formData: FormData) {
  "use server";
  
  try {
    const file = formData.get("file") as File;
    
    if (!file) {
      return {
        success: false,
        error: "Nenhum arquivo fornecido",
      };
    }

    // Validar tamanho do arquivo
    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
      return {
        success: false,
        error: `Arquivo muito grande. Tamanho máximo: ${UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`,
      };
    }

    // Fazer upload do arquivo
    const result = await uploadFile(file, {
      folder: "documents",
      maxSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
    });

    return result;
  } catch (error) {
    console.error("Erro no upload:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

/**
 * Exemplo de como usar em um componente React
 */
export function UploadExample() {
  async function handleUpload(formData: FormData) {
    const result = await uploadFileAction(formData);
    
    if (result.success) {
      console.log("Upload realizado com sucesso:", result.url);
    } else {
      console.error("Erro no upload:", result.error);
    }
  }

  return (
    <form action={handleUpload}>
      <input type="file" name="file" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" />
      <button type="submit">Upload</button>
    </form>
  );
}
