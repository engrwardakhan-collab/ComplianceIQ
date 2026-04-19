# 🏠 Contract Analyzer - Real Estate Document Analyzer

A production-ready Next.js application for analyzing real estate contracts with AI. Extract key information, get summaries, and ask questions about contracts.

## ⚡ Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ installed
- OpenAI API key from https://platform.openai.com/api-keys

### Local Setup
```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local and add your OpenAI API key

# 3. Run development server
npm run dev

# 4. Open browser
# Visit http://localhost:3000
```

## 🚀 Deploy to Production

### Option 1: Vercel (Recommended)
1. Push to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add `OPENAI_API_KEY` environment variable
5. Deploy!

### Option 2: Render
1. Push to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect your repository
5. Add `OPENAI_API_KEY` environment variable
6. Deploy!

**See `docs/DEPLOYMENT_GUIDE.md` for detailed instructions**

## 📁 Project Structure

```
contract-analyzer-nextjs/
├── app/
│   ├── api/
│   │   ├── analyze/        # Contract analysis endpoint
│   │   │   └── route.js
│   │   └── chat/           # Chat assistant endpoint
│   │       └── route.js
│   ├── page.jsx            # Main UI component
│   ├── page.module.css     # Page styles
│   ├── layout.jsx          # Root layout
│   └── globals.css         # Global styles
├── public/                 # Static files
├── docs/                   # Documentation
├── .env.local.example      # Environment template
├── next.config.js          # Next.js config
├── package.json            # Dependencies
└── README.md               # This file
```

## ✨ Features

✅ **File Upload** - Upload text contracts for analysis
✅ **Smart Extraction** - AI extracts key contract information
✅ **Summary Generation** - Automatic contract summary
✅ **Interactive Table** - Clickable rows highlight in document
✅ **AI Chat** - Ask questions about the contract
✅ **Document Highlighting** - Visual feedback on extracted data
✅ **Side-by-side Layout** - Document and summary on same screen
✅ **Mobile Responsive** - Works on desktop, tablet, and phone
✅ **No Hallucination** - AI only answers from extracted data
✅ **Error Handling** - Comprehensive error messages

## 🛠️ Technology Stack

- **Frontend**: React 18 + Next.js 14
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-3.5 Turbo
- **Styling**: CSS Modules
- **Deployment**: Vercel or Render

## 📖 Documentation

- **`docs/QUICK_START.md`** - 5-minute setup guide
- **`docs/FILE_STRUCTURE.md`** - How files are organized
- **`docs/DEPLOYMENT_GUIDE.md`** - Deploy to Vercel/Render

## 💰 Cost Breakdown

| Item | Cost |
|------|------|
| OpenAI API (per contract) | ~$0.001 |
| Vercel Hosting | FREE |
| Render Hosting | FREE |
| **Monthly (100 contracts)** | **~$0.10** |

## 🔑 Environment Variables

Create `.env.local` file:
```
OPENAI_API_KEY=sk-your-api-key-here
```

**Never commit `.env.local` to git!**

## 📝 What Gets Extracted

The analyzer automatically extracts:
- Contract Date
- Parties (Buyer, Seller, Broker)
- Property Address
- Purchase Price
- Down Payment / Earnest Money
- Closing Date
- Inspection Period
- Financing Terms
- HOA Fees
- Commission Rates
- Special Terms and Conditions

## 🧪 Testing Locally

```bash
# Start development server
npm run dev

# Open http://localhost:3000

# Test workflow:
# 1. Set API key
# 2. Upload a .txt contract file
# 3. Review extracted information
# 4. Ask questions in chat
# 5. Verify highlighting works
```

## 🏗️ Building for Production

```bash
# Build production-ready app
npm run build

# Start production server
npm run start

# Verify build
npm run lint
```

## 🔒 Security Best Practices

✅ Never hardcode API keys  
✅ Use environment variables  
✅ Keep `.env.local` out of git  
✅ Use HTTPS in production  
✅ Validate inputs  
✅ Rate limit API calls (optional)  
✅ Monitor API usage  

## 📞 Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **OpenAI Docs**: https://platform.openai.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://docs.render.com

## 🐛 Troubleshooting

### "npm: command not found"
Install Node.js from https://nodejs.org

### "OPENAI_API_KEY not found"
- Check `.env.local` exists
- Verify it has your actual API key
- Restart dev server

### "API is not responding"
- Check internet connection
- Verify API key is valid
- Check OpenAI account has credits
- Review error in browser console (F12)

### "File upload not working"
- Ensure file is `.txt` format
- Check file size isn't too large
- Try with smaller test file

## 🚀 Next Steps

1. **Setup Locally** - Follow Quick Start above
2. **Test** - Upload a sample contract
3. **Deploy** - Push to Vercel or Render
4. **Share** - Send URL to your team
5. **Monitor** - Check API usage and costs

## 📄 License

MIT - Feel free to use and modify

## 💡 Tips

- Temperature is set to 0.2 for factual responses
- Maximum document size is 4000 characters for analysis
- Chat maintains conversation history
- Clickable table rows highlight matching text in document
- All data is processed via OpenAI (no local storage)

## ✅ Deployment Checklist

Before deploying:
- [ ] `.env.local` has valid API key
- [ ] `npm install` completed
- [ ] `npm run dev` works locally
- [ ] Contract upload works
- [ ] Chat responds correctly
- [ ] All files are committed to git
- [ ] `.env.local` is NOT committed
- [ ] `.gitignore` has `.env.local`

## 🎉 You're Ready!

Your contract analyzer is ready to use. Start by reading `docs/QUICK_START.md` and deploy to Vercel for instant production access.

---

**Need help?** Check the docs folder or review the inline code comments.

**Happy analyzing!** 🏠
