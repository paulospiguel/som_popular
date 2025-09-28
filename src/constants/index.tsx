import { Archive, CheckCircle, Clock, XCircle } from "lucide-react";

export enum ROLES {
  MASTER = "master",
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
  {
    label: "Rascunho",
    icon: Clock,
    value: "draft",
    color: "text-gray-600 bg-gray-100",
  },
  {
    icon: CheckCircle,
    label: "Publicado",
    value: "published",
    color: "text-green-600 bg-green-100",
  },
  {
    label: "Em Curso",
    icon: Clock,
    value: "ongoing",
    color: "text-blue-600 bg-blue-100",
  },
  {
    label: "Concluído",
    icon: CheckCircle,
    value: "completed",
    color: "text-yellow-600 bg-yellow-100",
  },
  {
    label: "Cancelado",
    icon: XCircle,
    value: "cancelled",
    color: "text-red-600 bg-red-100",
  },
  {
    label: "Inativado",
    icon: Archive,
    value: "deactivated",
    color: "text-gray-600 bg-gray-100",
  },
  {
    label: "Aprovado",
    icon: CheckCircle,
    value: "approved",
    color: "text-green-600 bg-green-100",
  },
  {
    label: "Rejeitado",
    icon: XCircle,
    value: "rejected",
    color: "text-red-600 bg-red-100",
  },
  {
    label: "Pendente",
    icon: Clock,
    value: "pending",
    color: "text-yellow-600 bg-yellow-100",
  },
] as const;

export const PARTICIPANT_CATEGORIES = [
  { label: "Vocal", value: "vocal" },
  { label: "Banda", value: "band" },
  { label: "Dupla", value: "duo" },
  { label: "Individual", value: "individual" },
] as const;

export const EVENT_TYPES = [
  { label: "Festival", value: "festival" },
  { label: "Classificatória", value: "qualifying" },
  { label: "Semi-Final", value: "semi-final" },
  { label: "Final", value: "final" },
] as const;

export const EXPERIENCE_LEVELS = [
  { label: "Não tem experiência", value: "no-experience" },
  { label: "Amador", value: "amateur" },
  { label: "Profissional", value: "professional" },
] as const;

export const EVENT_CATEGORIES = [
  { label: "Rock", value: "rock" },
  { label: "Pop", value: "pop" },
  { label: "Sertanejo", value: "country" },
  { label: "Música Popular", value: "popular-music" },
  { label: "Livre", value: "free" },
] as const;

export enum APPROVAL_MODES_VALUES {
  AUTOMATIC = "automatic",
  MANUAL = "manual",
}

export enum REGISTRATION_METHOD {
  AUTOMATIC,
  ONLINE,
  PLATFORM,
}

export const REGISTRATION_METHODS = [
  {
    label: "Online",
    value: REGISTRATION_METHOD.ONLINE,
    description: "Cadastro feito pelo próprio usuário",
  },
  {
    label: "Via Plataforma",
    value: REGISTRATION_METHOD.PLATFORM,
    description: "Cadastro feito por operador na plataforma",
  },
  {
    label: "Automática",
    value: REGISTRATION_METHOD.AUTOMATIC,
    description: "Cadastro automático do sistema",
  },
] as const;

export const APPROVAL_MODES = [
  {
    label: "Automática",
    value: APPROVAL_MODES_VALUES.AUTOMATIC,
    description: "Participantes são aprovados automaticamente",
  },
  {
    label: "Supervisionada",
    value: APPROVAL_MODES_VALUES.MANUAL,
    description: "Participantes precisam ser aprovados manualmente",
  },
] as const;

export const REGULATION_FILE_EXTENSIONS = [
  "pdf",
  "txt",
  "doc",
  "docx",
] as const;
