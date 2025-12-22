import { desc, eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { interactionWithGeminiAI } from "../../services/gemini.ts";

export const createInteractionRoute: FastifyPluginCallbackZod = (app) => {
	app.post(
		"/rooms/:roomId/interactions",
		{
			schema: {
				params: z.object({
					roomId: z.string(),
				}),
				body: z.object({
					prompt: z.string().min(10),
				}),
			},
		},
		async (req, res) => {
			try {
				const { prompt } = req.body;
				const { roomId } = req.params;

				const room = await db
					.select()
					.from(schema.rooms)
					.where(eq(schema.rooms.id, roomId))
					.limit(1);

				if (room.length === 0) {
					return res.status(404).send({ error: "Room not found" });
				}

				const [lastInteraction] = await db
					.select()
					.from(schema.interactions)
					.where(eq(schema.interactions.roomId, roomId))
					.orderBy(desc(schema.interactions.createdAt))
					.limit(1);

				let geminiInteractionResponse;
				try {
					geminiInteractionResponse = await interactionWithGeminiAI(
						prompt,
						lastInteraction?.geminiInteractionId ?? undefined,
					);
				} catch (error) {
					console.error("Erro ao chamar API do Gemini:", error);
					return res.status(502).send({
						error: "Failed to communicate with Gemini API",
						details: error instanceof Error ? error.message : "Unknown error",
					});
				}

				const [insertedInteraction] = await db
					.insert(schema.interactions)
					.values({
						prompt,
						roomId,
						parentInteractionId: lastInteraction?.id,
						geminiInteractionId: geminiInteractionResponse.geminiInteractionId,
						response: geminiInteractionResponse.text,
					})
					.returning();

				if (!insertedInteraction) {
					return res
						.status(500)
						.send({ error: "Failed to create new interaction" });
				}

				return res.status(201).send({
					id: insertedInteraction.id,
					prompt: insertedInteraction.prompt,
					response: insertedInteraction.response,
					createdAt: insertedInteraction.createdAt,
				});
			} catch (error) {
				console.error("Erro ao criar interação:", error);
				return res.status(500).send({
					error: "Internal server error",
					details: error instanceof Error ? error.message : "Unknown error",
				});
			}
		},
	);
};
