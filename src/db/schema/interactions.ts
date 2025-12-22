import {
	type AnyPgColumn,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { rooms } from "./rooms.ts";

export const interactions = pgTable("interactions", {
	id: uuid("id").primaryKey().defaultRandom(),

	roomId: uuid("room_id")
		.notNull()
		.references(() => rooms.id, { onDelete: "cascade" }),

	// Este campo guarda o ID da interação anterior para manter o contexto
	parentInteractionId: uuid("parent_interaction_id").references(
		(): AnyPgColumn => interactions.id,
		{ onDelete: "set null" },
	),

	// ID da interação retornado pelo Gemini para manter o contexto na API
	geminiInteractionId: text("gemini_interaction_id"),

	prompt: text("prompt").notNull(),
	response: text("response"),

	createdAt: timestamp("created_at").notNull().defaultNow(),
});
