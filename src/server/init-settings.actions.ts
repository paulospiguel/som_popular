import { initializeDefaultSettings } from "./settings";

// Função para inicializar configurações padrão
export async function initDefaultSettings() {
  try {
    await initializeDefaultSettings();
    console.log("✅ Configurações padrão inicializadas com sucesso");
  } catch (error) {
    console.error("❌ Erro ao inicializar configurações padrão:", error);
  }
}
