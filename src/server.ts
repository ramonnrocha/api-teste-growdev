import { fastifyCors } from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env.ts";
import { createInteractionRoute } from "./http/routes/create-interaction.ts";
import { getRoomInteractionsRoute } from "./http/routes/get-room-interactions.ts";
import { getRoomsRoute } from "./http/routes/get-rooms.ts";
import { loginRoute } from "./http/routes/login.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

// AJUSTE DO CORS
app.register(fastifyCors, {
  origin: [
    "http://localhost:5173", // Desenvolvimento local
    "https://web-teste-growdev-6jx1tbf2k-ramonnrochas-projects.vercel.app", // URL específica que você enviou
    /\.vercel\.app$/, // Permite qualquer subdomínio da vercel.app (útil para previews)
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get("/health", () => {
  return { status: "ok" };
});

// Erro para quando a API do Gemini atinge o limite de processamento
app.setErrorHandler((error: any, request, reply) => {
  if (typeof error?.message === "string" && error.message.includes("quota")) {
    return reply.status(429).send({
      error: "Servidor sobrecarregado",
      message: "Atingimos o limite de processamento de IA. Tente em 1 minuto.",
    });
  }
  reply.send(error);
});

// Rotas HTTP
app.register(loginRoute);
app.register(getRoomsRoute);
app.register(getRoomInteractionsRoute);
app.register(createInteractionRoute);

// AJUSTE PARA ACEITAR CONEXÕES EXTERNAS: O Render exige host '0.0.0.0' para aceitar conexões externas
app
  .listen({
    port: env.PORT,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log(`Server is running on port ${env.PORT}!`);
  });
