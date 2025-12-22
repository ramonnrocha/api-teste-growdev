import { db, sql } from "./connection.ts";
import { questions } from "./schema/questions.ts";
import { rooms } from "./schema/rooms.ts";
import { users } from "./schema/users.ts";

async function seed() {
	console.log("🌱 Iniciando seed...");

	// 1️⃣ Criar usuário
	const [user] = await db
		.insert(users)
		.values({
			email: "admin@teste.com",
		})
		.returning();

	console.log("👤 Usuário criado:", user.email);

	// 2️⃣ Criar room
	const [room] = await db
		.insert(rooms)
		.values({
			name: "Sala principal",
			description: "Sala inicial do sistema",
			userId: user.id,
		})
		.returning();

	console.log("🏠 Room criada:", room.name);

	// 3️⃣ Criar perguntas
	await db.insert(questions).values([
		{
			roomId: room.id,
			question: "O que é este projeto?",
			answer: "Um sistema simples com login por email.",
		},
		{
			roomId: room.id,
			question: "Qual stack está sendo usada?",
			answer: "Fastify, React, Postgres e Drizzle.",
		},
	]);

	console.log("❓ Perguntas criadas");

	console.log("✅ Seed finalizado com sucesso!");
	await sql.end();
}

seed().catch((err) => {
	console.error("❌ Erro no seed:", err);
	sql.end();
});
