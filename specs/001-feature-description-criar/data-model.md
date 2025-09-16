# Data Model: Plataforma de Festivais de Talentos e Música

## Entities

### Evento

- id: UUID
- nome: string
- local: string
- datas: [date]
- fases: [string] (classificatórias, semi-final, final)
- regulamento: file (PDF)
- premiacao: string
- status: enum (aberto, em andamento, encerrado)

### Participante

- id: UUID
- nome: string
- representante: string
- email: string (validado)
- telefone: string (validado)
- estilo_musical: string
- foto: file (opcional)
- status: enum (inscrito, aprovado, indeferido, desclassificado, classificado, premiado)
- qrcode: string
- origem: enum (publico, operador)

### Administrador

- id: UUID
- nome: string
- email: string
- permissao: enum (admin, operador, auditor)

### Inscricao

- id: UUID
- participante_id: UUID
- evento_id: UUID
- status: enum (pendente, aprovado, indeferido)
- motivo_indeferimento: string (opcional)
- aceite_regulamento: boolean
- data_hora: datetime
- origem: enum (publico, operador)

### Nota

- id: UUID
- participante_id: UUID
- evento_id: UUID
- fase: string
- valor: number
- origem: enum (verbal, papel)
- data: date

### Relatorio

- id: UUID
- evento_id: UUID
- tipo: enum (pdf, csv)
- data_geracao: datetime
- arquivo: file

## Relationships

- Um Evento possui muitos Participantes
- Um Participante pode ter várias Inscrições (em diferentes eventos)
- Um Evento possui várias Notas (por participante/fase)
- Um Administrador pode gerenciar múltiplos Eventos
- Relatórios são gerados por Evento

## Validation Rules

- Email e telefone obrigatórios e validados para inscrição
- Aceite do regulamento obrigatório
- Foto do participante opcional
- Inscrição só pode ser feita em evento com status "aberto"
- Notas só podem ser lançadas para participantes aprovados
- Relatórios só podem ser gerados para eventos encerrados
