import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { texto, idioma, contexto } = await req.json();

  if (!texto?.trim()) {
    return NextResponse.json({ error: 'Sin texto' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key no configurada' }, { status: 500 });
  }

  const targetLang = idioma === 'fr' ? 'French' : 'English';

  // Prompt según contexto
  let system: string;
  if (contexto === 'ocupacion') {
    system = `You are a translator. Translate the following occupation/profession from Spanish to ${targetLang}. Output ONLY the translated word or short phrase, nothing else. Examples: "Gerente" → "Manager", "Mercadóloga" → "Marketing Specialist", "Empresario" → "Business Owner", "Arquitecto" → "Architect", "Médico" → "Physician".`;
  } else {
    const directions = idioma === 'fr'
      ? 'Noreste→Nord-Est, Sureste→Sud-Est, Suroeste→Sud-Ouest, Noroeste→Nord-Ouest'
      : 'Noreste→Northeast, Sureste→Southeast, Suroeste→Southwest, Noroeste→Northwest';
    system = `You are a legal translator specializing in Mexican real estate property descriptions. Translate the Spanish text to formal ${targetLang}. Rules: preserve all measurements and numbers exactly; translate cardinal directions (${directions}); use "linear meters" for "ml", "square meters" for "m²"; keep the same structure and punctuation; output ONLY the translated text with no explanations or preamble.`;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: contexto === 'ocupacion' ? 50 : 1200,
      system,
      messages: [{ role: 'user', content: texto }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: `API error ${response.status}: ${err.slice(0, 100)}` }, { status: 500 });
  }

  const data = await response.json();
  const translated = data.content?.[0]?.text?.trim();

  if (!translated) {
    return NextResponse.json({ error: 'Sin resultado' }, { status: 500 });
  }

  return NextResponse.json({ translated });
}
