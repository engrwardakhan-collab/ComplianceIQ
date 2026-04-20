import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { documentText } = await request.json();

    if (!documentText) {
      return Response.json(
        { error: 'No document text provided' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a real estate contract analyzer. Extract EVERY distinct piece of filled-in information from the contract.

Return ONLY valid JSON (no markdown, no backticks):
{
  "extracted_data": [
    { "field": "Field Name", "value": "Exact value from contract" }
  ],
  "summary": "2-3 sentence summary"
}

RULES:
- One field per fact: separate rows for each party, date, fee, percentage, checkbox, obligation.
- Extract ALL filled values — names, addresses, dates, dollar amounts, percentages, checkbox selections, initials.
- SIGNATURES: This document uses dotloop e-signatures. A dotloop signature looks like a name followed by "dotloop verified" and a timestamp (e.g. "warda khan dotloop verified 04/20/26 2:15 PM CDT"). Treat any such entry as a COMPLETED signature. Do NOT mark dotloop-verified signatures as unsigned or blank.
- CHECKBOXES: If a checkbox is marked (checked/ticked), extract the selected option as the value.
- BLANK FIELDS: If a field line has only underscores ("______") and no value, mark as "Not filled".
- Aim for 20+ fields covering all parties, dates, financial terms, conditions, and signatures.
- EXCLUDE: pure boilerplate legal text paragraphs, copyright lines, watermarks, dotloop verification URLs/codes (but DO include the signer name and timestamp as the signature value).`,
        },
        {
          role: 'user',
          content: `Extract every distinct filled-in field from this contract:\n\n${documentText.substring(0, 12000)}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 3000,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return Response.json(
        { error: 'Could not parse analysis' },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return Response.json({
      success: true,
      extracted_data: parsed.extracted_data || [],
      summary: parsed.summary || '',
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}
