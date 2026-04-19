# 📁 Project Structure - Contract Analyzer

## File Organization

```
contract-analyzer/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.js          (API endpoint for analysis)
│   │   └── chat/
│   │       └── route.js          (API endpoint for chat)
│   ├── globals.css               (Global styles)
│   ├── layout.jsx                (Root layout)
│   ├── page.jsx                  (Main page component)
│   └── page.module.css           (Page styles)
├── public/                       (Static files - optional)
├── .env.local                    (Environment variables - NEVER commit)
├── .env.local.example            (Template - commit this)
├── .gitignore                    (Git ignore rules)
├── next.config.js                (Next.js config)
├── package.json                  (Dependencies)
├── package-lock.json             (Lock file)
└── README.md                     (Documentation)
```

---

## Creating the Project Step-by-Step

### 1. Initialize Next.js Project
```bash
npx create-next-app@latest contract-analyzer --typescript=false --tailwind=false
cd contract-analyzer
```

### 2. Create Directory Structure
```bash
# API routes will be auto-created, but structure should be:
# app/api/analyze/route.js
# app/api/chat/route.js
```

### 3. Copy Files

**App Files:**
- `app/page.jsx` - Main component
- `app/page.module.css` - Styles
- `app/layout.jsx` - Root layout
- `app/globals.css` - Global styles

**API Routes:**
```bash
# Create directories
mkdir -p app/api/analyze
mkdir -p app/api/chat

# Copy route files
# app/api/analyze/route.js
# app/api/chat/route.js
```

**Config Files:**
- `next.config.js`
- `.env.local.example`
- `package.json` (update with dependencies)

---

## File Details

### Entry Point: `app/layout.jsx`
- Wraps entire app
- Sets metadata (title, description)
- No styles here

### Main Page: `app/page.jsx`
- Uses 'use client' directive (client component)
- Imports styles from `page.module.css`
- Handles all UI logic
- Calls `/api/analyze` and `/api/chat` endpoints

### Styles: `app/page.module.css`
- CSS Modules (scoped styling)
- Side-by-side layout
- Responsive design
- No Tailwind needed

### Global Styles: `app/globals.css`
- Applied to whole app
- Scrollbar styling
- Base element reset

### API Routes
**`app/api/analyze/route.js`:**
- POST endpoint
- Receives: `{ documentText }`
- Returns: `{ extracted_data, summary }`
- Calls OpenAI API

**`app/api/chat/route.js`:**
- POST endpoint
- Receives: `{ message, documentText, extractedData, messages }`
- Returns: `{ message }`
- Maintains conversation history

---

## How It Works

```
User Interface
    ↓
app/page.jsx (handles state)
    ↓
[Upload] → fetch('/api/analyze')
    ↓
    → OpenAI API
    ↓
    ← Extract data, return JSON
    ↓
Display in table + summary
    ↓
[Chat] → fetch('/api/chat')
    ↓
    → OpenAI API with context
    ↓
    ← Response
    ↓
Display in messages
```

---

## Environment Variables

### `.env.local` (Never commit)
```
OPENAI_API_KEY=sk-your-actual-key
```

### `.env.local.example` (Commit to repo)
```
OPENAI_API_KEY=sk-example-key
```

### In Vercel/Render Dashboard
Add environment variable in project settings:
- Name: `OPENAI_API_KEY`
- Value: Your actual API key

---

## Dependencies

### `package.json`
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "openai": "^4.28.0"
  }
}
```

### Install
```bash
npm install
```

---

## Local Development

```bash
# 1. Setup
npm install
cp .env.local.example .env.local
# Edit .env.local with your API key

# 2. Run
npm run dev

# 3. Open
# http://localhost:3000

# 4. Test
# - Upload a text file
# - Check extraction
# - Test chat
```

---

## Deployment

### File Checklist Before Deploy
- [ ] `app/page.jsx` - Main component
- [ ] `app/page.module.css` - Styles
- [ ] `app/layout.jsx` - Layout
- [ ] `app/globals.css` - Global styles
- [ ] `app/api/analyze/route.js` - Analysis endpoint
- [ ] `app/api/chat/route.js` - Chat endpoint
- [ ] `next.config.js` - Next config
- [ ] `package.json` - Dependencies updated
- [ ] `.env.local.example` - Template (commit this)
- [ ] `.gitignore` - Has `.env.local`

### Deploy Steps
1. Push to GitHub
2. Connect to Vercel/Render
3. Set `OPENAI_API_KEY` in dashboard
4. Deploy
5. Test live URL

---

## File Size Reference

| File | Lines | Size |
|------|-------|------|
| page.jsx | 200+ | ~8KB |
| page.module.css | 350+ | ~12KB |
| api/analyze/route.js | 50+ | ~2KB |
| api/chat/route.js | 60+ | ~2.5KB |
| **Total** | **660+** | **~25KB** |

---

## Best Practices

### ✅ Do
- Use environment variables for secrets
- Keep API keys in `.env.local`
- Use CSS Modules for styling
- Handle errors gracefully
- Test locally before deploying

### ❌ Don't
- Hardcode API keys
- Commit `.env.local`
- Use inline styles (use CSS Modules)
- Ignore error messages
- Deploy without testing

---

## Troubleshooting File Issues

### "Cannot find module 'openai'"
```bash
npm install openai
npm install
```

### "CSS not loading"
- Check import: `import styles from './page.module.css'`
- Check file exists: `app/page.module.css`
- Restart dev server

### "API not responding"
- Check file exists: `app/api/analyze/route.js`
- Check endpoint: `/api/analyze`
- Check .env.local has API key

### "Build fails"
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

---

## Quick Reference

```bash
# Create project
npx create-next-app@latest contract-analyzer

# Install deps
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local

# Run locally
npm run dev

# Build for production
npm run build

# Deploy
# Push to GitHub → Connect to Vercel → Done!
```

---

**You now have everything organized and ready to deploy!** 🎉
