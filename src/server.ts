import { fastifyCors } from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { fastify } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env.ts";
import { createQuestionRoute } from "./http/routes/create-question.ts";
import { getRoomQuestionsRoute } from "./http/routes/get-room-questions.ts";
import { getRoomsRoute } from "./http/routes/get-rooms.ts";
import { loginRoute } from "./http/routes/login.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
	origin: "http://localhost:5173",
});

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get("/health", () => {
	return { status: "ok" };
});

//  Routes HTTP
app.register(loginRoute);
app.register(getRoomsRoute);
app.register(getRoomQuestionsRoute);
app.register(createQuestionRoute);

app.listen({ port: env.PORT }).then(() => {
	console.log(`Server is running!`);
});
