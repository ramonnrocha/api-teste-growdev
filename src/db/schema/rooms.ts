// db/schema/rooms.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.ts";

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  description: text("description"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
