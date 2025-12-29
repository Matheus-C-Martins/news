# NewsHub Setup Guide

## Overview

This guide explains how to set up and deploy NewsHub with proper API key management:

- **Local Development:** Direct API calls with your API key (safe, fast)
- **GitHub Pages:** Proxied API calls (secure, key hidden)

## Quick Start (Local Development)

### 1. Get Your API Key

```bash
# Visit https://newsapi.org and sign up (free)
# Copy your API key
```

### 2. Setup Local Environment

```bash
# Copy template
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
VUE_APP_NEWS_API_KEY=your_key_here
VUE_APP_VERCEL_API_URL=
```

### 3. Run Locally

```bash
npm install
npm run serve
# Open http://localhost:5173
```

## Production Deployment (GitHub Pages)

### Option 1: Simple (API Key Exposed)

**⚠️ Not Recommended for Public Sites**

If you just want it working:

1. Add GitHub Secret:
   - Settings → Secrets and variables → Actions
   - Add `VUE_APP_NEWS_API_KEY` with your key

2. Push to main→ Deployed!

**Problems:**
- API key visible in browser
- Anyone can steal and abuse your key
- Your key can be rate-limited

### Option 2: Secure (Recommended)

**Using a backend proxy to hide your API key**

See [PROXY_SETUP_GUIDE.md](./PROXY_SETUP_GUIDE.md) for complete instructions.

Quick summary:

1. Create backend proxy (Vercel, Railway, etc.)
2. Add GitHub Secrets:
   - `VUE_APP_NEWS_API_KEY` (for your proxy)
   - `VUE_APP_VERCEL_API_URL` (proxy endpoint)
3. Push → Deployed securely!

**Benefits:**
- API key never exposed
- Rate limit protection
- Request monitoring
- Cache control

## Environment Variables Explained

### Local Development (.env.local)

```env
# Your actual NewsAPI key
VUE_APP_NEWS_API_KEY=abc123...

# Empty - use direct API calls
VUE_APP_VERCEL_API_URL=
```

**Flow:**
```
Browser → (with API key) → NewsAPI
```

### Production (GitHub Secrets)

**Setup:**
```
Settings → Secrets and variables → Actions

Secret 1: VUE_APP_NEWS_API_KEY = abc123...
Secret 2: VUE_APP_VERCEL_API_URL = https://proxy.vercel.app/api
```

**Flow:**
```
Browser → (no API key) → Your Proxy → (with API key) → NewsAPI
```

## How It Works

### Local Development

1. You have `.env.local` with your API key
2. Vite reads it during dev server startup
3. `import.meta.env.VUE_APP_NEWS_API_KEY` = your key
4. Browser sends requests directly to NewsAPI with your key
5. Fast and convenient for development

### Production

1. GitHub Actions reads your secrets at build time
2. `npm run build` creates optimized production files
3. Your API key is only available to the proxy
4. Browser never sees your API key
5. All requests go through your secure proxy

## File Structure

```
project/
├── .env.local.example        ← Copy to .env.local (local dev)
├── .env.local                ← Your keys (git-ignored)
├── .env.production.example    ← Documentation (what GitHub injects)
├── .gitignore                ← Prevents committing secrets
├── src/
│   └── services/
│       └── newsApi.js          ← Auto-detects environment
├── .github/
│   └── workflows/
│       └── deploy.yml        ← GitHub Actions (injects secrets)
├── SETUP_GUIDE.md            ← This file
├── PROXY_SETUP_GUIDE.md      ← How to create proxy
```

## Verification

### Check Local Setup

```bash
# Start dev server
npm run serve

# In browser console
import.meta.env.VUE_APP_NEWS_API_KEY
# Should show your key

import { getApiConfig } from './src/services/newsApi.js'
getApiConfig()
# Should show:
# - environment: DEVELOPMENT
# - usingProxy: false
# - hasApiKey: true
```

### Check Production Setup

On your GitHub Pages site:

```javascript
// Browser console
import.meta.env.VUE_APP_VERCEL_API_URL
// Should show your proxy URL

import { getApiConfig } from './src/services/newsApi.js'
getApiConfig()
// Should show:
// - environment: PRODUCTION
// - usingProxy: true (if proxy configured)
// - hasApiKey: false (key hidden!)
```

## Common Issues

### "Failed to fetch" locally

**Cause:** `.env.local` not set up

**Fix:**
```bash
cp .env.local.example .env.local
# Edit and add your API key
# Restart dev server
```

### "Failed to fetch" on GitHub Pages

**Cause:** GitHub Secrets not set

**Fix:**
1. Check Settings → Secrets and variables → Actions
2. Verify `VUE_APP_NEWS_API_KEY` exists
3. If using proxy: Check `VUE_APP_VERCEL_API_URL` exists
4. Redeploy

### API key visible in browser on GitHub Pages

**Cause:** Proxy not configured

**Fix:** Set up proxy (see PROXY_SETUP_GUIDE.md)

### Proxy returns 401

**Cause:** Proxy can't find API key

**Fix:**
1. Check proxy environment has `NEWSAPI_KEY`
2. Verify `VUE_APP_NEWS_API_KEY` is set in GitHub Secrets
3. Redeploy proxy

## Next Steps

**Just developing locally?**
1. ✅ Copy `.env.local.example` to `.env.local`
2. ✅ Add your API key
3. ✅ Run `npm run serve`
4. Done! 🎉

**Want to deploy to GitHub Pages?**
1. ✅ For simple: Add `VUE_APP_NEWS_API_KEY` to GitHub Secrets
2. ⚠️ For secure: Read PROXY_SETUP_GUIDE.md and add both secrets
3. ✅ Push to main
4. Done! 🎉

## Security Best Practices

✅ **DO:**
- Store keys in environment variables
- Use `.env.local` for local development
- Use GitHub Secrets for production
- Keep `.env.local` out of git (use `.gitignore`)
- Use proxy for public sites
- Rotate keys periodically
- Monitor API usage

❌ **DON'T:**
- Hardcode API keys
- Commit `.env.local` to git
- Expose keys in public repos
- Use same key for dev/prod
- Log keys in console (production)
- Share keys with others

## Resources

- [NewsAPI Documentation](https://newsapi.org/docs)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-modes.html)
- [PROXY_SETUP_GUIDE.md](./PROXY_SETUP_GUIDE.md) - Complete proxy setup

## Questions?

Each environment file has detailed comments:
- `.env.local.example` - Local development
- `.env.production.example` - Production (what GitHub injects)
- `PROXY_SETUP_GUIDE.md` - How to set up proxy

Read the relevant file for your use case!
