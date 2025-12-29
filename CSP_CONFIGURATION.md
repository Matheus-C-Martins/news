# Content Security Policy (CSP) Configuration

## Overview

This application uses Content Security Policy (CSP) to protect against Cross-Site Scripting (XSS) and other code injection attacks.

## Important: CSP Configuration Locations

### For Production (GitHub Pages)

**File:** `public/index.html`

```html
<meta http-equiv="Content-Security-Policy" content="...">
```

This CSP is **embedded in the HTML** and applies to the production build deployed to GitHub Pages.

### For Development (Local Server)

**File:** `vue.config.js`

```javascript
devServer: {
  headers: {
    'Content-Security-Policy': '...'
  }
}
```

This CSP is sent as an **HTTP header** by the Vue CLI dev server and only applies during `npm run serve`.

---

## Current CSP Configuration

### Allowed Connections (connect-src)

The app is currently configured to allow connections to:

1. **`'self'`** - Same origin (your GitHub Pages domain)
2. **`https://newsapi.org`** - Direct NewsAPI calls (fallback)
3. **`https://*.vercel.app`** - All Vercel deployments (your proxy)
4. **`https://api.github.com`** - GitHub API

### Why Wildcard for Vercel?

We use `https://*.vercel.app` instead of a specific URL because:

✅ **Supports multiple deployments**
- Production: `https://your-app.vercel.app`
- Preview branches: `https://your-app-branch.vercel.app`
- Development: `https://your-app-user.vercel.app`

✅ **No updates needed** when you:
- Deploy to different Vercel projects
- Use preview deployments
- Change your Vercel project name

---

## How to Update CSP

### Scenario 1: Adding a New API Domain

If you add a new API endpoint (e.g., `https://api.example.com`):

**Step 1:** Update `public/index.html`
```html
connect-src 'self' https://newsapi.org https://*.vercel.app https://api.github.com https://api.example.com
```

**Step 2:** Update `vue.config.js` (for dev server)
```javascript
"connect-src 'self' https://newsapi.org https://*.vercel.app https://api.github.com https://api.example.com"
```

**Step 3:** Rebuild and redeploy
```bash
npm run build
git add .
git commit -m "feat: add api.example.com to CSP"
git push
```

### Scenario 2: Using a Custom Domain for Vercel

If you switch from `*.vercel.app` to a custom domain (e.g., `api.yourdomain.com`):

**Option A: Replace wildcard** (more restrictive)
```html
connect-src 'self' https://newsapi.org https://api.yourdomain.com https://api.github.com
```

**Option B: Add both** (more flexible)
```html
connect-src 'self' https://newsapi.org https://*.vercel.app https://api.yourdomain.com https://api.github.com
```

### Scenario 3: Using Specific Vercel URL

If you want to restrict to a specific Vercel URL:

```html
connect-src 'self' https://newsapi.org https://news-mu-lemon.vercel.app https://api.github.com
```

⚠️ **Warning**: This breaks preview deployments and requires updates when changing project names.

---

## Troubleshooting CSP Errors

### Error: "violates the following Content Security Policy directive"

**Example:**
```
Refused to connect to 'https://example.com' because it violates 
the following Content Security Policy directive: "connect-src 'self' ..."
```

**Solution:**
1. Identify the blocked domain from the error message
2. Add it to the `connect-src` directive in **both** files:
   - `public/index.html` (production)
   - `vue.config.js` (development)
3. Rebuild: `npm run build`
4. Test locally: `npm run serve`
5. Deploy

### Testing CSP Changes

#### Local Development
```bash
npm run serve
# Open browser console (F12)
# Check for CSP errors
```

#### Production Build
```bash
npm run build
npx serve -s dist
# Open http://localhost:3000 (or shown port)
# Check browser console for CSP errors
```

---

## CSP Directives Explained

| Directive | Purpose | Current Value |
|-----------|---------|---------------|
| `default-src` | Fallback for other directives | `'self'` |
| `script-src` | JavaScript sources | `'self' 'wasm-unsafe-eval'` |
| `style-src` | CSS sources | `'self' 'unsafe-inline' https://fonts.googleapis.com` |
| `img-src` | Image sources | `'self' https: data:` |
| `connect-src` | AJAX/Fetch/WebSocket | `'self' https://newsapi.org https://*.vercel.app https://api.github.com` |
| `font-src` | Font sources | `'self' data: https://fonts.gstatic.com` |
| `frame-ancestors` | Embedding in iframes | `'none'` (prevents clickjacking) |
| `base-uri` | Base tag restrictions | `'self'` |
| `form-action` | Form submission targets | `'self'` |

---

## Security Best Practices

### ✅ DO

- **Use specific domains** when possible
- **Keep wildcards minimal** (only when necessary)
- **Test after changes** in both dev and production
- **Document changes** in commit messages
- **Review CSP regularly** (remove unused domains)

### ❌ DON'T

- **Don't use `'unsafe-inline'`** for scripts (only for styles when needed)
- **Don't use `*` wildcard** for everything
- **Don't disable CSP** (it's a critical security layer)
- **Don't forget to update both files** (index.html + vue.config.js)

---

## GitHub Pages Limitations

GitHub Pages **does not support** custom HTTP headers via `_headers` file.

Therefore, we **must** use:
- Meta tags in `public/index.html` for production
- devServer headers in `vue.config.js` for development

If you migrate to Netlify, Vercel, or Cloudflare Pages, you can use:
- `_headers` file (Netlify, Cloudflare)
- `vercel.json` (Vercel)
- Server configuration (Apache, Nginx)

---

## Quick Reference

### Current Vercel URL
```
https://news-mu-lemon.vercel.app
```

### CSP covers all Vercel deployments
```
https://*.vercel.app
```

### Update Checklist

When adding a new API endpoint:

- [ ] Update `public/index.html` `connect-src`
- [ ] Update `vue.config.js` `connect-src`
- [ ] Test with `npm run serve`
- [ ] Build with `npm run build`
- [ ] Test build with `npx serve -s dist`
- [ ] Commit and push
- [ ] Verify in production

---

## Resources

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [CSP Validator](https://cspvalidator.org/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

---

**Last Updated:** December 29, 2024  
**Related Issue:** CSP blocking Vercel proxy connections  
**Related PR:** Fix CSP Vercel URL