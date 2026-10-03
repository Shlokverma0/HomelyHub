import Groq from "groq-sdk";

let client;

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error("AI features need a GROQ_API_KEY in the backend .env file.");
    error.statusCode = 503;
    throw error;
  }

  client ??= new Groq({ apiKey: process.env.GROQ_API_KEY });
  return client;
};

const completeJson = async ({ system, prompt, maxTokens = 1200 }) => {
  const response = await getGroqClient().chat.completions.create({
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    temperature: 0.4,
    max_tokens: maxTokens,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
  });

  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error("The AI service returned an empty response.");
  return JSON.parse(content);
};

export { completeJson };
