import { NextResponse } from 'next/server';
import { mistral, MISTRAL_VISION_MODEL } from '@/lib/mistral';

const SYSTEM_PROMPT = `You are an expert AI agronomist specializing in Indian crop diseases. 
Analyze the crop image provided and return a JSON response ONLY (no markdown, no explanation) with this exact structure:
{
  "disease_name": "string (full scientific and common name, or 'Healthy Crop' if no disease)",
  "confidence_score": number (0-100),
  "severity_level": "low" | "moderate" | "high" | "critical" | "none",
  "disease_category": "fungal" | "bacterial" | "viral" | "pest" | "nutrient_deficiency" | "none",
  "symptoms_detected": ["string", ...],
  "treatment_recommendations": {
    "immediate": ["string", ...],
    "chemical": ["string", ...],
    "organic": ["string", ...]
  },
  "prevention_measures": ["string", ...],
  "is_healthy": boolean
}
Focus on Indian farming conditions, crops, and available treatments. Recommend pesticides/fungicides available in India.`;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const cropType = formData.get('crop_type') as string | null;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert image to base64 for Pixtral (vision model)
    const imageBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const mimeType = image.type || 'image/jpeg';

    const userPrompt = cropType
      ? `Analyze this ${cropType} crop image for diseases.`
      : 'Analyze this crop image for diseases. Identify the crop type if possible.';

    const response = await mistral.chat.complete({
      model: MISTRAL_VISION_MODEL,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              imageUrl: { url: `data:${mimeType};base64,${base64Image}` },
            },
            {
              type: 'text',
              text: userPrompt,
            },
          ],
        },
      ],
      responseFormat: { type: 'json_object' },
      temperature: 0.1,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from Mistral');

    const result = typeof content === 'string' ? JSON.parse(content) : content;

    return NextResponse.json({
      report_id: crypto.randomUUID(),
      ...result,
    });
  } catch (error) {
    console.error('[Disease Analyze Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
