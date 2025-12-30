# 🚀 Getting Started

This guide will help you set up and run NewsHub on your local machine.

## Prerequisites

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **NewsAPI.org account** (free tier available)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Matheus-C-Martins/news.git
cd news
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Key

#### Get Your API Key
1. Visit [NewsAPI.org](https://newsapi.org/register)
2. Create a free account
3. Copy your API key from the dashboard

#### Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add your API key:

```env
VITE_NEWS_API_KEY=your_api_key_here
```

⚠️ **Important:** Never commit `.env.local` to git!

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Project Structure

```
news/
├── src/
│   ├── components/       # Vue components
│   │   ├── navbar.vue
│   │   ├── home.vue
│   │   ├── newsCard.vue
│   │   └── ...
│   ├── services/         # API services
│   │   └── newsApi.js
│   ├── composables/      # Vue composables
│   │   └── useSettings.js
│   ├── assets/           # Static assets
│   ├── router.js         # Vue Router
│   ├── App.vue           # Root component
│   └── main.js           # Entry point
├── public/               # Static files
├── docs/                 # Documentation
├── .github/              # GitHub Actions
└── package.json
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code quality checks |

## Verification

### Check API Key Configuration

Open your browser console and run:

```javascript
import.meta.env.VITE_NEWS_API_KEY
```

It should display your API key (not empty or undefined).

### Test API Connection

1. Open the app in your browser
2. You should see news articles loading
3. Try searching for a topic
4. Switch between categories

If you see errors, check the [Troubleshooting](#troubleshooting) section below.

## Troubleshooting

### "API key not configured" Error

**Solution:**
1. Verify `.env.local` exists in project root
2. Ensure it contains: `VITE_NEWS_API_KEY=your_key`
3. Restart the dev server: `npm run dev`

### "Failed to fetch" or CORS Errors

**Solution:**
1. Check your API key is valid at [NewsAPI Dashboard](https://newsapi.org/account)
2. Verify your internet connection
3. Check if NewsAPI is down at [NewsAPI Status](https://status.newsapi.org/)

### No Articles Loading

**Possible causes:**
- Invalid API key → Verify at NewsAPI.org
- Rate limit exceeded → Free tier = 100 requests/day
- Network issues → Check internet connection
- API service down → Check NewsAPI status

### Port Already in Use

If port 5173 is already in use:

```bash
# Kill the process using the port (Mac/Linux)
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

## Next Steps

- 📖 Read [Configuration Guide](./configuration.md) for advanced setup
- 🚀 Learn about [Deployment](./deployment.md) to GitHub Pages
- 🤝 Check [Contributing Guidelines](../CONTRIBUTING.md) to contribute
- 🔒 Review [Security Policy](../SECURITY.md) for security best practices

## Need Help?

- 📚 [NewsAPI Documentation](https://newsapi.org/docs)
- 🐛 [Report an Issue](https://github.com/Matheus-C-Martins/news/issues)
- 💬 [Start a Discussion](https://github.com/Matheus-C-Martins/news/discussions)

---

**Made with ❤️ by [Matheus Martins](https://github.com/Matheus-C-Martins)**