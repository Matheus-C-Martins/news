# 📰 News Aggregator App

A modern, responsive Vue 3 news aggregator application powered by the **NewsAPI**. Browse news by categories, search for specific topics, and enjoy a beautiful dark mode experience.

## ✨ Features

- 🌍 **Multiple Categories**: Browse news from General, Entertainment, Sports, Technology, Science, and Finance
- 🔍 **Advanced Search**: Search news articles by keywords with relevancy sorting
- 🌙 **Dark Mode**: Toggle between light and dark themes with persistent storage
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ⚡ **Real-time Data**: Fetches latest news from NewsAPI with pagination support
- 🔐 **Secure API Key**: Uses environment variables to protect your API key
- 🎨 **Modern UI**: Beautiful card-based layout with smooth animations
- ⏱️ **Relative Timestamps**: Shows how long ago articles were published
- 🖼️ **Image Fallbacks**: Graceful handling of missing article images
- ⌨️ **Keyboard Support**: Enter key to search, smooth scrolling on pagination

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
   VUE_APP_NEWS_API_KEY=your_api_key_here
   ```
   
   Get your free API key at: [https://newsapi.org/register](https://newsapi.org/register)

4. **Start the development server**
   ```bash
   npm run serve
   ```
   
   The app will be available at `http://localhost:8080`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── sidebar.vue           # Navigation sidebar with dark mode toggle
│   ├── home.vue              # General news & search page
│   ├── shows.vue             # Entertainment news
│   ├── sports.vue            # Sports news
│   ├── weather.vue           # Science & weather news
│   ├── technology.vue        # Technology news
│   ├── finance.vue           # Finance & business news
│   ├── newsCard.vue          # Individual article card component
│   └── settings.vue          # Settings page
├── services/
│   └── newsService.js        # NewsAPI integration & utility functions
├── assets/
│   └── logo.png              # Application logo
├── router.js                 # Vue Router configuration
├── App.vue                   # Main app component
└── main.js                   # Application entry point
```

## 🎨 Design System

### Color Palette

**Light Mode**
- Primary: `#4ade80` (Green)
- Primary Alt: `#22c55e`
- Dark: `#1e293b`
- Light: `#f1f5f9`
- Text Primary: `#1e293b`
- Text Secondary: `#64748b`
- Background: `#ffffff`

**Dark Mode**
- Background Primary: `#0f172a`
- Background Secondary: `#1e293b`
- Text Primary: `#f1f5f9`
- Text Secondary: `#cbd5e1`
- Primary: `#4ade80` (Same green)

## 🔧 Available Scripts

### Development
```bash
npm run serve    # Start development server with hot reload
```

### Production
```bash
npm run build    # Build for production
npm run lint     # Run ESLint
```

## 📖 API Integration

This app uses the **NewsAPI.org** free tier:
- 100 requests per day
- Access to top headlines and everything endpoints
- Category-based filtering
- Sorting options (relevancy, popularity, publishedAt)

### Available News Categories
- `general` - General news
- `entertainment` - Entertainment news (Shows)
- `sports` - Sports news
- `technology` - Technology news
- `science` - Science news (Weather)
- `business` - Business & Finance news
- `health` - Health news

See [NewsAPI Documentation](https://newsapi.org/docs) for more details.

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
VUE_APP_NEWS_API_KEY=your_api_key_here
```

**Important Security Notes:**
- `.env.local` is automatically ignored by `.gitignore`
- Never commit your API key to version control
- Use `.env.example` as a template for team members

## 🎯 Features Explained

### Dark Mode
- Toggle using the sidebar button (moon/sun icon)
- Respects system preferences on first visit
- Preference persists in localStorage
- Smooth CSS transitions between modes
- Custom scrollbar styling in dark mode

### Search
- Search by keywords across all news sources
- Results sorted by relevancy (can be customized)
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
- **Desktop** (1024px+): Full layout with expanded sidebar
- **Tablet** (640px - 1024px): Collapsed sidebar, adjusted grid
- **Mobile** (<640px): Single-column layout, optimized touch targets

All components automatically adapt to screen size.

## 🐛 Troubleshooting

### "API key not configured" Error
**Solution**: 
1. Make sure `.env.local` exists in your project root
2. Verify it contains: `VUE_APP_NEWS_API_KEY=your_actual_key`
3. Restart the development server:
   ```bash
   npm run serve
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

### Netlify
1. Push code to GitHub
2. Connect repository to [Netlify](https://netlify.com)
3. Set environment variable in Netlify settings:
   - Key: `VUE_APP_NEWS_API_KEY`
   - Value: Your API key
4. Deploy!

### Vercel
1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variable:
   - Name: `VUE_APP_NEWS_API_KEY`
   - Value: Your API key
4. Deploy!

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=0 /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

## 💻 Technologies Used

- **Vue 3** - Progressive JavaScript framework
- **Vue Router 4** - Client-side routing
- **SCSS** - Styling with CSS variables
- **Font Awesome 6** - Icon library
- **NewsAPI** - News data provider
- **Fetch API** - HTTP requests

## 🛠️ Service Functions

### `newsService.js` API

#### `fetchNewsByCategory(category, page)`
```javascript
const data = await fetchNewsByCategory('technology', 1)
// Returns: { articles: [...], totalResults: 123, status: 'ok' }
```

#### `searchNews(query, sortBy, page)`
```javascript
const results = await searchNews('AI', 'relevancy', 1)
// Returns: { articles: [...], totalResults: 5000, status: 'ok' }
```

#### `fetchTopHeadlines(country, page)`
```javascript
const headlines = await fetchTopHeadlines('us', 1)
// Returns: { articles: [...], totalResults: 38, status: 'ok' }
```

## 📚 Learning Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
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

---

**Made with ❤️ by [Matheus Martins](https://github.com/Matheus-C-Martins)**  
Happy reading! 📰 ✨