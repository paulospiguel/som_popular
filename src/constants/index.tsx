export const APP_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export enum ROLES {
  ADMIN = "manager",
  OPERATOR = "operator",
}

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

export const PARTICIPANT_CATEGORIES = [
  { label: "Vocal", value: "vocal" },
  { label: "Instrumental", value: "instrumental" },
  { label: "Composição", value: "composicao" },
  { label: "Grupo/Banda", value: "grupo" },
] as const;

export const EVENT_TYPES = [
  { label: "Festival", value: "festival" },
  { label: "Classificatória", value: "classificatoria" },
  { label: "Semi-Final", value: "semi-final" },
  { label: "Final", value: "final" },
] as const;

export const EXPERIENCE_LEVELS = [
  { label: "Não tem experiência", value: "nao-tem-experiencia" },
  { label: "Iniciante", value: "iniciante" },
  { label: "Intermediário", value: "intermediario" },
  { label: "Avançado", value: "avancado" },
  { label: "Profissional", value: "profissional" },
] as const;

export const EVENT_CATEGORIES = [
  { label: "Rock", value: "rock" },
  { label: "Pop", value: "pop" },
  { label: "Sertanejo", value: "sertanejo" },
  { label: "Música Popular", value: "musica-popular" },
  { label: "Livre", value: "livre" },
] as const;

export const APPROVAL_MODES = [
  {
    label: "Automática",
    value: "automatic",
    description: "Participantes são aprovados automaticamente",
  },
  {
    label: "Revisada",
    value: "manual",
    description: "Participantes precisam ser aprovados manualmente",
  },
] as const;

export const REGULATION_FILE_EXTENSIONS = [
  "pdf",
  "txt",
  "doc",
  "docx",
] as const;
