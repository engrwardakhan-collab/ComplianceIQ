# 🚀 Deployment Guide - Next.js Contract Analyzer

## Option 1: Deploy to Vercel (Easiest - 2 minutes)

Vercel is the official Next.js hosting platform. **Completely free tier available.**

### Step 1: Prepare Your Project
```bash
# Create new Next.js project
npx create-next-app@latest contract-analyzer --typescript=false --tailwind=false
cd contract-analyzer
```

### Step 2: Copy Files
Copy all the files we created into your project:
- `app/page.jsx` → `app/page.jsx`
- `app/page.module.css` → `app/page.module.css`
- `app/layout.jsx` → `app/layout.jsx`
- `app/globals.css` → `app/globals.css`
- `app/api/analyze/route.js` → `app/api/analyze/route.js`
- `app/api/chat/route.js` → `app/api/chat/route.js`
- `next.config.js` → `next.config.js`
- `package.json` → Update with dependencies

### Step 3: Create Environment File
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

### Step 4: Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/contract-analyzer.git
git push -u origin main
```

### Step 5: Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. In "Environment Variables", add:
   - `OPENAI_API_KEY` = your actual API key
5. Click "Deploy"

**Done!** Your app is live. Vercel gives you a URL like:
`https://contract-analyzer-xyz.vercel.app`

---

## Option 2: Deploy to Render (Alternative - 5 minutes)

Render is another easy deployment option with generous free tier.

### Step 1-3: Same as Vercel (Project setup & environment)

### Step 4: Push to GitHub
Same as Step 4 above

### Step 5: Deploy to Render
1. Go to https://render.com
2. Click "New +"
3. Select "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: contract-analyzer
   - **Environment**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
6. Add Environment Variables:
   - `OPENAI_API_KEY` = your API key
7. Click "Create Web Service"

**Done!** Render deploys and gives you a URL like:
`https://contract-analyzer-xyz.onrender.com`

---

## Option 3: Deploy to AWS (More Control - 10 minutes)

Using AWS Amplify for simple deployment.

### Step 1: Install AWS CLI
```bash
npm install -g @aws-amplify/cli
```

### Step 2: Initialize Amplify
```bash
amplify init
```

### Step 3: Deploy
```bash
amplify publish
```

---

## Comparison

| Feature | Vercel | Render | AWS |
|---------|--------|--------|-----|
| Setup Time | 2 min | 5 min | 10 min |
| Free Tier | ✅ Yes | ✅ Yes | ✅ Generous |
| Scaling | Auto | Auto | Auto |
| Custom Domain | ✅ | ✅ | ✅ |
| Recommended | ⭐⭐⭐ | ⭐⭐ | ⭐ |

---

## Local Development

### Before Deploying, Test Locally

```bash
# Install dependencies
npm install

# Create .env.local file with your API key
cp .env.local.example .env.local
# Edit .env.local and add your OpenAI API key

# Run development server
npm run dev

# Visit http://localhost:3000
```

---

## Environment Variables

**IMPORTANT**: Never commit `.env.local` to GitHub!

### In your repository:
- Keep `.env.local.example` (template only)
- Add `.env.local` to `.gitignore`

### In Vercel/Render dashboard:
- Go to Project Settings
- Find Environment Variables section
- Add `OPENAI_API_KEY` with your actual key
- Redeploy

---

## Cost Analysis

### OpenAI API Costs
- Each contract analysis: ~$0.001-0.005
- Each chat message: ~$0.0001-0.0005
- 100 contracts: ~$0.10-0.50/month

### Hosting Costs
- **Vercel Free**: $0/month (up to 150GB bandwidth)
- **Vercel Pro**: $20/month (when you outgrow free)
- **Render Free**: $0/month (up to 750 hours)
- **AWS Free**: $0-15/month (within free tier)

### Monthly Budget
- **Small team (10 contracts/week)**: $5-10
- **Medium team (50 contracts/week)**: $10-20
- **Large team (200+ contracts/week)**: $50+

---

## Post-Deployment Checklist

- [ ] Environment variables set in dashboard
- [ ] API key is valid and has credits
- [ ] Test with a sample contract
- [ ] Verify table extraction works
- [ ] Test chat functionality
- [ ] Check on mobile/tablet
- [ ] Share URL with team

---

## Troubleshooting

### "API Key not found" Error
- Check that `OPENAI_API_KEY` is set in your hosting dashboard
- Verify it's the correct key from OpenAI platform
- Redeploy after adding/changing the key

### "Build failed" on Deploy
- Check that all files are included
- Verify `package.json` has all dependencies
- Check for syntax errors in code
- Look at deployment logs

### "CORS Error" or "Network Error"
- This shouldn't happen with Next.js API routes
- Check browser console (F12) for actual error
- Verify API calls are to `/api/analyze` and `/api/chat`

### Slow Performance
- Check API response times (OpenAI can be 5-10 seconds)
- Verify contract size isn't too large
- Check hosting tier has enough resources

---

## Custom Domain (Optional)

### On Vercel:
1. Project Settings → Domains
2. Add your domain (example.com)
3. Update DNS records

### On Render:
1. Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## Monitoring & Logging

### Vercel
- Dashboard shows deployment status
- Analytics available under "Analytics"
- Real-time logs under "Deployments"

### Render
- Dashboard shows service status
- Logs available under "Logs"
- Metrics under "Events"

---

## Next Steps After Deployment

1. **Share with Team**
   - Send the live URL
   - Create user guide
   - Set up access permissions if needed

2. **Monitor Usage**
   - Check OpenAI usage dashboard weekly
   - Monitor API costs
   - Track deployment health

3. **Collect Feedback**
   - Ask users about their experience
   - Note missing features
   - Plan improvements

4. **Scale as Needed**
   - Upgrade hosting tier if needed
   - Add authentication for teams
   - Integrate with your CRM

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://docs.render.com
- **Next.js Docs**: https://nextjs.org/docs
- **OpenAI Docs**: https://platform.openai.com/docs

---

## Security Best Practices

✅ Never commit API keys  
✅ Use environment variables  
✅ Rotate keys regularly  
✅ Monitor usage for abuse  
✅ Add rate limiting (optional)  
✅ Use HTTPS only  
✅ Keep dependencies updated  

---

**You're ready to deploy! Choose Vercel for easiest setup.** 🚀
