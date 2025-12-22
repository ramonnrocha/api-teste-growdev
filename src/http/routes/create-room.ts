import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const createRoomRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms",
    {
      schema: {
        body: z.object({
          userId: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { userId } = request.body;

      if (!userId) {
        return reply.status(400).send({ error: "userId is required" });
      }

      const room = await db
        .insert(schema.rooms)
        .values({ userId: userId as string, description: "Nova conversa" })
        .returning();

      return reply.status(201).send({ roomId: room[0].id });
    }
  );
};
