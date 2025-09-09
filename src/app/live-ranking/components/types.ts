export enum ParticipantStyle {
  VOCAL = "Vocal",
  BAND = "Banda",
  DUO = "Dupla",
}

export interface Participant {
  id: number;
  name: string;
  style: ParticipantStyle;
  photoUrl: string;
  score: number;
}
