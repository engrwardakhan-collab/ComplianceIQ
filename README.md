# ComplianceIQ — AI-Powered Contract Analyzer

A premium Next.js application that analyzes real estate contracts using AI. Upload a PDF or TXT contract, instantly extract 20+ key fields, detect missing signatures, and ask questions about the document.

## Features

- **PDF & TXT support** — Upload contracts as PDF (displayed natively) or plain text
- **20+ field extraction** — AI extracts every distinct fact: parties, dates, fees, signatures, contingencies, and more
- **Missing field detection** — Blank/unfilled fields are automatically flagged in red
- **Signature validation** — Distinguishes printed names from actual signatures; blank signature lines shown as "Not filled"
- **AI chat** — Ask questions about the contract in natural language
- **Text highlighting** — Click any table row to highlight matching text in the document (TXT files)
- **Dark premium UI** — Clean dark theme with indigo accents

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI GPT-3.5 Turbo
- **PDF Parsing**: pdf-parse (server-side, Node.js)
- **Styling**: CSS Modules
- **Icons**: Lucide React

## Project Structure

```
app/
├── api/
│   ├── analyze/route.js      # AI field extraction & summary
│   ├── chat/route.js         # Conversational AI about the contract
│   └── extract-pdf/route.js  # Server-side PDF text extraction
├── page.jsx                  # Main UI
├── page.module.css           # Styles
├── layout.jsx
└── globals.css
next.config.js
package.json
.env.local.example
```

## Local Setup

### Prerequisites
- Node.js 18+
- OpenAI API key — [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env
# Add your OpenAI API key to .env:
# OPENAI_API_KEY=sk-...

# 3. Start dev server
npm run dev

# 4. Open http://localhost:3000
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variable: `OPENAI_API_KEY=sk-...`
4. Deploy

## Environment Variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key |

Create a `.env` file in the project root (never commit it — it is in `.gitignore`).

## How It Works

1. **Upload** a PDF or TXT contract
2. PDF is displayed natively in the left panel; text is extracted server-side for AI processing
3. AI analyzes the full document and returns structured fields (one row per fact)
4. Unfilled fields (blank lines, underscores) are highlighted red
5. Click any row to highlight the matching text in the document
6. Ask questions in the chat panel powered by GPT-3.5

## License

MIT
