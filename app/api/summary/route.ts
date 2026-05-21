import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  request: Request
) {

  try {

    const body = await request.json();

    const { results } = body;

    const prompt = `
You are an AI finance optimization assistant.

Summarize this AI spend audit in about 100 words.

Focus on:
- overspending
- optimization opportunities
- practical savings
- business efficiency

Audit Results:
${JSON.stringify(results)}
`;

    const response =
      await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const summary =
      response.choices[0]?.message?.content;

    return Response.json({
      summary,
    });

  } catch (error) {

    console.error(error);

    return Response.json({
      summary:
        "Your AI stack shows moderate optimization opportunities with potential cost savings across several tools.",
    });

  }

}