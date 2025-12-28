# 📰 NewsHub - News Aggregator App

A modern, responsive Vue 3 news aggregator application powered by **NewsAPI.org**. Browse news by categories, search for specific topics, and enjoy a beautiful dark mode experience.

## ✨ Features

- 🌍 **Multiple Categories**: Browse news from General, Entertainment, Sports, Technology, Science, and Business
- 🔍 **Advanced Search**: Search news articles by keywords with relevancy sorting
- 🌙 **Dark Mode**: Toggle between light and dark themes with persistent storage
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ⚡ **Real-time Data**: Fetches latest news from NewsAPI with pagination support
- 🔐 **Secure API Key**: Uses environment variables to protect your API key
- 🎨 **Modern UI**: Beautiful card-based layout with smooth animations
- ⏱️ **Relative Timestamps**: Shows how long ago articles were published
- 🖼️ **Image Fallbacks**: Graceful handling of missing article images
- ⌨️ **Keyboard Support**: Enter key to search, smooth scrolling on pagination
- 🛡️ **Security**: Content Security Policy, input validation, and secure headers

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A free API key from [NewsAPI.org](https://newsapi.org/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Matheus-C-Martins/news.git
   cd news
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your API key**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your NewsAPI key:
   ```
   VITE_NEWS_API_KEY=your_api_key_here
   ```
   
   Get your free API key at: [https://newsapi.org/register](https://newsapi.org/register)

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── navbar.vue              # Main navigation bar
│   ├── home.vue                # General news & search page
│   ├── entertainment.vue       # Entertainment news
│   ├── sports.vue              # Sports news
│   ├── science.vue             # Science news
│   ├── technology.vue          # Technology news
│   ├── business.vue            # Business & finance news
│   ├── newsCard.vue            # Individual article card
│   └── settings.vue            # Settings page (dark mode, language)
├── services/
│   ├── newsApi.js              # NewsAPI integration with validation
│   └── languages.js            # Language configuration (for future use)
├── composables/
│   └── useSettings.js          # Dark mode & settings management
├── assets/                     # Static assets
├── router.js                   # Vue Router configuration
├── App.vue                     # Root component
└── main.js                     # Application entry point
```

## 🎨 Design System

### Color Variables

The app uses CSS variables for theming. See `src/App.vue` for the complete design system.

**Key Colors:**
- **Primary**: `#10b981` (Green)
- **Secondary**: `#8b5cf6` (Purple)
- **Accent**: `#f59e0b` (Amber)
- **Dark Background**: `#0f172a`
- **Light Background**: `#ffffff`

### Components

- `.btn` - Button element with variants (primary, secondary, outline)
- `.card` - Card component with hover effects
- `.badge` - Badge component for tags and labels
- `.glass-card` - Glassmorphism card style

## 🔧 Available Scripts

### Development
```bash
npm run dev      # Start development server with hot reload (Vite)
npm run dev:all  # Start with all features enabled
```

### Production
```bash
npm run build    # Build for production (output to dist/)
npm run preview  # Preview production build locally
npm run lint     # Run ESLint to check code quality
```

## 📖 API Integration

This app uses **NewsAPI.org** free tier:
- 100 requests per day
- Access to top headlines and everything endpoints
- Category-based filtering
- Sorting options (relevancy, popularity, publishedAt)

### Available News Categories
- `general` - General news (default)
- `entertainment` - Entertainment news
- `sports` - Sports news
- `technology` - Technology news
- `science` - Science & weather news
- `business` - Business & finance news
- `health` - Health news

See [NewsAPI Documentation](https://newsapi.org/docs) for more details.

## 🔐 Security

The application includes several security features:

### Content Security Policy (CSP)
- Scripts limited to same-origin only
- External API calls whitelisted to newsapi.org
- Prevents XSS attacks

### Input Validation
- Search queries validated and sanitized
- Page numbers validated (1-100)
- Categories whitelisted
- Maximum query length of 500 characters

### Environment Variables
- API keys stored in GitHub Secrets (production)
- `.env.local` never committed to version control
- Use `.env.example` as a template

### Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HTTPS enforcement)

See [SECURITY.md](./SECURITY.md) for more details.

## 📝 Environment Variables

Required environment variables (see `.env.example`):

```env
# NewsAPI.org API Key (required)
VITE_NEWS_API_KEY=your_api_key_here

# Optional: Vercel API URL (for future backend integration)
VITE_VERCEL_API_URL=https://api.vercel.com
```

**Important Security Notes:**
- `.env.local` is automatically ignored by `.gitignore`
- Never commit your API key to version control
- Use `.env.example` as a template for team members

## 🎯 Features Explained

### Dark Mode
- Toggle using the navbar button (moon/sun icon)
- Respects system preferences on first visit
- Preference persists in localStorage
- Smooth CSS transitions between modes
- Custom scrollbar styling in dark mode

### Search
- Search by keywords across all news sources
- Results sorted by relevancy (customizable)
- Clear button to quickly reset search
- Pagination support for large result sets
- Real-time search hints

### Categories
- One-click navigation to category-specific news
- Paginated results (20 articles per page)
- Consistent UI and behavior across all categories
- Individual component for each category

### Error Handling
- Graceful error messages for API issues
- Clear API key configuration errors
- Retry functionality on failure
- Image loading fallbacks with placeholders
- Network error detection

## 📱 Responsive Design

**Breakpoints:**
- **Desktop** (1024px+): Full layout with expanded content
- **Tablet** (640px - 1024px): Adjusted grid and spacing
- **Mobile** (<640px): Single-column layout, optimized touch targets

All components automatically adapt to screen size.

## 🐛 Troubleshooting

### "API key not configured" Error
**Solution**: 
1. Make sure `.env.local` exists in your project root
2. Verify it contains: `VITE_NEWS_API_KEY=your_actual_key`
3. Restart the development server:
   ```bash
   npm run dev
   ```

### No articles loading
**Possible causes and solutions**:
1. **Invalid API key**: Verify at [NewsAPI Dashboard](https://newsapi.org/account)
2. **API quota reached**: Free tier = 100 requests/day. Check your usage.
3. **No internet**: Check your connection
4. **NewsAPI down**: Check [NewsAPI status](https://newsapi.org/)

### Images not loading
This is normal behavior - some articles don't have associated images. The app displays a placeholder icon instead.

### Dark mode not persisting
- Ensure localStorage is enabled in your browser
- Check if you're in private/incognito mode
- Clear cookies and try again

## 🚀 Deployment

### GitHub Pages (Recommended for free hosting)
1. Push code to GitHub
2. Repository is already configured for GitHub Pages deployment
3. GitHub Actions automatically builds and deploys on push to main
4. Set environment variable in GitHub Actions secrets:
   - Go to Settings → Secrets → Actions
   - Add: `VITE_NEWS_API_KEY=your_api_key`
5. Site will be available at: `https://matheus-c-martins.github.io/news/`

### Vercel
1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variable in Vercel settings:
   - Name: `VITE_NEWS_API_KEY`
   - Value: Your API key
4. Deploy!

### Netlify
1. Push code to GitHub
2. Connect repository to [Netlify](https://netlify.com)
3. Set environment variable in Netlify settings:
   - Key: `VITE_NEWS_API_KEY`
   - Value: Your API key
4. Deploy!

## 💻 Technologies Used

- **Vue 3** - Progressive JavaScript framework (Composition API)
- **Vue Router 4** - Client-side routing
- **Vite** - Modern build tool and dev server
- **SCSS** - CSS preprocessor with CSS variables
- **Font Awesome 6** - Icon library
- **NewsAPI** - News data provider
- **Fetch API** - HTTP requests with validation

## 🛠️ Service Functions

### `newsApi.js` API

#### `fetchTopHeadlines(options)`
```javascript
const data = await fetchTopHeadlines({ 
  page: 1,
  pageSize: 20,
  language: 'en' // optional
})
// Returns: { articles: [...], totalResults: 123, status: 'ok' }
```

#### `searchNews(options)`
```javascript
const results = await searchNews({ 
  q: 'AI', 
  sortBy: 'relevancy',
  page: 1,
  pageSize: 20,
  language: 'en' // optional
})
// Returns: { articles: [...], totalResults: 5000, status: 'ok' }
```

#### `fetchTopHeadlines(options)` - Category based
```javascript
const categoryNews = await fetchTopHeadlines({ 
  category: 'technology',
  page: 1,
  pageSize: 20
})
```

## 📚 Learning Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [NewsAPI Documentation](https://newsapi.org/docs)
- [FontAwesome Icons](https://fontawesome.com/icons)
- [SCSS Documentation](https://sass-lang.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [NewsAPI.org](https://newsapi.org/) for providing the news data
- [Vue.js](https://vuejs.org/) team for the amazing framework
- [Font Awesome](https://fontawesome.com/) for the icons
- [Vite](https://vitejs.dev/) for the modern build tool

---

**Made with ❤️ by [Matheus Martins](https://github.com/Matheus-C-Martins)**  
Happy reading! 📰 ✨