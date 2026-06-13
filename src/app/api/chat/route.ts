import { NextResponse } from 'next/server';
import { mistral, MISTRAL_TEXT_MODEL } from '@/lib/mistral';

const SYSTEM_PROMPT = `You are Krishi Mitra, an expert AI agronomist assistant for Indian farmers.
You provide practical, actionable advice on:
- Crop diseases and treatments using pesticides/fungicides available in India
- Seasonal crop planning based on Indian agro-climatic zones
- Irrigation and water management 
- Government schemes (PM-KISAN, PMFBY, etc.)
- Minimum Support Prices (MSP)
- Weather-based farming decisions

Keep responses concise, practical and farmer-friendly. 
If the user writes in Hindi, respond in Hindi. If in English, respond in English.
Never give generic answers — always relate to Indian farming conditions.`;

export async function POST(req: Request) {
  try {
    const { messages, language } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const response = await mistral.chat.complete({
      model: MISTRAL_TEXT_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      temperature: 0.7,
      maxTokens: 512,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from Mistral');

    return NextResponse.json({
      role: 'assistant',
      content: typeof content === 'string' ? content : content.map((c: any) => c.text).join(''),
    });
  } catch (error) {
    console.error('[Chat Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process chat' },
      { status: 500 }
    );
  }
}
