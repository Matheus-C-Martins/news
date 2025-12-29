# Proxy Setup Guide for GitHub Pages Deployment

This guide explains how to set up a backend proxy service to hide your NewsAPI key when deploying to GitHub Pages.

## Architecture Overview

### Local Development (Direct API Calls)
```
Your Browser
    ↓ (includes API key)
https://newsapi.org/v2/top-headlines
    ↓
NewsAPI responds with articles
```
**Configuration:** `.env.local` with `VUE_APP_NEWS_API_KEY`

### GitHub Pages Production (Proxied API Calls)
```
Your Browser (on GitHub Pages)
    ↓ (NO API key)
https://your-backend.vercel.app/api?endpoint=top-headlines&...
    ↓ (backend adds API key)
https://newsapi.org/v2/top-headlines?apiKey=YOUR_KEY&...
    ↓
NewsAPI responds to your backend
    ↓ (backend forwards response)
Your Browser receives articles
```
**Configuration:** GitHub Secrets with both `VUE_APP_NEWS_API_KEY` and `VUE_APP_VERCEL_API_URL`

## Why Use a Proxy?

✅ **Security Benefits:**
- Your API key is never exposed to the browser
- API key is stored only on your backend server
- Browser can never leak or steal your key
- Protects against rate limit abuse

✅ **Request Control:**
- Add rate limiting per user
- Log and monitor API usage
- Add caching to reduce API calls
- Protect against malicious requests

## Step 1: Create Your Backend Proxy

You have several options. Here's the easiest using Vercel:

### Option A: Vercel (Recommended for GitHub Pages)

#### 1.1 Create a Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub (recommended)
- Authorize Vercel to access your repositories

#### 1.2 Create Backend API Project

Create a new directory and `vercel.json` for your proxy:

```bash
mkdir news-api-proxy
cd news-api-proxy
```

**Option A1: Node.js/Express Proxy**

Create `api/proxy.js`:

```javascript
// api/proxy.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { endpoint, ...params } = req.query
    
    if (!endpoint) {
      return res.status(400).json({ error: 'Missing endpoint parameter' })
    }

    // Build query string from params
    const queryString = new URLSearchParams()
    queryString.append('apiKey', process.env.NEWSAPI_KEY)
    Object.entries(params).forEach(([key, value]) => {
      queryString.append(key, value)
    })

    // Call NewsAPI
    const response = await fetch(
      `https://newsapi.org/v2/${endpoint}?${queryString}`,
      { headers: { 'User-Agent': 'NewsHub-Proxy/1.0' } }
    )

    const data = await response.json()
    
    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    res.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

Create `vercel.json`:

```json
{
  "buildCommand": "echo 'No build needed'",
  "functions": {
    "api/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

**Option A2: Python/Flask Proxy**

Create `api/proxy.py`:

```python
import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

NEWSAPI_KEY = os.environ.get('NEWSAPI_KEY')

@app.route('/api', methods=['GET', 'OPTIONS'])
def proxy_news():
    if request.method == 'OPTIONS':
        return '', 204
    
    endpoint = request.args.get('endpoint')
    if not endpoint:
        return jsonify({'error': 'Missing endpoint'}), 400
    
    # Get all query params except 'endpoint'
    params = {k: v for k, v in request.args.items() if k != 'endpoint'}
    params['apiKey'] = NEWSAPI_KEY
    
    try:
        response = requests.get(
            f'https://newsapi.org/v2/{endpoint}',
            params=params,
            headers={'User-Agent': 'NewsHub-Proxy/1.0'}
        )
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
```

Create `requirements.txt`:

```
Flask==2.3.0
flask-cors==4.0.0
requests==2.31.0
```

#### 1.3 Deploy to Vercel

```bash
# Initialize git repo
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/your-username/news-api-proxy.git
git branch -M main
git push -u origin main
```

Then on Vercel:
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your `news-api-proxy` repository
3. Configure environment variables:
   - Name: `NEWSAPI_KEY`
   - Value: Your NewsAPI key
4. Deploy!

Your proxy URL will be: `https://news-api-proxy.vercel.app/api`

### Option B: Railway.app

