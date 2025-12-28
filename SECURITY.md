# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in NewsHub, please email [your-email@example.com] with:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if applicable)

**Please do not open a public GitHub issue for security vulnerabilities.**

## Security Features

### Content Security Policy (CSP)
The application implements strict CSP to prevent XSS attacks:
- Scripts limited to same-origin only
- Styles limited to same-origin
- Images and media from HTTPS sources
- External API calls restricted to whitelisted domains only

### Security Headers
The following security headers are implemented in GitHub Pages deployment:

```
X-Content-Type-Options: nosniff          # Prevent MIME type sniffing
X-Frame-Options: DENY                     # Prevent clickjacking
X-XSS-Protection: 1; mode=block          # Enable browser XSS protection
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()  # Disable unnecessary APIs
Strict-Transport-Security: max-age=31536000; includeSubDomains  # Force HTTPS
```

### Input Validation
- All search queries are validated and sanitized
- Page numbers are validated to prevent API abuse
- Categories are whitelisted to prevent injection
- Maximum query length of 500 characters enforced

### API Security
- API keys are stored in GitHub Secrets (never in code)
- Only HTTPS connections to external APIs
- Error messages don't expose sensitive information
- Rate limiting handled by NewsAPI.org

### Data Storage
- Only non-sensitive data stored in localStorage (dark mode preference)
- No authentication tokens stored
- No personal information collected

## Environment Variables

Required environment variables (see `.env.example`):

```
VITE_NEWS_API_KEY=your_newsapi_key_here
```

**NEVER commit `.env.local` or actual API keys to version control.**

## Dependencies

Dependencies are kept minimal and regularly updated:

```bash
npm audit              # Check for vulnerabilities
npm update            # Update to latest versions
```

### Key Dependencies
- **Vue 3**: Frontend framework with built-in XSS protection
- **Vue Router**: Client-side routing
- **FontAwesome**: Icon library
- **SASS**: CSS preprocessor

## Best Practices

1. **Keep dependencies updated**: Run `npm update` regularly
2. **Check for vulnerabilities**: Use `npm audit` before deployment
3. **Review security headers**: Verify headers in browser DevTools
4. **Test CSP compliance**: Check console for CSP violations
5. **Validate all input**: Sanitize and validate user inputs

## GitHub Security Settings

Enable these features in repository settings:

- ✅ Dependabot alerts
- ✅ Dependabot security updates
- ✅ Secret scanning
- ✅ Branch protection rules (main branch)
- ✅ Require status checks before merging

## Future Improvements

- [ ] Backend API proxy for API key management
- [ ] HTTPS redirect enforcement
- [ ] Subresource Integrity (SRI) for CDN resources
- [ ] Regular security audits
- [ ] Penetration testing

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Application Security](https://web.dev/security/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [NewsAPI.org Security](https://newsapi.org/)

---

Last Updated: December 28, 2025