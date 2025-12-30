# 🚀 Deployment Guide

Complete guide for deploying NewsHub to various platforms with CI/CD automation.

## Table of Contents

- [GitHub Pages](#github-pages-recommended)
- [Vercel](#vercel)
- [Netlify](#netlify)
- [GitHub Actions](#github-actions)
- [Troubleshooting](#troubleshooting)

---

## GitHub Pages (Recommended)

### Prerequisites

- GitHub repository
- NewsAPI.org API key
- GitHub Actions enabled

### Setup Steps

#### 1. Configure GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

**Add these secrets:**

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `VITE_NEWS_API_KEY` | Your NewsAPI key | Required for API calls |
| `VITE_VERCEL_API_URL` | Proxy URL (optional) | Leave empty for direct API calls |

#### 2. Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the changes

#### 3. Configure Base URL (if needed)

If your repo name is NOT `news`, update `vite.config.js`:

```javascript
export default defineConfig({
  base: '/your-repo-name/',  // Change this
  // ...
})
```

#### 4. Deploy

```bash
git add .
git commit -m "feat: configure for GitHub Pages"
git push origin main
```

GitHub Actions will automatically:
- ✅ Build your app
- ✅ Run security audits
- ✅ Deploy to GitHub Pages

**Your site will be live at:**
```
https://your-username.github.io/news/
```

### GitHub Actions Workflow

The repository includes a pre-configured workflow:

**File:** `.github/workflows/deploy.yml`

**Features:**
- Automatic deployment on push to `main`
- Node.js 20 with npm caching
- Dependency caching for faster builds
- Security audit before deployment
- Environment variable validation
- Build verification

### Manual Deployment

Trigger deployment manually:

1. Go to **Actions** tab
2. Select **Deploy to GitHub Pages**
3. Click **Run workflow**
4. Select branch → **Run workflow**

---

## Vercel

### Automatic Deployment

#### 1. Import Project

1. Visit [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Vercel auto-detects Vite configuration

#### 2. Configure Environment Variables

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add:
   - `VITE_NEWS_API_KEY` → Your NewsAPI key
   - `VITE_VERCEL_API_URL` → (optional)

#### 3. Deploy

Click **Deploy** - Vercel will:
- ✅ Build your project
- ✅ Deploy to CDN
- ✅ Provide preview URLs
- ✅ Auto-deploy on git push

**Your site will be live at:**
```
https://your-app.vercel.app
```

### Vercel CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

### Vercel Configuration

**File:** `vercel.json` (optional)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_NEWS_API_KEY": "@news-api-key"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## Netlify

### Automatic Deployment

#### 1. Connect Repository

1. Visit [netlify.com](https://netlify.com)
2. Click **Add new site** → **Import existing project**
3. Connect GitHub and select your repository

#### 2. Configure Build Settings

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Branch:** `main`

#### 3. Add Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Add:
   - `VITE_NEWS_API_KEY` → Your NewsAPI key
   - `VITE_VERCEL_API_URL` → (optional)

#### 4. Deploy

Click **Deploy site** - Netlify will:
- ✅ Build and deploy
- ✅ Provide custom domain
- ✅ Auto-deploy on git push
- ✅ Deploy previews for PRs

### Netlify Configuration

**File:** `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Netlify CLI Deployment

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

---

## GitHub Actions

### Workflows

The repository includes two workflows:

#### 1. Deploy to GitHub Pages

**File:** `.github/workflows/deploy.yml`

**Trigger:** Push to `main` branch or manual dispatch

**Steps:**
1. Checkout code
2. Setup Node.js 20 with caching
3. Install dependencies
4. Run security audit
5. Validate environment variables
6. Build project
7. Deploy to GitHub Pages

#### 2. PR Validation

**File:** `.github/workflows/pr-validation.yml`

**Trigger:** Pull requests to `main` or `develop`

**Steps:**
1. Checkout code
2. Setup Node.js with caching
3. Install dependencies
4. Run ESLint
5. Run security audit
6. Build verification
7. Generate PR summary

### Workflow Customization

#### Add Testing

```yaml
- name: Run Tests
  run: npm test

- name: Run E2E Tests
  run: npm run test:e2e
```

#### Add Lighthouse CI

```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://your-app.github.io/news/
    uploadArtifacts: true
```

#### Add Deployment Preview

```yaml
- name: Deploy Preview
  if: github.event_name == 'pull_request'
  uses: nwtgck/actions-netlify@v2.0
  with:
    publish-dir: './dist'
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Monitoring Workflows

**View Runs:**
1. Go to **Actions** tab
2. Select a workflow
3. Click on specific run
4. View logs and artifacts

**Status Badge:**

Add to README.md:

```markdown
![Deploy](https://github.com/Matheus-C-Martins/news/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)
```

---

## Dependabot

The repository includes Dependabot configuration for automatic dependency updates.

**File:** `.github/dependabot.yml`

**Features:**
- 📦 npm dependencies - Weekly updates
- 🔧 GitHub Actions - Weekly updates
- 🏷️ Automatic labeling
- 📝 Semantic commit messages
- 👤 Auto-assign reviewers

---

## Troubleshooting

### Deployment Fails with "Secret not set"

**Solution:**
1. Check GitHub Secrets are configured
2. Verify secret names match exactly
3. Re-add secrets if needed
4. Trigger new deployment

### Build Succeeds but Site Shows Errors

**Solution:**
1. Check browser console for errors
2. Verify API key is working at [NewsAPI Dashboard](https://newsapi.org/account)
3. Check CSP configuration in `index.html`
4. Verify base URL in `vite.config.js`

### GitHub Pages Not Updating

**Solution:**
1. Check workflow completed successfully
2. Verify GitHub Pages is enabled
3. Clear browser cache (Ctrl+Shift+R)
4. Wait 1-2 minutes for DNS propagation

### Environment Variables Not Working

**Solution:**
1. Verify variable names use `VITE_` prefix
2. Check they're set in platform dashboard
3. Rebuild and redeploy
4. Check build logs for errors

### Performance Issues

**Solutions:**
- Enable caching headers
- Optimize images
- Use lazy loading
- Implement service worker
- Enable compression (gzip/brotli)

---

## Performance Optimization

### Caching Headers

Add to your hosting platform:

```
Cache-Control: public, max-age=31536000, immutable  # For assets
Cache-Control: public, max-age=0, must-revalidate   # For HTML
```

### Compression

Most platforms enable automatically:
- ✅ Vercel - gzip/brotli enabled
- ✅ Netlify - gzip/brotli enabled
- ✅ GitHub Pages - gzip enabled

### CDN

All platforms use CDN by default:
- Vercel - Edge Network
- Netlify - Global CDN
- GitHub Pages - Fastly CDN

---

## Security Headers

### Recommended Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Implementation

**Vercel:** Add to `vercel.json` (see above)
**Netlify:** Add to `netlify.toml` (see above)
**GitHub Pages:** Add meta tags to `index.html` (CSP only)

---

## Cost Comparison

| Platform | Free Tier | Bandwidth | Build Minutes | Custom Domain |
|----------|-----------|-----------|---------------|---------------|
| **GitHub Pages** | ✅ Yes | 100GB/month | Unlimited | ✅ Yes |
| **Vercel** | ✅ Yes | 100GB/month | 6000 min/month | ✅ Yes |
| **Netlify** | ✅ Yes | 100GB/month | 300 min/month | ✅ Yes |

---

## Next Steps

- 📊 Set up analytics (Plausible, Fathom)
- 🔍 Add Lighthouse CI for performance monitoring
- 🐛 Integrate error tracking (Sentry)
- 📈 Monitor usage and costs
- 🔐 Review security headers

---

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Need help?** [Open an issue](https://github.com/Matheus-C-Martins/news/issues)

**Made with ❤️ by [Matheus Martins](https://github.com/Matheus-C-Martins)**