1. Go to [railway.app](https://railway.app)
2. Click "Start New Project" → "Deploy from GitHub"
3. Select your proxy repository
4. Add environment variable: `NEWSAPI_KEY`
5. Deploy

Your proxy URL will be: `https://your-project.railway.app/api`

### Option C: Heroku (Free tier deprecated, but still available)

1. Create `Procfile`:
   ```
   web: node api/proxy.js
   ```

2. Deploy to Heroku:
   ```bash
   heroku login
   heroku create your-app-name
   heroku config:set NEWSAPI_KEY=your_actual_key
   git push heroku main
   ```

## Step 2: Configure Your NewsHub App

### 2.1 Local Development (No Proxy)

Create `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
VUE_APP_NEWS_API_KEY=your_newsapi_key_here
VUE_APP_VERCEL_API_URL=
```

Then:
```bash
npm run serve
```

Your app will:
- Use direct API calls to NewsAPI
- Include your API key in requests
- Work perfectly locally ✅

### 2.2 GitHub Pages (With Proxy)

1. Go to your NewsHub repository on GitHub
2. Settings → Secrets and variables → Actions
3. Add two secrets:

   **Secret 1:**
   - Name: `VUE_APP_NEWS_API_KEY`
   - Value: Your NewsAPI key

   **Secret 2:**
   - Name: `VUE_APP_VERCEL_API_URL`
   - Value: Your proxy URL (e.g., `https://news-api-proxy.vercel.app/api`)

4. Push to main branch → GitHub Actions will:
   - Read these secrets
   - Inject them during build
   - Deploy to GitHub Pages

Your app will:
- Use proxied API calls through your backend
- Never expose your API key
- Be fully protected in production ✅

## Step 3: Verify Configuration

### Local Development

Open browser console and run:

```javascript
// Should show your API key (from .env.local)
import.meta.env.VUE_APP_NEWS_API_KEY

// Should be empty (no proxy locally)
import.meta.env.VUE_APP_VERCEL_API_URL

// Check API config
import { getApiConfig } from './src/services/newsApi.js'
getApiConfig()
```

Should output:
```javascript
{
  environment: 'DEVELOPMENT',
  usingProxy: false,
  baseUrl: 'https://newsapi.org/v2',
  hasApiKey: true,
  ...
}
```

### GitHub Pages

On your deployed site, open console and run:

```javascript
// Should be empty (hidden by proxy)
import.meta.env.VUE_APP_NEWS_API_KEY

// Should show your proxy URL
import.meta.env.VUE_APP_VERCEL_API_URL

// Check API config
import { getApiConfig } from './src/services/newsApi.js'
getApiConfig()
```

Should output:
```javascript
{
  environment: 'PRODUCTION',
  usingProxy: true,
  baseUrl: 'https://news-api-proxy.vercel.app/api',
  hasApiKey: false,  // Hidden!
  ...
}
```

## Step 4: Test Both Environments

### Test Locally

```bash
npm run serve
# Visit http://localhost:5173
# Should load articles using direct API
```

### Test Production

```bash
npm run build
npm run preview
# Visit http://localhost:4173
# Should load articles using proxy
```

Or just check your GitHub Pages deployment:
- https://your-username.github.io/news
- Should load articles using proxy

## Troubleshooting

### "Failed to fetch" on GitHub Pages

**Problem:** API calls failing after deployment

**Solutions:**
1. Check GitHub Secrets are set:
   - Both `VUE_APP_NEWS_API_KEY` and `VUE_APP_VERCEL_API_URL`
2. Verify proxy URL is correct:
   ```bash
   curl "https://your-proxy.vercel.app/api?endpoint=top-headlines&language=en"
   ```
3. Check workflow logs:
   - Actions tab → Latest workflow → Check build logs

### Proxy returns 401

**Problem:** "Authentication failed" from proxy

**Solution:**
1. Verify `NEWSAPI_KEY` is set in your proxy's environment
2. Test proxy directly:
   ```bash
   curl "https://your-proxy.vercel.app/api?endpoint=top-headlines&apiKey=YOUR_KEY&language=en"
   ```

### CORS errors on GitHub Pages

**Problem:** "Access to fetch blocked by CORS"

**Solution:**
1. Ensure your proxy has CORS headers:
   ```javascript
   res.setHeader('Access-Control-Allow-Origin', '*')
   res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
   ```
2. Verify CSP in `public/index.html` allows proxy:
   ```html
   connect-src 'self' https://your-proxy.vercel.app
   ```

### API key still exposed

**Problem:** Browser console shows API key on GitHub Pages

**Solution:**
1. Make sure `VUE_APP_VERCEL_API_URL` is set in GitHub Secrets
2. Check workflow file uses it:
   ```yaml
   VUE_APP_VERCEL_API_URL: ${{ secrets.VUE_APP_VERCEL_API_URL }}
   ```
3. Rebuild and redeploy

## Monitoring & Optimization

### Monitor Proxy Usage

- **Vercel:** Analytics → Functions
- **Railway:** Resources → Metrics
- **Heroku:** Resources → Dyno metrics

### Optimize Proxy Performance

1. **Add Caching:**
   ```javascript
   res.setHeader('Cache-Control', 'public, max-age=300') // 5 min cache
   ```

2. **Add Rate Limiting:**
   - Limit requests per IP
   - Prevent abuse
   - Vercel has built-in rate limiting

3. **Log Requests:**
   - Monitor API usage
   - Detect suspicious activity
   - Track performance

## Security Checklist

- [ ] API key stored in proxy environment variables
- [ ] API key NOT in any config files
- [ ] API key NOT in GitHub repository
- [ ] CORS enabled on proxy
- [ ] CSP allows proxy domain
- [ ] Proxy validates requests
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Firewall rules in place

## Next Steps

1. ✅ Create backend proxy (Vercel recommended)
2. ✅ Get proxy URL
3. ✅ Add GitHub Secrets:
   - `VUE_APP_NEWS_API_KEY`
   - `VUE_APP_VERCEL_API_URL`
4. ✅ Test locally: `npm run serve`
5. ✅ Test production: `npm run build && npm run preview`
6. ✅ Deploy to GitHub Pages
7. ✅ Verify console shows proxy config
8. ✅ Monitor proxy usage

## References

- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Railway Deployment](https://docs.railway.app/deploy/builds)
- [Heroku Deployment](https://devcenter.heroku.com/articles/git)
- [NewsAPI Documentation](https://newsapi.org/docs)
- [CORS Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
