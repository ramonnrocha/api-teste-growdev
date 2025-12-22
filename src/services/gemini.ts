import { GoogleGenAI } from "@google/genai";
import { env } from "../env.ts";

type InteractionWithGeminiAIResponse = {
	text: string;
	geminiInteractionId: string;
};

const gemini = new GoogleGenAI({
	apiKey: env.GEMINI_API_KEY,
});

const model = "gemini-2.5-flash";

export async function interactionWithGeminiAI(
	prompt: string,
	lastInteractionId: string | undefined,
): Promise<InteractionWithGeminiAIResponse> {
	const SYSTEM_INSTRUCTION = `
    Responda de forma curta, objetiva e direta.
    Use no máximo 3 parágrafos curtos.
    Evite explicações longas, introduções e conclusões.
    Se possível, use listas curtas.
    `;

	const response = await gemini.interactions.create({
		model,
		input: prompt,
		system_instruction: SYSTEM_INSTRUCTION,
		previous_interaction_id: lastInteractionId,
	});

	const text =
		response.outputs?.find((output) => output.type === "text")?.text ??
		"Sem resposta gerada pela IA";

	return {
		text,
		geminiInteractionId: response.id,
	};
}
