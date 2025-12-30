# ⚙️ Configuration Guide

Complete guide for configuring NewsHub with environment variables, CSP, and proxy setup.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Content Security Policy (CSP)](#content-security-policy-csp)
- [Proxy Setup](#proxy-setup)
- [Language Configuration](#language-configuration)

---

## Environment Variables

### Overview

NewsHub uses Vite's environment variable system. Variables prefixed with `VITE_` are exposed to the browser.

### Required Variables

#### `VITE_NEWS_API_KEY` (Required)

- **Description:** Your NewsAPI.org API key
- **Obtained from:** [https://newsapi.org/register](https://newsapi.org/register)
- **Format:** String (40+ characters)
- **Security:** Store in `.env.local` locally, GitHub Secrets in production
- **Example:** `abc123def456ghi789jkl012mno345pqr678`

### Optional Variables

#### `VITE_VERCEL_API_URL` (Optional)

- **Description:** Backend API proxy URL
- **Default:** Direct calls to `https://newsapi.org/v2`
- **Use case:** Hide API key behind a backend proxy
- **Example:** `https://my-backend.vercel.app/api`
- **Leave empty:** For development without a proxy

### Configuration Files

#### `.env.example` (Template - Commit to Git)

```env
# NewsAPI.org API Key (required)
# Get yours at: https://newsapi.org/register
VITE_NEWS_API_KEY=your_api_key_here

# Optional: Backend proxy URL
VITE_VERCEL_API_URL=
```

#### `.env.local` (Development - Never Commit)

```env
VITE_NEWS_API_KEY=your_actual_api_key_12345
VITE_VERCEL_API_URL=
```

#### `.env.production` (Production - Never Commit)

```env
VITE_NEWS_API_KEY=${VITE_NEWS_API_KEY}
VITE_VERCEL_API_URL=${VITE_VERCEL_API_URL}
```

### Environment Setup by Environment

| Environment | File | Source |
|-------------|------|--------|
| **Development** | `.env.local` | Manual setup |
| **Production (GitHub Pages)** | - | GitHub Secrets |
| **Vercel** | - | Vercel Environment Variables |
| **Netlify** | - | Netlify Environment Variables |

---

## Content Security Policy (CSP)

### What is CSP?

Content Security Policy protects against XSS and code injection attacks by controlling which resources can be loaded.

### Configuration Locations

#### Production (GitHub Pages)

**File:** `index.html`

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'wasm-unsafe-eval'; 
               connect-src 'self' https://newsapi.org https://*.vercel.app;">
```

#### Development (Local Server)

**File:** `vite.config.js`

```javascript
export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy': "..."
    }
  }
})
```

### Current CSP Configuration

| Directive | Purpose | Value |
|-----------|---------|-------|
| `default-src` | Fallback | `'self'` |
| `script-src` | JavaScript | `'self' 'wasm-unsafe-eval'` |
| `style-src` | CSS | `'self' 'unsafe-inline' https://fonts.googleapis.com` |
| `img-src` | Images | `'self' https: data:` |
| `connect-src` | API calls | `'self' https://newsapi.org https://*.vercel.app` |
| `font-src` | Fonts | `'self' data: https://fonts.gstatic.com` |
| `frame-ancestors` | Embedding | `'none'` (prevents clickjacking) |

### Adding New API Domains

If you need to connect to a new API:

1. **Update `index.html`:**
   ```html
   connect-src 'self' https://newsapi.org https://*.vercel.app https://api.example.com
   ```

2. **Update `vite.config.js`:**
   ```javascript
   'Content-Security-Policy': "... connect-src 'self' ... https://api.example.com"
   ```

3. **Test locally:**
   ```bash
   npm run dev
   ```

4. **Build and deploy:**
   ```bash
   npm run build
   git add .
   git commit -m "feat: add api.example.com to CSP"
   git push
   ```

### Troubleshooting CSP Errors

#### Error: "violates the following Content Security Policy directive"

**Solution:**
1. Open browser console (F12)
2. Identify the blocked resource from error message
3. Add the domain to `connect-src` in both files
4. Restart dev server
5. Rebuild and redeploy

#### Testing CSP Changes

```bash
# Development
npm run dev

# Production build
npm run build
npx serve -s dist
```

Check browser console for CSP violations.

---

## Proxy Setup

### Why Use a Proxy?

**Benefits:**
- ✅ Hide API key from client
- ✅ Rate limiting control
- ✅ Request caching
- ✅ Additional data processing
- ✅ CORS handling

**Drawbacks:**
- ❌ Additional infrastructure
- ❌ Extra latency
- ❌ Maintenance overhead

### Option 1: Vercel Serverless Function (Recommended)

#### 1. Create Vercel Project

```bash
# Create api folder
mkdir -p api
```

#### 2. Create API Handler

**File:** `api/news.js`

```javascript
export default async function handler(req, res) {
  const { endpoint, ...params } = req.query;
  
  const apiKey = process.env.NEWS_API_KEY;
  const baseURL = 'https://newsapi.org/v2';
  
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${baseURL}/${endpoint}?${queryString}&apiKey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
```

#### 3. Configure Vercel

**File:** `vercel.json`

```json
{
  "env": {
    "NEWS_API_KEY": "@news-api-key"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, OPTIONS" }
      ]
    }
  ]
}
```

#### 4. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

#### 5. Update Environment Variable

```env
VITE_VERCEL_API_URL=https://your-app.vercel.app/api
```

### Option 2: Netlify Function

#### 1. Create Function

**File:** `netlify/functions/news.js`

```javascript
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { endpoint, ...params } = event.queryStringParameters;
  const apiKey = process.env.NEWS_API_KEY;
  
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `https://newsapi.org/v2/${endpoint}?${queryString}&apiKey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch news' })
    };
  }
};
```

#### 2. Configure Netlify

**File:** `netlify.toml`

```toml
[build]
  functions = "netlify/functions"

[[headers]]
  for = "/.netlify/functions/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

---

## Language Configuration

### Supported Languages

NewsAPI supports filtering by language:

- `en` - English (default)
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `zh` - Chinese

### Usage

```javascript
import { fetchTopHeadlines } from './services/newsApi';

const articles = await fetchTopHeadlines({
  language: 'pt',
  page: 1,
  pageSize: 20
});
```

---

## Security Best Practices

### ✅ DO

- Store API keys in environment variables
- Use `.env.local` for local development
- Use GitHub Secrets for production
- Rotate keys periodically
- Keep `.env.local` out of git
- Log helpful error messages
- Use CSP to prevent XSS
- Validate all user inputs

### ❌ DON'T

- Hardcode API keys in source code
- Commit `.env.local` to git
- Share API keys in public repositories
- Use same key for dev and production
- Log sensitive data in production
- Disable CSP
- Use `'unsafe-eval'` in production

---

## Troubleshooting

### Environment Variables Not Loading

```bash
# Check if file exists
ls -la .env.local

# Restart dev server
npm run dev

# Verify in browser console
console.log(import.meta.env.VITE_NEWS_API_KEY)
```

### CSP Blocking Resources

1. Open browser console (F12)
2. Look for CSP violation errors
3. Add blocked domain to CSP
4. Restart and test

### Proxy Not Working

1. Check proxy URL is correct
2. Verify API key is set on proxy server
3. Test proxy endpoint directly
4. Check CORS headers

---

## Next Steps

- 🚀 [Deploy Your App](./deployment.md)
- 🤝 [Contributing Guidelines](../CONTRIBUTING.md)
- 🔒 [Security Policy](../SECURITY.md)

---

**Need help?** [Open an issue](https://github.com/Matheus-C-Martins/news/issues)