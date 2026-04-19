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
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a real estate contract analyzer. Your job is to extract EVERY distinct piece of information from the contract — one field per fact, clause, fee, date, party, or obligation.

Return ONLY valid JSON (no markdown, no backticks, just raw JSON):
{
  "extracted_data": [
    { "field": "Field Name", "value": "Exact value from contract" }
  ],
  "summary": "2-3 sentence summary"
}

RULES:
- Create a SEPARATE field for EACH distinct item. Do NOT group multiple facts into one field.
- If there are multiple fees, create one row per fee (e.g., "Retainer Fee", "Hourly Fee", "Flat Fee", "Commission Rate").
- If there are multiple parties, create one row per party (e.g., "Buyer Name", "Seller Name", "Broker Name", "Brokerage Firm").
- If there are multiple dates, create one row per date (e.g., "Contract Date", "Amendment Date", "Closing Date", "Deadline Date").
- If there are multiple contingencies or conditions, create one row each.
- Extract every checkbox, blank field, or form value that has been filled in.
- Use short, clear field names (3-5 words max).
- Values should be the exact text from the contract — keep them concise but complete.
- Aim for 20+ fields. Cover everything: parties, dates, fees, percentages, conditions, deadlines, terms, obligations, signatures.
- If a field exists in the contract but its value is blank, unfilled, or contains only underscores (e.g. "______", "___", "_ _ _"), still include it with value "Not filled". Underscores alone are NOT a signature or value — they indicate a blank line waiting to be filled.
- For signature fields specifically: contracts typically have two separate lines — a NAME line (pre-printed or typed name) and a SIGNATURE line (where the person actually signs). These are DIFFERENT things. A typed/printed name alone does NOT mean the signature line is filled. Only treat a signature as complete if there is an actual signature mark, handwritten text, or explicit signature present ON the signature line itself. If the signature line contains only underscores or is blank, mark it as "Not filled" even if a printed name appears nearby. When extracting, create separate fields for "Name" and "Signature" so they are not confused.
- EXCLUDE these categories entirely — do NOT extract them: disclaimer text, legal notices, dotloop fields (verification links, timestamps, codes), watermarks, copyright notices, and form boilerplate/footer text.`,
        },
        {
          role: 'user',
          content: `Extract every distinct piece of information from this contract as separate fields:\n\n${documentText.substring(0, 8000)}`,
        },
      ],
      temperature: 0.2,
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
