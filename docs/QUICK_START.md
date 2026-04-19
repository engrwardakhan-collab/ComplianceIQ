# 🚀 Quick Start - Contract Analyzer Next.js

## 5-Minute Setup

### Step 1: Install Node.js (if you haven't)
Download from https://nodejs.org (LTS version)

### Step 2: Create Project
```bash
npx create-next-app@latest contract-analyzer --typescript=false --tailwind=false
cd contract-analyzer
```

### Step 3: Copy Files
Copy these files into your project:

**Into `app/` folder:**
- `page.jsx`
- `page.module.css`
- `layout.jsx`
- `globals.css`

**Into `app/api/analyze/` folder:**
- `route.js` (from `app_api_analyze_route.js`)

**Into `app/api/chat/` folder:**
- `route.js` (from `app_api_chat_route.js`)

**Into root folder:**
- `next.config.js`

### Step 4: Install Dependencies
```bash
npm install openai
```

### Step 5: Add API Key
```bash
# Copy example to .env.local
cp .env.local.example .env.local

# Edit .env.local and add your OpenAI API key
```

File should look like:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

Get your key from: https://platform.openai.com/api-keys

### Step 6: Run Locally
```bash
npm run dev
```

Visit: **http://localhost:3000**

### Step 7: Test
1. Enter your OpenAI API key
2. Upload a text file (.txt) with contract content
3. See extraction results
4. Ask questions in chat

## ✅ That's it! You're running locally.

---

## Deploy to Vercel (2 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "initial"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/contract-analyzer
git push -u origin main
```

### 2. Connect to Vercel
- Go to https://vercel.com
- Click "New Project"
- Select your GitHub repo
- Click "Import"

### 3. Set Environment Variables
- In Vercel dashboard, go to "Settings"
- Find "Environment Variables"
- Add: `OPENAI_API_KEY` = your API key
- Click "Save"

### 4. Deploy
- Click "Deploy"
- Wait 2 minutes
- Your app is live! 🎉

You get a URL like: `https://contract-analyzer-xyz.vercel.app`

---

## Deploy to Render (5 minutes)

### 1. Push to GitHub
Same as Step 1 above

### 2. Create Render Account
Go to https://render.com and sign up

### 3. Connect Repository
- Click "New"
- Select "Web Service"
- Connect GitHub
- Select your repo

### 4. Configure
```
Name: contract-analyzer
Environment: Node
Region: Leave as default
Build Command: npm run build
Start Command: npm run start
```

### 5. Add Environment Variable
- Scroll down to "Environment"
- Key: `OPENAI_API_KEY`
- Value: your API key
- Click "Add"

### 6. Deploy
- Click "Create Web Service"
- Wait 3-5 minutes
- Your app is live! 🎉

You get a URL like: `https://contract-analyzer-xyz.onrender.com`

---

## File Checklist

Before deploying, make sure you have:

```
✅ app/page.jsx
✅ app/page.module.css
✅ app/layout.jsx
✅ app/globals.css
✅ app/api/analyze/route.js
✅ app/api/chat/route.js
✅ next.config.js
✅ package.json (with openai dependency)
✅ .env.local.example
✅ .gitignore (has .env.local)
```

---

## Troubleshooting

### "npm: command not found"
Install Node.js from https://nodejs.org

### "Cannot find module 'openai'"
```bash
npm install openai
```

### "OPENAI_API_KEY not found"
- Check .env.local exists
- Check it has your actual API key
- Restart dev server: `npm run dev`

### "Build failed on Vercel"
- Check files are in correct folders
- Check package.json has "next" and "openai"
- Check .env.local.example exists (not needed, but helps)

### "API key invalid"
- Go to https://platform.openai.com/api-keys
- Generate a new key
- Make sure it starts with `sk-`
- Update .env.local

### "Nothing happens when I upload"
- Check browser console (F12)
- Look for error messages
- Verify API key is set
- Try a smaller file

---

## Next Steps

### 1. Try It Out
- [ ] Upload a sample contract
- [ ] Check extraction accuracy
- [ ] Test chat with questions
- [ ] Verify highlighting works

### 2. Share with Team
- [ ] Send the live URL
- [ ] Gather feedback
- [ ] Collect feature requests

### 3. Monitor Costs
- [ ] Check OpenAI usage: https://platform.openai.com/account/usage
- [ ] Budget ~$0.001 per contract analysis
- [ ] Set spending limits if needed

### 4. Customize (Optional)
- [ ] Change colors in `page.module.css`
- [ ] Modify extraction fields in `route.js`
- [ ] Add more features

---

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **OpenAI Docs**: https://platform.openai.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://docs.render.com

---

## Cost Summary

| Item | Cost |
|------|------|
| OpenAI API (100 contracts) | ~$0.10 |
| Vercel Hosting | Free |
| Render Hosting | Free |
| **Total/Month** | **~$1-5** |

---

## Success Checklist

- [x] Node.js installed
- [x] Project created
- [x] Files copied
- [x] Dependencies installed
- [x] .env.local configured
- [x] Running locally
- [x] Tested with contract
- [x] Deployed to Vercel/Render
- [x] Live URL working
- [x] Shared with team

**You're all set! Enjoy! 🎉**
