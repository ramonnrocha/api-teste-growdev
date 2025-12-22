import { eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const loginRoute: FastifyPluginCallbackZod = (app) => {
	app.post(
		"/login",
		{
			schema: {
				body: z.object({
					email: z.string().email("Email inválido"),
				}),
			},
		},
		async (req, res) => {
			const { email } = req.body;

			// 1️⃣ Buscar usuário
			let user = await db.query.users.findFirst({
				where: eq(schema.users.email, email),
			});

			// 2️⃣ Criar usuário se não existir
			if (!user) {
				const result = await db
					.insert(schema.users)
					.values({ email })
					.returning();
				user = result[0];

				if (!user) {
					throw new Error("Failed to create user");
				}
			}

			// 3️⃣ Criar room inicial
			const result = await db
				.insert(schema.rooms)
				.values({
					userId: user.id,
					description: "Nova conversa",
				})
				.returning();

			const room = result[0];

			if (!room) {
				throw new Error("Failed to create room");
			}

			// 4️⃣ Gerar token
			const token = app.jwt.sign(
				{
					email: user.email,
				},
				{
					sub: user.id,
				},
			);

			return res.send({
				token,
				roomId: room.id,
				userId: user.id,
			});
		},
	);
};
