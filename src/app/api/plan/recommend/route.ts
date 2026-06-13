import { NextResponse } from 'next/server';
import { mistral, MISTRAL_TEXT_MODEL } from '@/lib/mistral';

const SYSTEM_PROMPT = `You are an expert crop planning advisor for Indian farmers.
Given farmer inputs, generate a highly detailed seasonal crop recommendation in JSON format ONLY (no markdown).
Return this exact structure:
{
  "recommended_crops": [
    {
      "crop_name": "string",
      "variety": "string",
      "suitability_score": 0.0,
      "sowing_window": "string",
      "harvest_window": "string",
      "fertilizer_plan": ["string"],
      "irrigation_schedule": "string",
      "total_water_requirement": "string",
      "expected_yield": "string",
      "estimated_income": "string",
      "input_cost_breakdown": {
        "seeds": "string",
        "fertilizers": "string",
        "pesticides": "string",
        "labor": "string",
        "irrigation": "string",
        "machinery": "string",
        "total_estimated_cost": "string"
      },
      "estimated_net_profit": "string",
      "profit_margin_percent": 0.0,
      "break_even_point": "string",
      "risk_assessment": {
        "weather_risk": "low | medium | high",
        "market_risk": "low | medium | high",
        "pest_risk": "low | medium | high",
        "notes": "string"
      },
      "intercropping_suggestions": ["string"],
      "labor_requirement_timeline": [
        { "activity": "string", "period": "string", "intensity": "low | medium | high" }
      ],
      "sustainability_badges": ["string"],
      "notes": "string"
    }
  ],
  "alternative_crop_option": {
    "crop_name": "string",
    "reason": "string"
  },
  "crop_rotation_plan": [
    { "season": "string", "crop": "string", "rationale": "string" }
  ],
  "soil_health_impact_note": "string",
  "government_scheme_pointers": ["string"],
  "post_harvest_guidance": "string",
  "seasonal_plan_summary": "string",
  "general_notes": "string"
}

Ensure you provide 2 strong recommended_crops. All monetary values should be estimated in Indian Rupees (₹). Tailor the cost and yield based on whether the farmer uses organic/conventional methods or has family vs hired labor, and their risk appetite. Provide realistic data suitable for India.`;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { 
      landSize, 
      soilType, 
      waterSource,
      budgetLevel,
      laborAvailability,
      farmingApproach,
      targetMarket,
      riskAppetite,
      planningHorizon,
      language
    } = data;

    if (!soilType || !waterSource) {
      return NextResponse.json({ error: 'Missing required farm details' }, { status: 400 });
    }

    const currentMonth = new Date().toLocaleString('en-IN', { month: 'long' });
    const userPrompt = `Generate a seasonal crop plan for an Indian farmer with these details:
- Land Size: ${landSize || 'Not specified'} acres
- Soil Type: ${soilType}
- Water Source: ${waterSource}
- Current Month: ${currentMonth}
- Budget / Investment Capacity: ${budgetLevel || 'Average'}
- Labor Availability: ${laborAvailability || 'Not specified'}
- Farming Approach: ${farmingApproach || 'Conventional'}
- Target Market: ${targetMarket || 'Local Mandi'}
- Risk Appetite: ${riskAppetite || 'Medium'}
- Planning Horizon: ${planningHorizon || 'Single season'}

Recommend the best crops for the upcoming season based on these inputs and estimate costs accordingly.
IMPORTANT: You must provide the ENTIRE JSON response (all string values) translated to ${language === 'hi' ? 'Hindi (हिन्दी)' : 'English'}. Keep the JSON keys exactly as specified in English, but translate all the content/values into ${language === 'hi' ? 'Hindi' : 'English'}.`;

    const response = await mistral.chat.complete({
      model: MISTRAL_TEXT_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      responseFormat: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from Mistral');

    const result = typeof content === 'string' ? JSON.parse(content) : content;
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Plan Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate plan' },
      { status: 500 }
    );
  }
}
