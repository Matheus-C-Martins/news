# 📰 News Website - Vue 3 App

A modern, responsive news aggregation web application built with Vue 3, powered by the NewsAPI. Browse news articles by category, search, and stay updated with the latest headlines.

## ✨ Features

- **📁 Category-Based News**: Browse news by categories (General, Sports, Technology, Entertainment, Science)
- **🔍 Search Functionality**: Search for any topic and filter articles by relevance
- **📄 Article Cards**: Beautiful card layout with images, descriptions, author info, and publish dates
- **⏱️ Time-Relative Dates**: See how long ago articles were published (e.g., "2h ago", "1d ago")
- **📱 Responsive Design**: Fully responsive on desktop, tablet, and mobile devices
- **🔄 Pagination**: Navigate through multiple pages of articles
- **⚙️ Error Handling**: Graceful error messages and retry functionality
- **🎨 Modern UI**: Clean, professional design with smooth animations
- **⌛ Loading States**: Visual feedback while articles are loading
- **🎯 Sidebar Navigation**: Collapsible sidebar with smooth transitions

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Free API key from [NewsAPI.org](https://newsapi.org/)

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

3. **Set up your API Key**
   - Get your free API key from [https://newsapi.org/](https://newsapi.org/)
   - Open `src/services/newsService.js`
   - Replace `'YOUR_API_KEY_HERE'` with your actual API key:
   ```javascript
   const API_KEY = 'your_actual_api_key_here'
   ```

4. **Run the development server**
   ```bash
   npm run serve
   ```
   
   The app will be available at `http://localhost:8080`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── sidebar.vue              # Navigation sidebar
│   ├── home.vue                 # General news feed with search
│   ├── sports.vue               # Sports news
│   ├── technology.vue           # Technology news
│   ├── shows.vue                # Entertainment news
│   ├── weather.vue              # Science & Weather news
│   ├── settings.vue             # Settings page (placeholder)
│   └── newsCard.vue             # Reusable news article card
├── services/
│   └── newsService.js           # API integration & data fetching
├── assets/                       # Images and static files
├── App.vue                       # Root component
├── router.js                     # Route configuration
└── main.js                       # Application entry point
```

## 📖 Available Scripts

### `npm run serve`
Runs the app in development mode with hot reload.

### `npm run build`
Builds the app for production to the `dist` folder.

### `npm run lint`
Runs ESLint to check code quality.

## 🔗 API Reference

This app uses the [NewsAPI](https://newsapi.org/) to fetch news articles.

### Main Functions in `newsService.js`

#### `fetchNewsByCategory(category, page)`
Fetch news articles by category.

**Parameters:**
- `category` (string): 'general', 'business', 'sports', 'technology', 'entertainment', 'health', 'science'
- `page` (number): Page number for pagination (default: 1)

**Returns:** Promise with articles array and metadata

```javascript
const data = await fetchNewsByCategory('technology', 1)
console.log(data.articles) // Array of articles
```

#### `searchNews(query, sortBy, page)`
Search for news articles by keyword.

**Parameters:**
- `query` (string): Search keyword
- `sortBy` (string): 'relevancy' | 'popularity' | 'publishedAt' (default: 'relevancy')
- `page` (number): Page number for pagination

**Returns:** Promise with search results

```javascript
const results = await searchNews('artificial intelligence', 'relevancy', 1)
```

## 🎨 Customization

### Colors
Edit the CSS variables in `src/App.vue` to customize the app theme:

```scss
:root {
  --primary: #4ade80;              // Main green color
  --primary-alt: #22c55e;          // Darker green
  --grey: #64748b;                 // Text gray
  --dark: #1e293b;                 // Dark background
  --dark-alt: #334155;             // Darker background
  --light: #f1f5f9;                // Light background
  --sidebar-width: 300px;          // Sidebar width when expanded
}
```

### Adding New Categories

1. Create a new `.vue` file in `src/components/`
2. Add the route to `src/router.js`
3. Update `CATEGORY_MAP` in `src/services/newsService.js` to map to a NewsAPI category
4. Add a navigation link in `sidebar.vue`

## 📱 Responsive Breakpoints

- **Desktop**: Full layout with sidebar and content
- **Tablet (≤1024px)**: Sidebar becomes absolute positioned, adjusts padding
- **Mobile (≤640px)**: Single column grid, optimized touch targets

## 🔒 Security Notes

⚠️ **Important**: Never commit your API key to version control!

For production deployment, consider:
- Using environment variables (`.env` file)
- Setting up a backend proxy to hide the API key
- Implementing rate limiting

## 🐛 Troubleshooting

### "Failed to fetch articles. Make sure your API key is set correctly."
- Verify your API key is correct in `src/services/newsService.js`
- Check that you have an active internet connection
- Ensure you haven't exceeded your daily API quota (free tier: 100 requests/day)

### Articles not loading
- Check browser console for errors
- Verify the category name is correct
- Try a different category or search term
- Check if the API is operational

### Sidebar not working on mobile
- Clear browser cache and reload
- Check that localStorage is enabled
- Try in a different browser

## 📊 API Limits

**Free Tier:**
- 100 requests per day
- Limited to top headlines (last 24-30 days)
- Rate limit: 1 request per second

**Paid Tiers:** Check [NewsAPI pricing](https://newsapi.org/pricing)

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Set the `NEWS_API_KEY` environment variable in Vercel settings
4. Update your component to use the environment variable

### Deploy to Netlify
1. Run `npm run build`
2. Drag the `dist` folder to [Netlify](https://netlify.com)
3. Set environment variables in Netlify settings

### Deploy with Docker
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
CMD ["serve", "-s", "dist"]
```

## 📚 Technologies Used

- **Vue 3**: Progressive JavaScript framework
- **Vue Router 4**: Client-side routing
- **Sass**: CSS preprocessing
- **Font Awesome 6**: Icon library
- **NewsAPI**: News data source

## 📝 Future Enhancements

- [ ] Dark/Light theme toggle
- [ ] Bookmark/Save articles
- [ ] Share to social media
- [ ] Article reading time estimate
- [ ] Filter by date range
- [ ] Language selection
- [ ] Offline support with PWA
- [ ] Comments and discussions
- [ ] User accounts and preferences

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [NewsAPI.org](https://newsapi.org/) for providing the news data
- [Vue.js](https://vuejs.org/) team for the amazing framework
- [Font Awesome](https://fontawesome.com/) for the icons

## 📞 Support

Having issues? 
- Check the [Troubleshooting](#-troubleshooting) section
- Review the [API Reference](#-api-reference)
- Open an [issue](https://github.com/Matheus-C-Martins/news/issues) on GitHub

---

**Made with ❤️ by [Matheus Martins](https://github.com/Matheus-C-Martins)**
