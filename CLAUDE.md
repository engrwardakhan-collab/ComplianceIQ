# ContractIQ — Claude Code Context

## Project Overview
AI-powered Michigan Realtors® contract analyzer. Users upload PDF forms, the app renders them as images and sends to OpenAI o3 vision API to extract all fields, checkboxes, and signatures. Results display in a structured table with a follow-up chat interface.

- **App name:** ContractIQ
- **GitHub:** https://github.com/engrwardakhan-collab/ComplianceIQ
- **Deployed on:** Vercel (Hobby plan — 30s function timeout, known issue with o3)
- **Stack:** Next.js 14 App Router, OpenAI API, PDF.js (CDN), pdf-parse

---

## Key Files

| File | Purpose |
|------|---------|
| `app/page.jsx` | Main UI — file upload, PDF rendering, extracted data table, chat |
| `app/api/analyze/route.js` | Core analysis endpoint — sends images + form fields to o3 |
| `app/api/chat/route.js` | Chat endpoint — uses gpt-4o-mini for Q&A about the contract |
| `app/api/extract-pdf/route.js` | Server-side text extraction using pdf-parse (for chat context) |
| `next.config.js` | Webpack canvas:false alias, pdf-parse as external package |

---

## Architecture

### PDF Upload Flow (client-side)
1. User uploads PDF
2. Three parallel operations run:
   - `renderPDFToImages(file)` — PDF.js renders each page to canvas at 2.5x scale, exports as JPEG 85%
   - `extractTextFromPDF(file)` — calls `/api/extract-pdf` for text (chat context only)
   - `extractFormFields(file)` — PDF.js `getAnnotations()` extracts AcroForm field values programmatically
3. All three results sent to `/api/analyze` together

### PDF.js Loading Strategy
- Loaded from CDN (NOT npm import) to avoid webpack `Object.defineProperty` conflict
- CDN version: `3.11.174` (pdf.min.js + pdf.worker.min.js from cdnjs.cloudflare.com)
- pdfjs-dist npm package is installed but NOT used for rendering

### Analysis API (`/api/analyze`)
- Model: `o3` with `max_completion_tokens: 16000`
- o3 does NOT support `temperature` or `max_tokens` — use only `max_completion_tokens`
- Sends: system prompt + user text with pre-extracted form fields hint + page images (detail: 'high')
- Returns: `{ success, extracted_data: [{field, value}], summary }`

### Chat API (`/api/chat`)
- Model: `gpt-4o-mini`
- Requires non-empty `documentText` (will error if missing)
- Uses extracted text (not images) for context

---

## SYSTEM_PROMPT Design Principles (CRITICAL)

The prompt in `app/api/analyze/route.js` is **universal** — it must work on ANY Michigan Realtors® form without hardcoding form-specific section numbers, field names, or examples.

**Never add:**
- Specific section numbers (e.g., "Section 6A", "Section 22")
- Form-specific field names (e.g., "BB-1", "CWTH")
- Hardcoded examples referencing specific document content

**Pattern-based extraction rules:**
- **Pattern A** — Named field with fill line: `Label: ___value___`
- **Pattern B** — Blank within a sentence/clause → create short field name from context
- **Pattern C** — Free text box / "Other" section
- **Pattern D** — Value above label (tabular layout): value written ON line, label BELOW it

### Signature Extraction (decision tree)
1. **Spatial check first** — stamp inside/attached to a box belongs to THAT box
2. Three tiers:
   - `"Not signed"` — box completely empty, nothing at all
   - `"Unclear — signature association ambiguous"` — something present but can't read it
   - `"[Name] — Signed on MM/DD/YYYY at H:MM AM/PM TZ"` — clearly readable
3. Dotloop stamp format: `[Name] dotloop verified MM/DD/YY H:MM AM/PM TZ`
   - Read name from printed text BEFORE "dotloop verified"
   - Read date digit by digit, convert 2-digit year to 4-digit
4. Never invent or guess signer names
5. Do NOT create separate date fields for signatures — date goes inside the value

### Checkbox Rules
- ONE summary field per checkbox group
- Value = selected option label, or `"Not filled"` if nothing checked
- Never skip a checkbox group even if all unchecked

---

## UI Behavior
- `"Not filled"` and `"Not signed"` both show red `unfilledBadge` and `unfilledRow` styling
- Both count toward the "X missing" counter in the header
- Clicking a field row highlights it in the document (text mode only, not PDF iframe)
- PDF shown in `<iframe>` using blob URL; text shown in line-by-line div

---

## Known Issues & Decisions

### Vercel Timeout (ACTIVE ISSUE)
- o3 model takes 25–35s per request
- Vercel Hobby plan caps serverless functions at 30s
- Some requests succeed, some timeout with 504
- **Resolution options:** switch to gpt-4.1 (faster) OR upgrade Vercel to Pro

### PDF.js CDN vs npm
- Using CDN because npm import caused `Object.defineProperty called on non-object` webpack error
- Do NOT switch back to npm import without solving that error

### o3 Model Parameters
- `temperature` → NOT supported, do not add
- `max_tokens` → NOT supported, use `max_completion_tokens` only

### pdf-parse Import Style
- Uses `await import('pdf-parse')` dynamic import (not static)
- Required by serverless environment; static import causes build failures

---

## Environment Variables Required
```
OPENAI_API_KEY=sk-...
```

## Run Locally
```bash
npm run dev -- --port 3000
```
Kill all Node processes before starting to avoid port conflicts:
```bash
taskkill //F //IM node.exe
```

## Deploy
```bash
git push origin main
```
Vercel auto-deploys on push to `main`.

---

## User Preferences
- No hardcoded form-specific content in prompts — universal patterns only
- Prompt changes must not break other form types
- "Not filled" and "Not signed" should look and behave identically in the UI
- Keep responses concise; avoid unnecessary explanation
