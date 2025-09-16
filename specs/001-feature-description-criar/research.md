# Phase 0: Research & Unknowns Resolution

## Unresolved NEEDS CLARIFICATION from Feature Spec

- O que acontece se o participante tentar se inscrever após o prazo? Não é permitito, sendo mostrado um alerta que o prazo para inscrição já passou.
- Como o sistema lida com dados pessoais após o término do evento? Os dados são mantidos para fins de auditoria
- Como garantir a autenticidade dos resultados publicados? Os resultados ção publicados em uma página específica podendo ser consultado. Terá também um relatório com as informações mais importantes emitida a cada fim de casa final de etapa de votação, sendo assinado pelos jurados.

## Technology Stack Best Practices

- Use Next.js + TypeScript for all web features
- UI: shadcn-ui, reui.io, OriginUi, lucide-react, tailwindcss
- State: zustend, react-query, react-hook-form
- Auth: better-auth
- Data: drizzle-orm, PostgreSQL
- Always componentize and avoid duplication

## Research Tasks

- Research best practices for handling late registrations in digital festival platforms
- Research data retention and deletion policies for event-based user data (GDPR, LGPD)
- Research auditability and transparency mechanisms for public result publication

## Consolidated Findings

- **Late Registrations**: Most platforms block form submission after deadline; some allow waitlist or require admin override. Decision: Block by default, allow admin override for special cases.
- **Data Retention**: Retain participant data for minimum 1 year post-event for audit, then anonymize or delete per user request. Decision: Add data retention policy to user agreement and admin dashboard.
- **Result Authenticity**: Publish signed result logs, keep immutable audit trail, and allow public verification. Decision: Implement result hash/signature and public audit log.

## Decisions

- Block late registrations by default; admin can override
- Retain data for 1 year, then anonymize/delete
- Publish signed results and public audit log for transparency

## Alternatives Considered

- Allowing all late registrations (rejected: fairness)
- Retaining data indefinitely (rejected: privacy)
- No public audit log (rejected: transparency)
