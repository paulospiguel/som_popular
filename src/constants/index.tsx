export const APP_URL =
  process.env.VERCEL_ENV === "development"
    ? "http://localhost:3000"
    : `https://${process.env.VERCEL_URL}`;

export enum ROLES {
  ADMIN = "manager",
  OPERATOR = "operator",
}

// Níveis de severidade dos logs
export const LOG_SEVERITY_LEVELS = [
  {
    label: "Crítico",
    value: "critical",
    color: "text-red-600 bg-red-100",
    priority: 1,
  },
  {
    label: "Maior",
    value: "major",
    color: "text-orange-600 bg-orange-100",
    priority: 2,
  },
  {
    label: "Menor",
    value: "minor",
    color: "text-yellow-600 bg-yellow-100",
    priority: 3,
  },
  {
    label: "Sem Classificação",
    value: "none",
    color: "text-gray-600 bg-gray-100",
    priority: 4,
  },
] as const;

// Status dos eventos padronizados
export const EVENT_STATUSES = [
  { label: "Rascunho", value: "draft", color: "text-gray-600 bg-gray-100" },
  {
    label: "Publicado",
    value: "published",
    color: "text-green-600 bg-green-100",
  },
  { label: "Em Curso", value: "ongoing", color: "text-blue-600 bg-blue-100" },
  {
    label: "Concluído",
    value: "completed",
    color: "text-yellow-600 bg-yellow-100",
  },
  { label: "Cancelado", value: "cancelled", color: "text-red-600 bg-red-100" },
] as const;

// Categorias de eventos padronizadas
export const EVENT_CATEGORIES = [
  { label: "Pop", value: "pop" },
  { label: "Rock", value: "rock" },
  { label: "Samba", value: "samba" },
  { label: "Forró", value: "forró" },
  { label: "Sertanejo", value: "sertanejo" },
  { label: "Composição", value: "composicao" },
  { label: "Grupo/Banda", value: "grupo" },
  { label: "Vocal", value: "vocal" },
  { label: "Instrumental", value: "instrumental" },
  { label: "Livre", value: "livre" },
] as const;

// Categorias de participantes padronizadas
export const PARTICIPANT_CATEGORIES = [
  { label: "Vocal", value: "vocal" },
  { label: "Instrumental", value: "instrumental" },
  { label: "Composição", value: "composicao" },
  { label: "Grupo/Banda", value: "grupo" },
] as const;

// Tipos de eventos padronizados
export const EVENT_TYPES = [
  { label: "Classificatória", value: "classificatoria" },
  { label: "Semi-Final", value: "semi-final" },
  { label: "Final", value: "final" },
  { label: "Workshop", value: "workshop" },
  { label: "Masterclass", value: "masterclass" },
] as const;

// Níveis de experiência padronizados
export const EXPERIENCE_LEVELS = [
  { label: "Iniciante", value: "iniciante" },
  { label: "Intermediário", value: "intermediario" },
  { label: "Avançado", value: "avancado" },
  { label: "Profissional", value: "profissional" },
] as const;
