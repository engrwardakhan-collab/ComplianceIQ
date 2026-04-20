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
          content: `Update app/api/analyze/route.js with a dynamic field extraction system for Michigan Realtors® forms.

Requirements:

1. INTELLIGENT FIELD DETECTION:
   - Scan the entire document line by line
   - Identify field patterns:
     * "Label: _____" or "Label: [value]"
     * "Label ___________"
     * "[✓] Checkbox Label" or "[ ] Checkbox Label"
     * "Label" followed by a line with values
   - Extract BOTH the label and the value, exactly as shown in document

2. DYNAMIC EXTRACTION (NO HARDCODED FIELD NAMES):
   - Don't rely on predefined Michigan Realtors® field lists
   - Parse the document structure itself
   - If it looks like a field (label + value pattern), extract it
   - Works for ANY Michigan Realtors® form version (BB, J, JJ, amendments, etc.)
   - Works for custom added fields in "OTHER" sections

3. HANDLE SPECIAL CASES:
   - DOTLOOP SIGNATURES: "name dotloop verified MM/DD/YY H:MM" → Extract as "name - Signed MM/DD/YY"
   - CHECKBOXES: "[✓]" = selected, "[ ]" = not selected (only include checked ones)
   - MULTI-LINE VALUES: If value spans multiple lines, concatenate with space
   - DATES: Standardize to MM/DD/YYYY format
   - AMOUNTS: Keep $ and % symbols
   - BLANK FIELDS: Skip fields with only underscores/blank spaces unless they contain information

4. COMPREHENSIVE EXTRACTION:
   Return ALL found fields:
   - Party information (names, addresses, contact info)
   - All financial terms (ANY dollar amount or percentage)
   - All dates (ANY date format)
   - All checked checkboxes and selections
   - All signatures (including dotloop verified signatures)
   - ALL other fields regardless of 
   - EXCLUDE: pure boilerplate legal text paragraphs, copyright lines, watermarks, dotloop verification URLs/codes (but DO include the signer name and timestamp as the signature value).

5. SMART GROUPING IN JSON:
   {
     "extracted_data": [
       { "field": "exact label from document", "value": "extracted value" },
       { "field": "next label", "value": "next value" },
       ...continue for ALL fields found...
     ],
     "summary": "2-3 sentence summary of contract"
   }

6. QUALITY REQUIREMENTS:
   ✓ Extract ALL relevant fields found in document (small or large)
   ✓ No minimum field count - depends on document size and content
   ✓ No guessing - only extract what's actually in the document
   ✓ Preserve exact field labels from document
   ✓ Preserve exact values from document
   ✓ If a field is blank/empty, skip it
   ✓ Handle all Michigan Realtors® form variations
   ✓ Works for single-page and multi-page documents
   ✓ Works for short amendments and long contracts

7. TEST WITH PROVIDED DOCUMENTS:
   - Test with Listing Contract (BB form) - may have 40+ fields
   - Test with Buyer Agency Contract (J/JJ form) - may have 30+ fields
   - Test with Amendment forms - may have 5-15 fields
   - Test with Listing Change Sheet (MLS form) - may have 10-20 fields
   - Extract whatever fields exist, no forced minimums

IMPLEMENTATION APPROACH:
Scan document structure and extract anything that follows a "field pattern" (label + value or checkbox). This makes it work for ANY Michigan Realtors® document regardless of size or number of fields.`,
        },
        {
          role: 'user',
          content: `Extract every distinct filled-in field from this contract:\n\n${documentText.substring(0, 15000)}`,
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
