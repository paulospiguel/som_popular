import { auth } from "@/lib/auth";

// Exportar todos os métodos HTTP que o Better Auth precisa
export const GET = auth.handler;
export const POST = auth.handler;
export const PUT = auth.handler;
export const PATCH = auth.handler;
export const DELETE = auth.handler;
export const OPTIONS = auth.handler;
