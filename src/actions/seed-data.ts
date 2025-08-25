"use server";

import { db } from "@/db";
import { eventJudges, events, judges, participants } from "@/db/schema";

/**
 * Criar dados de exemplo para teste do sistema de votação
 */
export async function createTestData() {
  try {
    // Criar evento de teste
    const [testEvent] = await db
      .insert(events)
      .values({
        name: "Festival de Fado - Classificatória",
        description: "Primeira fase do Festival de Fado 2024",
        type: "classificatoria",
        category: "fado",
        location: "Casa do Fado, Lisboa",
        maxParticipants: 20,
        currentParticipants: 3,
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
        status: "ongoing",
        isPublic: true,
        requiresApproval: false,
        rules: "Regulamento do Festival de Fado",
        prizes: JSON.stringify({
          primeiro: "500€ + Gravação de EP",
          segundo: "300€ + Equipamento",
          terceiro: "200€ + Curso",
        }),
        createdBy: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Criar jurados de teste
    const testJudges = [
      {
        name: "Mariza Silva",
        description: "Fadista profissional e professora de canto",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "António Ferreira",
        description: "Guitarrista de fado com 30 anos de experiência",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Maria Santos",
        description: "Crítica musical e especialista em fado",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const createdJudges = await db
      .insert(judges)
      .values(testJudges)
      .returning();

    // Associar jurados ao evento
    const judgeAssociations = createdJudges.map((judge) => ({
      eventId: testEvent.id,
      judgeId: judge.id,
      createdAt: new Date(),
    }));

    await db.insert(eventJudges).values(judgeAssociations);

    // Criar participantes de teste
    const testParticipants = [
      {
        name: "João Silva",
        email: "joao.silva@email.com",
        phone: "912345678",
        category: "fado",
        experience: "5 anos de experiência em fado",
        status: "approved",
        registrationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Maria Costa",
        email: "maria.costa@email.com",
        phone: "923456789",
        category: "fado",
        experience: "Fadista amadora há 3 anos",
        status: "approved",
        registrationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "António Oliveira",
        email: "antonio.oliveira@email.com",
        phone: "934567890",
        category: "fado",
        experience: "Cantor profissional, novo no fado",
        status: "approved",
        registrationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.insert(participants).values(testParticipants);

    return {
      success: true,
      message: "Dados de teste criados com sucesso!",
      eventId: testEvent.id,
    };
  } catch (error) {
    console.error("Erro ao criar dados de teste:", error);
    return {
      success: false,
      error: "Erro ao criar dados de teste",
    };
  }
}

/**
 * Verificar se existem dados de teste
 */
export async function checkTestDataExists() {
  try {
    const eventCount = await db.select().from(events);
    const judgeCount = await db.select().from(judges);
    const participantCount = await db.select().from(participants);

    return {
      success: true,
      data: {
        hasEvents: eventCount.length > 0,
        hasJudges: judgeCount.length > 0,
        hasParticipants: participantCount.length > 0,
        eventCount: eventCount.length,
        judgeCount: judgeCount.length,
        participantCount: participantCount.length,
      },
    };
  } catch (error) {
    console.error("Erro ao verificar dados:", error);
    return {
      success: false,
      error: "Erro ao verificar dados",
    };
  }
}
