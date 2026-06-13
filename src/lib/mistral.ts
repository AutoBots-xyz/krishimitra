import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  throw new Error('Missing MISTRAL_API_KEY in environment variables. Add it to .env.local');
}

export const mistral = new Mistral({ apiKey });

// Text model for chat, advisory, planning
export const MISTRAL_TEXT_MODEL = 'mistral-large-latest';

// Vision model for crop disease image analysis
export const MISTRAL_VISION_MODEL = 'pixtral-12b-2409';
