import { NextRequest, NextResponse } from "next/server";

import { requireMaster } from "@/lib/action-guards";
import { getHomePageSettings, updateHomePageSettings } from "@/server/settings";

export async function GET() {
  try {
    const settings = await getHomePageSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar permissões
    await requireMaster();

    const body = await request.json();

    // Validar dados
    const validSettings = {
      primaryColor:
        typeof body.primaryColor === "string" ? body.primaryColor : undefined,
      secondaryColor:
        typeof body.secondaryColor === "string"
          ? body.secondaryColor
          : undefined,
      accentColor:
        typeof body.accentColor === "string" ? body.accentColor : undefined,
      showSupporters:
        typeof body.showSupporters === "boolean"
          ? body.showSupporters
          : undefined,
      showNextEvents:
        typeof body.showNextEvents === "boolean"
          ? body.showNextEvents
          : undefined,
      showCurrentStatus:
        typeof body.showCurrentStatus === "boolean"
          ? body.showCurrentStatus
          : undefined,
      showInfoCards:
        typeof body.showInfoCards === "boolean"
          ? body.showInfoCards
          : undefined,
      singleEventMode:
        typeof body.singleEventMode === "boolean"
          ? body.singleEventMode
          : undefined,
      singleEventId:
        typeof body.singleEventId === "string" ? body.singleEventId : undefined,
    };

    // Filtrar apenas valores definidos
    const filteredSettings = Object.fromEntries(
      Object.entries(validSettings).filter(([_, value]) => value !== undefined)
    );

    const success = await updateHomePageSettings(filteredSettings);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Erro ao salvar configurações" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
