import { eq } from "drizzle-orm";

import { db } from "./database";
import { systemSettings } from "./database/schema";

export interface HomePageSettings {
  // Configurações de tema
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;

  // Configurações de blocos
  showSupporters: boolean;
  showNextEvents: boolean;
  showCurrentStatus: boolean;
  showInfoCards: boolean;

  // Modo único evento
  singleEventMode: boolean;
  singleEventId: string | null;
}

const DEFAULT_SETTINGS: HomePageSettings = {
  primaryColor: "#4ade80", // verde-suave
  secondaryColor: "#fbbf24", // dourado-claro
  accentColor: "#f59e0b", // amarelo-suave
  showSupporters: true,
  showNextEvents: true,
  showCurrentStatus: true,
  showInfoCards: true,
  singleEventMode: false,
  singleEventId: null,
};

export async function getSystemSetting(key: string): Promise<string | null> {
  try {
    const result = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, key))
      .limit(1);

    // Retornar o valor exatamente como está armazenado.
    // Importante: não usar "|| null" porque string vazia é um valor válido e indica que a chave existe.
    return result.length > 0 ? (result[0] as any).value : null;
  } catch (error) {
    console.error("Erro ao buscar configuração:", error);
    return null;
  }
}

export async function setSystemSetting(
  key: string,
  value: string,
  description?: string,
  category: string = "general",
  updatedBy?: string
): Promise<boolean> {
  try {
    const existing = await getSystemSetting(key);

    // Atualiza se a key existir, mesmo que value seja string vazia
    if (existing !== null) {
      // Atualizar configuração existente
      await db
        .update(systemSettings)
        .set({
          value,
          description,
          category,
          updatedBy,
          updatedAt: new Date(),
        })
        .where(eq(systemSettings.key, key));
    } else {
      // Criar nova configuração
      await db.insert(systemSettings).values({
        key,
        value,
        description,
        category,
        updatedBy,
      });
    }

    return true;
  } catch (error) {
    console.error("Erro ao salvar configuração:", error);
    return false;
  }
}

export async function getHomePageSettings(): Promise<HomePageSettings> {
  try {
    const settings = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.category, "homepage"));

    const settingsMap = settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      },
      {} as Record<string, string>
    );

    return {
      primaryColor: settingsMap.primaryColor || DEFAULT_SETTINGS.primaryColor,
      secondaryColor:
        settingsMap.secondaryColor || DEFAULT_SETTINGS.secondaryColor,
      accentColor: settingsMap.accentColor || DEFAULT_SETTINGS.accentColor,
      showSupporters: settingsMap.showSupporters === "true",
      showNextEvents: settingsMap.showNextEvents === "true",
      showCurrentStatus: settingsMap.showCurrentStatus === "true",
      showInfoCards: settingsMap.showInfoCards === "true",
      singleEventMode: settingsMap.singleEventMode === "true",
      singleEventId: settingsMap.singleEventId || null,
    };
  } catch (error) {
    console.error("Erro ao buscar configurações da página inicial:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateHomePageSettings(
  settings: Partial<HomePageSettings>,
  updatedBy?: string
): Promise<boolean> {
  try {
    const settingsToUpdate = [
      { key: "primaryColor", value: settings.primaryColor },
      { key: "secondaryColor", value: settings.secondaryColor },
      { key: "accentColor", value: settings.accentColor },
      { key: "showSupporters", value: settings.showSupporters?.toString() },
      { key: "showNextEvents", value: settings.showNextEvents?.toString() },
      {
        key: "showCurrentStatus",
        value: settings.showCurrentStatus?.toString(),
      },
      { key: "showInfoCards", value: settings.showInfoCards?.toString() },
      { key: "singleEventMode", value: settings.singleEventMode?.toString() },
      { key: "singleEventId", value: settings.singleEventId },
    ].filter((item) => item.value !== undefined);

    for (const setting of settingsToUpdate) {
      await setSystemSetting(
        setting.key,
        setting.value!,
        `Configuração da página inicial: ${setting.key}`,
        "homepage",
        updatedBy
      );
    }

    return true;
  } catch (error) {
    console.error("Erro ao atualizar configurações da página inicial:", error);
    return false;
  }
}

export async function initializeDefaultSettings(): Promise<void> {
  try {
    const defaultSettings = [
      {
        key: "primaryColor",
        value: DEFAULT_SETTINGS.primaryColor,
        description: "Cor primária do tema",
      },
      {
        key: "secondaryColor",
        value: DEFAULT_SETTINGS.secondaryColor,
        description: "Cor secundária do tema",
      },
      {
        key: "accentColor",
        value: DEFAULT_SETTINGS.accentColor,
        description: "Cor de destaque do tema",
      },
      {
        key: "showSupporters",
        value: DEFAULT_SETTINGS.showSupporters.toString(),
        description: "Mostrar seção de apoiadores",
      },
      {
        key: "showNextEvents",
        value: DEFAULT_SETTINGS.showNextEvents.toString(),
        description: "Mostrar próximos eventos",
      },
      {
        key: "showCurrentStatus",
        value: DEFAULT_SETTINGS.showCurrentStatus.toString(),
        description: "Mostrar card de status atual",
      },
      {
        key: "showInfoCards",
        value: DEFAULT_SETTINGS.showInfoCards.toString(),
        description: "Mostrar cards informativos",
      },
      {
        key: "singleEventMode",
        value: DEFAULT_SETTINGS.singleEventMode.toString(),
        description: "Modo único evento",
      },
      {
        key: "singleEventId",
        value: "",
        description: "ID do evento para modo único",
      },
    ];

    for (const setting of defaultSettings) {
      const existing = await getSystemSetting(setting.key);
      // Somente insere se não existir registro para a chave
      if (existing === null) {
        await setSystemSetting(
          setting.key,
          setting.value,
          setting.description,
          "homepage"
        );
      }
    }
  } catch (error) {
    console.error("Erro ao inicializar configurações padrão:", error);
  }
}
