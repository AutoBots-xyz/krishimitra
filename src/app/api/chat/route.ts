import { NextResponse } from 'next/server';
import { mistral, MISTRAL_TEXT_MODEL } from '@/lib/mistral';

const SYSTEM_PROMPT = `You are Krishi Mitra, an expert AI agronomist assistant for Indian farmers.
You provide practical, actionable advice on crop diseases, seasonal planning, irrigation, government schemes, and weather.

CRITICAL FORMATTING RULES:
1. Always structure your responses with clear, highly readable formatting.
2. Use headings (### Heading) to divide different sections.
3. Use bullet points or numbered lists to break down steps or multiple items.
4. Keep paragraphs short (2-3 sentences max) for easy reading.
5. Highlight important terms, chemicals, or schemes in **bold**.
6. Provide highly detailed, step-by-step guidance rather than vague answers.

IMPORTANT LANGUAGE RULE: You MUST always provide your answer in BOTH English and Hindi. Structure your response EXACTLY like this:
### English
(Your complete, detailed answer in English using markdown lists and bold text)

---

### हिन्दी (Hindi)
(Your complete, detailed answer translated to Hindi using markdown lists and bold text)

Never give generic answers — always relate to Indian farming conditions and be highly detailed.`;



export async function POST(req: Request) {
  try {
    const { messages, language } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const completion = await mistral.chat.complete({
      model: MISTRAL_TEXT_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      temperature: 0.7,
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from Mistral');

    return NextResponse.json({
      role: 'assistant',
      content: typeof content === 'string' ? content : content,
    });
  } catch (error) {
    console.error('[Chat Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process chat' },
      { status: 500 }
    );
  }
}
