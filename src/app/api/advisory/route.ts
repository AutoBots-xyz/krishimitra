import { NextResponse } from 'next/server';
import { mistral, MISTRAL_TEXT_MODEL } from '@/lib/mistral';
import { fetchWeatherApi } from "openmeteo";

const SYSTEM_PROMPT = `You are an expert agricultural advisor for Indian farmers.
Given weather forecast data and location, generate a farming advisory in JSON format ONLY (no markdown).
Return this exact structure:
{
  "summary": "string (1-2 sentence overall advisory)",
  "irrigation_advice": "string (specific irrigation recommendation)",
  "disease_risk_alert": "string (disease risk based on weather conditions)",
  "field_activity_recommendations": ["string", "string", ...],
  "forecast_highlights": {
    "next_3_days": "string",
    "next_7_days": "string"
  }
}
Focus on Indian farming conditions, kharif/rabi seasons, and crops grown in that region.`;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat') ?? '23.2599';
    const lng = searchParams.get('lng') ?? '77.4126';

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    // Fetch Open-Meteo Data using official SDK
    const params = {
      latitude: latNum,
      longitude: lngNum,
      hourly: ["temperature_2m", "rain", "precipitation", "precipitation_probability"],
      daily: ["temperature_2m_max", "temperature_2m_min", "weather_code"],
      timezone: "auto"
    };
    
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const hourly = response.hourly()!;
    const daily = response.daily()!;
    
    const weatherData = {
      hourly: {
        time: Array.from(
          { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
          (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000).toISOString()
        ),
        temperature_2m: Array.from(hourly.variables(0)!.valuesArray() || []),
        rain: Array.from(hourly.variables(1)!.valuesArray() || []),
        precipitation: Array.from(hourly.variables(2)!.valuesArray() || []),
        precipitation_probability: Array.from(hourly.variables(3)!.valuesArray() || []),
      },
      daily: {
        time: Array.from(
          { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
          (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000).toISOString()
        ),
        temperature_2m_max: Array.from(daily.variables(0)!.valuesArray() || []),
        temperature_2m_min: Array.from(daily.variables(1)!.valuesArray() || []),
        weather_code: Array.from(daily.variables(2)!.valuesArray() || []),
      }
    };

    // Build a contextual prompt with the coordinates and real weather
    const userPrompt = `Generate a hyper-local farming advisory for a farmer located at coordinates: latitude ${lat}, longitude ${lng}.
The current date is ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
Here is the real weather forecast data from Open-Meteo for the coming days:
${JSON.stringify(weatherData.daily)}
Provide a hyper-local farming advisory based on this exact weather data. Focus on Indian farming conditions.`;

    const mistralResponse = await mistral.chat.complete({
      model: MISTRAL_TEXT_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      responseFormat: { type: 'json_object' },
      temperature: 0.4,
    });

    const content = mistralResponse.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from Mistral');

    const result = typeof content === 'string' ? JSON.parse(content) : content;
    result.weatherData = weatherData; // Pass real weather data to frontend
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Advisory Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch advisory' },
      { status: 500 }
    );
  }
}
