import { desc, eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const getRoomsRoute: FastifyPluginCallbackZod = async (app) => {
  app.get("/rooms/:userId", async (req, res) => {
    const { userId } = req.params as { userId: string };

    const rooms = await db
      .select({
        id: schema.rooms.id,
        description: schema.rooms.description,
        createdAt: schema.rooms.createdAt,
      })
      .from(schema.rooms)
      .where(eq(schema.rooms.userId, userId))
      .groupBy(schema.rooms.id, schema.rooms.description)
      .orderBy(desc(schema.rooms.createdAt));

    return res.status(200).send(rooms);
  });
};
