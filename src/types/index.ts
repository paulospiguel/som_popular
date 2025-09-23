import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { events, participants } from "@/infra/database/schema";

export const eventSchema = createSelectSchema(events);
export const participantSchema = createSelectSchema(participants);

export type Participant = z.infer<typeof participantSchema>;
export type Event = z.infer<typeof eventSchema>;
