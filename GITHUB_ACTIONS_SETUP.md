# GitHub Actions Setup Guide

## Overview

This repository uses GitHub Actions for CI/CD automation. This guide explains the workflows and required configuration.

## Workflows

### 1. Deploy to GitHub Pages (`deploy.yml`)

**Trigger:** Push to `main` branch or manual dispatch

**Features:**
- ✅ Automated deployment to GitHub Pages
- ✅ Node.js 20 with npm caching
- ✅ Dependency caching for faster builds
- ✅ Security audit before deployment
- ✅ Environment variable validation
- ✅ Build verification
- ✅ Deployment summary

**Required Secrets:**
- `VUE_APP_NEWS_API_KEY` - Your NewsAPI.org API key
- `VUE_APP_VERCEL_API_URL` - Your Vercel proxy API URL

### 2. PR Validation (`pr-validation.yml`)

**Trigger:** Pull requests to `main` or `develop` branches

**Features:**
- ✅ ESLint code quality checks
- ✅ Security audit
- ✅ Build verification
- ✅ Dependency status check
- ✅ PR summary report

## Setting Up GitHub Secrets

### Step 1: Navigate to Repository Settings

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**

### Step 2: Add Required Secrets

#### `VUE_APP_NEWS_API_KEY`
1. Click **New repository secret**
2. Name: `VUE_APP_NEWS_API_KEY`
3. Value: Your NewsAPI.org API key
4. Click **Add secret**

#### `VUE_APP_VERCEL_API_URL`
1. Click **New repository secret**
2. Name: `VUE_APP_VERCEL_API_URL`
3. Value: Your Vercel proxy URL (e.g., `https://your-app.vercel.app/api`)
4. Click **Add secret**

## Enabling GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the changes

## Dependabot Configuration

The repository includes Dependabot configuration for:
- **npm dependencies** - Weekly updates on Monday
- **GitHub Actions** - Weekly updates on Monday

Dependabot will automatically:
- Create PRs for dependency updates
- Request review from repository owner
- Add appropriate labels
- Use semantic commit messages

## Best Practices

### Branch Protection Rules (Recommended)

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (at least 1)
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators

### Workflow Optimization

**Caching Strategy:**
- npm cache is automatically managed by `actions/setup-node`
- Additional node_modules caching for faster installs
- Cache keys based on package-lock.json hash

**Security:**
- Secrets are never logged or exposed
- Security audits run on every build
- Environment validation prevents deployment with missing secrets

### Monitoring Workflows

**View Workflow Runs:**
1. Go to **Actions** tab
2. Click on a workflow to see runs
3. Click on a specific run to see logs

**Debugging Failed Runs:**
1. Check the failed step in workflow logs
2. Verify secrets are correctly set
3. Ensure environment variables are properly configured
4. Check for dependency or build errors

## Troubleshooting

### Deployment Fails with "Secret not set" Error

**Solution:** Add the missing secret in repository settings (see Step 2 above)

### Build Fails with Module Errors

**Solution:**
```bash
npm run clean  # Cleans and reinstalls dependencies
```

### GitHub Pages Not Updating

**Solution:**
1. Check workflow run completed successfully
2. Verify GitHub Pages is enabled and set to "GitHub Actions"
3. Wait 1-2 minutes for DNS propagation
4. Clear browser cache

### Security Audit Failures

**Solution:**
```bash
npm audit fix  # Fix automatically
npm audit      # Review vulnerabilities
```

## Manual Deployment

You can manually trigger deployment:

1. Go to **Actions** tab
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## Environment Variables Reference

### Build-time Variables

| Variable | Purpose | Required | Example |
|----------|---------|----------|----------|
| `VUE_APP_NEWS_API_KEY` | NewsAPI.org API key | Yes | `abc123...` |
| `VUE_APP_VERCEL_API_URL` | Vercel proxy URL | Yes | `https://app.vercel.app/api` |
| `NODE_ENV` | Build environment | Auto | `production` |

### Notes

- Variables must use `VUE_APP_` prefix for Vue CLI
- Secrets are encrypted and secure
- Never commit secrets to the repository
- Use `.env.example` files as templates

## CI/CD Pipeline Flow

```
┌─────────────────┐
│   Push to main  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Checkout Code  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Setup Node    │
│   Cache deps    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Install deps    │
│ Security audit  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Validate env    │
│  variables      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Build project  │
│ Verify output   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Upload artifact │
│ Deploy to Pages │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ✅ Deployment   │
│    Complete     │
└─────────────────┘
```

## Contributing

When contributing:
1. Create a feature branch
2. Make your changes
3. Ensure PR validation passes
4. Request review
5. Merge after approval

## Support

For issues or questions:
- Check workflow logs in Actions tab
- Review this documentation
- Open an issue in the repository