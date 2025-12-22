import { eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const getRoomInteractionsRoute: FastifyPluginCallbackZod = (app) => {
	app.get(
		"/rooms/:roomId/interactions",
		{
			schema: {
				params: z.object({
					roomId: z.string(),
				}),
			},
		},
		async (req, res) => {
			const { roomId } = req.params;

			const interactions = await db
				.select({
					id: schema.interactions.id,
					prompt: schema.interactions.prompt,
					response: schema.interactions.response,
					createdAt: schema.interactions.createdAt,
				})
				.from(schema.interactions)
				.where(eq(schema.interactions.roomId, roomId))
				.orderBy(schema.interactions.createdAt);

			const result = interactions.map((interaction) => ({
				id: interaction.id,
				prompt: interaction.prompt,
				response: interaction.response ?? null,
				createdAt: interaction.createdAt.toISOString(),
			}));

			return res.status(200).send(result);
		},
	);
};
