# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-12-28

### Added
- 🔐 **Security Enhancements**
  - Content Security Policy (CSP) headers in HTML
  - Input validation and sanitization for all user inputs
  - Security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
  - Permissions-Policy to disable unnecessary browser APIs
  - SECURITY.md with vulnerability reporting guidelines
  - `.env.example` for environment variable documentation
  - GitHub Actions workflow updated with security headers

### Changed
- 🔁 **Refactored API Integration**
  - Removed deprecated `newsService.js` (which expected backend proxy)
  - Updated `home.vue` to use `newsApi.js` for direct API calls
  - Improved error handling in news fetching
  - Better input validation in `newsApi.js`

- 🏗️ **Project Structure Improvements**
  - Reorganized router with cleaner imports and consistent naming
  - Removed unused `sidebar.vue` component
  - Updated component naming for clarity (e.g., `shows.vue` → `entertainment.vue`)
  - Improved code organization and consistency

- 📋 **Documentation Updates**
  - Updated README.md with current project structure
  - Fixed environment variable names (VUE_APP_* → VITE_*)
  - Added Vite documentation references
  - Added deployment instructions for GitHub Pages
  - Added security features documentation

### Fixed
- 🐛 **Bug Fixes**
  - Fixed API key environment variable naming for Vite
  - Fixed router imports to use correct component paths
  - Fixed error handling in news API service
  - Fixed pagination logic and page size handling
  - Fixed dark mode styling in error states

## [1.1.0] - 2025-12-27

### Added
- 🎨 Dark mode with persistent storage
- 🔍 Advanced search functionality
- 📂 Category-based news browsing
- 🗒️ Settings page for user preferences
- 🌐 Multi-language support structure (for future implementation)

### Changed
- Improved responsive design for mobile devices
- Enhanced card animations and transitions
- Updated design system with CSS variables

## [1.0.0] - 2025-12-15

### Added
- Initial release of NewsHub
- Basic news aggregation from NewsAPI.org
- Category filtering (General, Sports, Technology, Entertainment, Science, Business)
- Search functionality
- Responsive design
- Dark mode toggle
- News card component
- Navigation navbar
- Vue Router setup
- SCSS styling with CSS variables

---

## Migration Guide

### Upgrading from 1.1.0 to 1.2.0

1. **Environment Variables**
   - Update `.env.local` variable names:
     ```bash
     # Old (Vue CLI / Webpack)
     VUE_APP_NEWS_API_KEY=...
     
     # New (Vite)
     VITE_NEWS_API_KEY=...
     ```

2. **Removed Components**
   - `sidebar.vue` has been removed (functionality merged into navbar)
   - If you have custom imports, remove them

3. **Breaking Changes**
   - `newsService.js` has been removed
   - Components now use `newsApi.js` directly
   - Update any custom imports:
     ```javascript
     // Old
     import { fetchNewsByCategory } from '@/services/newsService'
     
     // New
     import { fetchTopHeadlines, searchNews } from '@/services/newsApi'
     ```

4. **New Features**
   - Input validation is now automatic
   - CSP headers are enforced (may affect custom CDN usage)
   - Review SECURITY.md for new security features

---

## Known Issues

- NewsAPI free tier limited to 100 requests per day
- Some articles may not have associated images
- Language switching functionality ready for future implementation

## Future Roadmap

- [ ] Multi-language support (UI translations)
- [ ] Backend API proxy for API key protection
- [ ] Read later / Bookmarks feature
- [ ] User preferences sync to backend
- [ ] Advanced filtering options
- [ ] Export articles to PDF
- [ ] PWA support (offline reading)
- [ ] Dark mode scheduling (auto-switch at sunset)

---

**Last Updated**: December 28, 2025