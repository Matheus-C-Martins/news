# 🚀 Quick Setup Guide

## Step 1: Get Your API Key

1. Visit [https://newsapi.org/](https://newsapi.org/)
2. Click "Get API Key" (free tier available)
3. Sign up with your email
4. Copy your API key from the dashboard

## Step 2: Add API Key to Your Project

1. Open `src/services/newsService.js`
2. Find line 5: `const API_KEY = 'YOUR_API_KEY_HERE'`
3. Replace with your actual key:
   ```javascript
   const API_KEY = 'your_actual_api_key_here'
   ```

## Step 3: Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run serve

# Open browser to http://localhost:8080
```

## Step 4: Test the App

- Click "All" in the sidebar to see general news
- Try different categories (Sports, Technology, etc.)
- Use the search bar on the home page
- Navigate through pages with pagination buttons

## 📊 What's New

Your app now has:

### ✨ New Features
- **News API Integration** - Fetches real articles from NewsAPI
- **Search Functionality** - Search articles by keyword
- **Category Navigation** - Browse different news categories
- **Article Cards** - Beautiful cards with images, descriptions, and metadata
- **Pagination** - Load more articles with next/previous buttons
- **Loading States** - Spinners while fetching data
- **Error Handling** - Graceful error messages with retry buttons
- **Responsive Design** - Works on desktop, tablet, and mobile

### 📁 New Files Added
```
src/
├── services/
│   └── newsService.js          ← News API integration
├── components/
│   ├── newsCard.vue            ← Reusable article card
│   ├── home.vue                ← Updated with search & articles
│   ├── sports.vue              ← Updated with articles
│   ├── technology.vue          ← Updated with articles
│   ├── shows.vue               ← Updated with articles
│   └── weather.vue             ← Updated with articles
└── ...
```

### 🎨 Key Components Explained

#### newsService.js
- Handles all API calls to NewsAPI
- `fetchNewsByCategory(category, page)` - Get articles by category
- `searchNews(query, sortBy, page)` - Search articles
- Includes error handling and data formatting

#### newsCard.vue
- Displays individual news articles
- Shows article image, title, description, author, date
- Includes "Read Article" button linking to full article
- Responsive design with hover effects

#### home.vue (and other category pages)
- Uses newsCard component to display articles
- Implements pagination
- Includes search functionality (home.vue only)
- Error handling with retry button
- Loading states with spinner

## 🔧 Common Tasks

### Change Colors
Edit `src/App.vue` CSS variables:
```scss
:root {
  --primary: #4ade80;      // Change green to your color
  --dark: #1e293b;         // Change dark color
  // ... other colors
}
```

### Add a New Category
1. Create `src/components/yourCategory.vue` (copy from sports.vue)
2. Add route in `src/router.js`
3. Add to sidebar in `src/components/sidebar.vue`
4. Update `CATEGORY_MAP` in `newsService.js`

### Deploy to Production
```bash
# Build for production
npm run build

# This creates a 'dist' folder
# Upload it to your hosting (Vercel, Netlify, etc.)
```

## 📱 API Free Tier Limits

- **100 requests per day**
- **1 request per second**
- **Articles from last 24-30 days**
- **Perfect for testing and small projects**

## 🆘 Troubleshooting

### "API Key Error"
→ Make sure you replaced `YOUR_API_KEY_HERE` with your actual key

### "No articles loading"
→ Check browser console (F12) for error messages
→ Verify internet connection
→ Check if you've exceeded daily API quota

### "Sidebar not expanding on mobile"
→ Clear browser cache (Ctrl+Shift+Delete)
→ Try in a different browser
→ Check if localStorage is enabled

## 📚 Next Steps

Consider adding:
- **Dark mode toggle** - Add a theme switcher
- **Bookmarks** - Save articles to favorites
- **Share buttons** - Share to social media
- **User accounts** - Save preferences per user
- **PWA** - Make it installable as app

## 📖 Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [NewsAPI Docs](https://newsapi.org/docs)
- [Sass Guide](https://sass-lang.com/)
- [Vue Router Docs](https://router.vuejs.org/)

## ✅ Checklist

- [ ] Got API key from NewsAPI.org
- [ ] Added API key to newsService.js
- [ ] Ran `npm install`
- [ ] Ran `npm run serve`
- [ ] Can see news articles loading
- [ ] Search works on home page
- [ ] Different categories show different news
- [ ] Pagination works

## 💡 Pro Tips

1. **Bookmark the app** in your browser for quick access
2. **Test with different search terms** to find interesting articles
3. **Check different categories** to explore various news sources
4. **Use pagination** to load more articles without refreshing
5. **Open articles in new tabs** to read full content

---

**Having trouble?** Check the main [README.md](./README.md) for more detailed documentation!
