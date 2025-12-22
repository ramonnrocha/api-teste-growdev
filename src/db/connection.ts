import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../env.ts";
import { schema } from "./schema/index.ts";

export const sql = postgres(env.DATABASE_URL, {
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
  max: 10,
});
export const db = drizzle(sql, { schema, casing: "snake_case" });
