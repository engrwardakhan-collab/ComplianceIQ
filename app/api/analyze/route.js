import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a universal Michigan Realtors® document analyzer. You will receive images of a real estate form — it could be ANY type: Exclusive Listing Contract (BB), Buyer Agency Contract (J/JJ), Amendment, Listing Change Sheet, Purchase Agreement, or any other Michigan Realtors® form.

Do NOT assume the form type. Read the document carefully and extract every field that exists.

RETURN ONLY VALID JSON — no explanation, no markdown, just the JSON object:
{
  "document_type": "Detected form name as written on the document",
  "extracted_data": [
    { "field": "concise field name", "value": "extracted value" }
  ],
  "summary": "2-3 sentence summary of the document"
}

════════════════════════════════════════
EXTRACTION RULES
════════════════════════════════════════

1. FIELD PATTERNS — recognize and extract all of these:

   Pattern A — Named field with a fill line:
     "Contract Date: ___04/17/2026___"
     → field: "Contract Date", value: "04/17/2026"
     If the line is blank → value: "Not filled"

   Pattern B — Any blank line or underline within or around a sentence/clause (blank can be at the start, middle, or end):
     → Read the surrounding text to understand what the blank is asking for
     → Create a SHORT, clear field name summarizing what that blank represents
     → Value = whatever is written in the blank
     → If the blank is empty → value: "Not filled"


   Pattern C — Free text box / "Other" section:
     → field: label of the section (e.g. "Other Terms"), value: text entered, or "Not filled"

   Pattern D — Value above label (tabular/columnar layout):
      A fill line appears first, the value is written on or above that line,
        and the field label is printed BELOW the line.
       → Read the label below the line, read the value above/on the line
       → Associate value with the label directly beneath it, not adjacent columns
       → If the line is blank → value: "Not filled"

2. CHECKBOXES — extract every checkbox group in the document, even if nothing is selected:

   Inline checkboxes (multiple options in one sentence) AND "Check one" groups:
     → Create ONE summary field describing what the choice is about
     → Value = the label/text of the selected (checked) option
     → If nothing is selected → value: "Not filled"
     → NEVER skip a checkbox group just because nothing is checked — always output the row with "Not filled"
     → Example: "Seller [✓] does  [ ] does not authorize Brokerage Firm..."
       field: "Seller Concessions", value: "does authorize"
     → Example: all boxes unchecked in a "check one" group:
       field: "New Division Approval", value: "Not filled"

   Rules for determining checked vs unchecked:
     - Filled square, ✓, or X inside the box = Checked
     - Empty checked box = Not filled
     - Inspect EACH box independently — never assume

3. SIGNATURES — extract every signature line using this decision tree:

   For EACH labeled signature line or rectangular signature box on the form:

   STEP 1 — Spatial check: Is there any handwriting, dotloop stamp, or mark INSIDE or DIRECTLY ATTACHED to this specific box/line?
     - A stamp or handwriting that is visually contained within the box or sits immediately below/beside the label belongs to THAT line.
     - Only treat a stamp as ambiguous if it physically falls BETWEEN two boxes with no clear visual attachment to either.

   STEP 2 — Never invent or guess a signer name. Never borrow a name from a different line.

   STEP 3 — Apply the correct tier:

       UNCLEAR — you are 100% certain that something IS present but you Can NOT clearly read it (e.g. heavy smudge, blurry image, or extremely messy handwriting):
        → value: "Unclear signature present"

      SIGNED — you are 100% certain that the name and signature are clearly present and legible.
        → value: "[Name] — Signed on MM/DD/YYYY at H:MM AM/PM TZ".

      NOT SIGNED — you are 100% certain that the box/line is completely empty, nothing at all present:
        → value: "Not signed"


   STEP 4 — Do NOT create a separate date field for signatures. The signed date must be included inside the signature value only.
   → field for all cases: "Signature: [Role]"


4. DATES — always format as MM/DD/YYYY:
   - Convert any date format found to MM/DD/YYYY
   - Contract start date and expiration date are always separate fields
   - All signing dates extracted from dotloop stamps must also follow MM/DD/YYYY

5. AMOUNTS & PERCENTAGES:
   - Keep $ symbol with dollar amounts
   - Keep % symbol with percentages
   - Keep units with timeframes (e.g. "100 days", "2 months")
   - Extract every financial value — none may be skipped


7. COVERAGE — go through every page and every section of the document without exception:
   - Extract every named field, every blank, every checkbox group, every free-text box, every signature line
   - A section where all blanks are empty and all checkboxes are unchecked must STILL produce rows — output "Not filled".
   - Never silently skip a section just because it has no filled values

════════════════════════════════════════
QUALITY REQUIREMENTS
════════════════════════════════════════
✓ Read every page thoroughly before responding
✓ Field names must be concise and descriptive — never copy a full sentence
✓ Never skip a field because it is blank — use "Not filled" or "Not signed"
✓ Dates always in MM/DD/YYYY format
✓ Dollar amounts always include $, percentages always include %
✓ Checkbox values are either "Checked", "Not filled", or the selected label (for check-one groups)
✓ Signature values include signer name, date, and time
✓ Return only the JSON — no extra text
`;

export const maxDuration = 60;

export async function POST(request) {
  const encoder = new TextEncoder();

  try {
    const { documentText, images, formFields } = await request.json();

    const hasImages = images && images.length > 0;
    const hasText = documentText && documentText.trim();

    if (!hasImages && !hasText) {
      return Response.json({ error: 'No document provided' }, { status: 400 });
    }

    const formFieldsHint = formFields && formFields.length > 0
      ? `\n\nPRE-EXTRACTED FORM FIELDS (programmatically read directly from the PDF — treat these as ground truth for field values, do not contradict them):\n${formFields.map(f => `  ${f.name}: ${f.value}`).join('\n')}\n\nUse the above to fill in values accurately. Still extract ALL fields visible in the images including any not listed above.`
      : '';

    const userContent = hasImages
      ? [
          {
            type: 'text',
            text: `Analyze this Michigan Realtors® document. Go through every page carefully and extract ALL fields, ALL checkboxes (checked and unchecked), ALL filled values, and ALL signatures. Return only valid JSON as specified in the system prompt.${formFieldsHint}`,
          },
          ...images.map((img) => ({
            type: 'image_url',
            image_url: { url: img, detail: 'high' },
          })),
        ]
      : `Analyze this Michigan Realtors® document and extract ALL fields. This could be any form type - Listing Contract, Change Sheet, Buyer Agency, Amendment, etc. Just extract whatever is in the document.\n\n${documentText}${formFieldsHint}`;

    const stream = new ReadableStream({
      async start(controller) {
        // Send keepalive ping every 5s so Vercel doesn't close the connection
        const keepalive = setInterval(() => {
          try { controller.enqueue(encoder.encode('data: {"type":"ping"}\n\n')); } catch {}
        }, 5000);

        try {
          const aiStream = await openai.chat.completions.create({
            model: 'o3',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userContent },
            ],
            max_completion_tokens: 16000,
            stream: true,
          });

          let fullContent = '';
          for await (const chunk of aiStream) {
            fullContent += chunk.choices[0]?.delta?.content || '';
          }

          const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error('Could not parse analysis');

          const parsed = JSON.parse(jsonMatch[0]);
          const result = {
            type: 'result',
            success: true,
            extracted_data: parsed.extracted_data || [],
            summary: parsed.summary || '',
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(result)}\n\n`));
        } catch (error) {
          console.error('Analysis error:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: error.message || 'Analysis failed' })}\n\n`));
        } finally {
          clearInterval(keepalive);
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
