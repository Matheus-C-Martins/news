# Environment Setup Guide

This guide explains how to properly configure the NewsHub application with API keys and environment variables.

## Problem Summary

Your app is experiencing these errors:
- ❌ **TypeError: Failed to fetch** - Network request failing
- ❌ **CORS error** - Preflight request failing  
- ❌ **API Key not accessible** - `VUE_APP_NEWS_API_KEY` undefined

These are all caused by **missing or incorrectly configured environment variables**.

## Solution

### Step 1: Get Your NewsAPI Key

1. Visit [https://newsapi.org](https://newsapi.org)
2. Click "Register" and create a free account
3. Copy your API key from the dashboard
4. Keep it **SECRET** - never commit to version control

### Step 2: Local Development Setup

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and paste your API key:
   ```env
   VUE_APP_NEWS_API_KEY=your_actual_api_key_here
   VUE_APP_VERCEL_API_URL=
   ```

3. **Never add** `.env.local` to git:
   - It's already in `.gitignore`
   - Committing secrets is a security risk

4. Restart your development server:
   ```bash
   npm run serve
   ```

### Step 3: GitHub Pages Deployment

1. Go to your GitHub repository **Settings** → **Secrets and variables** → **Actions**

2. Click "New repository secret" and add:
   - **Name:** `VUE_APP_NEWS_API_KEY`
   - **Value:** Your actual API key

3. Click "New repository secret" and add:
   - **Name:** `VUE_APP_VERCEL_API_URL`
   - **Value:** (leave empty for direct NewsAPI calls)

4. Your GitHub Actions workflow will automatically inject these secrets at build time

5. The workflow file (`.github/workflows/deploy.yml`) already has the correct configuration:
   ```yaml
   - name: Build
     env:
       VUE_APP_NEWS_API_KEY: ${{ secrets.VUE_APP_NEWS_API_KEY }}
       VUE_APP_VERCEL_API_URL: ${{ secrets.VUE_APP_VERCEL_API_URL }}
     run: npm run build
   ```

## Environment Variables Reference

### VUE_APP_NEWS_API_KEY (Required)
- **Description:** Your NewsAPI.org API key
- **Obtained from:** https://newsapi.org
- **Format:** String (40+ characters)
- **Security:** Store in `.env.local` locally and GitHub Secrets in production
- **Example:** `abc123def456ghi789jkl012mno345pqr678`

### VUE_APP_VERCEL_API_URL (Optional)
- **Description:** Backend API proxy URL (if using one)
- **Default:** Direct calls to `https://newsapi.org/v2`
- **Use case:** When you want to hide your API key behind a backend proxy
- **Example:** `https://my-backend.vercel.app/api`
- **Leave empty:** For development without a proxy

## How Environment Variables Are Used

### In Vue CLI Development
```javascript
// Variables with VUE_APP_ prefix are accessible in the browser
import.meta.env.VUE_APP_NEWS_API_KEY
```

### In `.env.local` (Development)
```env
VUE_APP_NEWS_API_KEY=dev_key_12345
VUE_APP_VERCEL_API_URL=
```

### In GitHub Secrets (Production/GitHub Pages)
1. Settings → Secrets and variables → Actions
2. Create `VUE_APP_NEWS_API_KEY` secret
3. GitHub Actions injects it as `env` variable during build
4. Vue CLI processes it and makes it available to the app

## Verification

### Check if API Key is Loaded

Open your browser's developer console and run:
```javascript
// This should NOT be empty if configured correctly
import.meta.env.VUE_APP_NEWS_API_KEY
```

### Debug API Requests

The updated `newsApi.js` includes debugging logs. Check the browser console:
```
✓ Using API proxy at: [URL]
Fetching top headlines: {url, headers}
Top headlines fetched successfully: 20 articles
```

Or error logs:
```
❌ Warning: VUE_APP_NEWS_API_KEY environment variable is not set
❌ Authentication failed: Invalid API key. Check your VUE_APP_NEWS_API_KEY environment variable.
```

## Troubleshooting

### Error: "Failed to fetch" or CORS Error

**Cause:** API key not set or empty

**Fix:**
1. Check `.env.local` exists and has your actual API key
2. Restart dev server: `npm run serve`
3. Verify in browser console: `import.meta.env.VUE_APP_NEWS_API_KEY`
4. Check server logs for build environment variables

### Error: "401 Unauthorized"

**Cause:** Invalid or expired API key

**Fix:**
1. Verify your API key at https://newsapi.org/account
2. Generate a new key if needed
3. Update `.env.local` and GitHub Secrets
4. Restart dev server

### Error: "Response to preflight request doesn't pass access control check"

**Cause:** CORS configuration or proxy issue

**Fix:**
1. Ensure CSP in `public/index.html` includes newsapi.org:
   ```html
   connect-src 'self' https://newsapi.org
   ```
2. Check if you're behind a corporate proxy (may need to configure)
3. Try using a CORS proxy option (optional backend)

### Error: "Rate limit exceeded (429)"

**Cause:** Too many requests (free tier: 500/day)

**Fix:**
1. Upgrade to a paid NewsAPI plan
2. Implement request caching in your app
3. Reduce number of API calls

## Best Practices

✅ **DO:**
- Store API keys in environment variables
- Use `.env.local` for local development
- Use GitHub Secrets for production
- Rotate keys periodically
- Keep `.env.local` out of git (via `.gitignore`)
- Log helpful error messages for debugging

❌ **DON'T:**
- Hardcode API keys in source code
- Commit `.env.local` to git
- Share API keys in public repositories
- Use same key for development and production
- Log sensitive data in production

## File Structure

```
project/
├── .env.example              ← Template (commit this)
├── .env.local                ← Your keys (never commit)
├── .env.production.local      ← Production keys (never commit)
├── .gitignore                ← Excludes .env.local
├── public/
│   └── index.html            ← CSP headers
├── .github/
│   └── workflows/
│       └── deploy.yml        ← GitHub Actions secrets
└── src/
    └── services/
        └── newsApi.js        ← API with error handling
```

## Next Steps

1. ✅ Set `.env.local` with your API key
2. ✅ Add GitHub Secrets to your repository
3. ✅ Restart development server
4. ✅ Test API calls in browser console
5. ✅ Push to GitHub and monitor Actions workflow
6. ✅ Check deployed site for errors

For more help:
- NewsAPI.org: https://newsapi.org/docs
- Vue Environment Variables: https://vitejs.dev/guide/env-and-modes.html
- GitHub Secrets: https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions
