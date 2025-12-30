# 📰 NewsHub - News Aggregator

> A modern, responsive Vue 3 news aggregator powered by NewsAPI.org

[![Deploy](https://github.com/Matheus-C-Martins/news/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/Matheus-C-Martins/news/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF)](https://vitejs.dev/)

[Live Demo](https://matheus-c-martins.github.io/news/) • [Documentation](./docs) • [Report Bug](https://github.com/Matheus-C-Martins/news/issues) • [Request Feature](https://github.com/Matheus-C-Martins/news/issues)

---

## ✨ Features

- 🌍 **Multiple Categories** - Browse news from General, Entertainment, Sports, Technology, Science, and Business
- 🔍 **Advanced Search** - Search articles by keywords with relevancy sorting
- 🌙 **Dark Mode** - Beautiful dark theme with persistent storage
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile
- ⚡ **Real-time Data** - Latest news with pagination support
- 🛡️ **Security First** - CSP, input validation, and secure headers

---

## 🚀 Quick Start

### Prerequisites

- Node.js v14+
- npm or yarn
- [NewsAPI.org](https://newsapi.org/register) account (free)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Matheus-C-Martins/news.git
cd news

# 2. Install dependencies
npm install

# 3. Configure API key
cp .env.example .env.local
# Edit .env.local and add your NewsAPI key

# 4. Start development server
npm run dev
```

🎉 App running at `http://localhost:5173`

---

## 📖 Documentation

Detailed documentation is available in the `/docs` folder:

- 📘 **[Getting Started](./docs/getting-started.md)** - Installation, setup, and verification
- ⚙️ **[Configuration](./docs/configuration.md)** - Environment variables, CSP, and proxy setup
- 🚀 **[Deployment](./docs/deployment.md)** - Deploy to GitHub Pages, Vercel, or Netlify
- 🤝 **[Contributing](./CONTRIBUTING.md)** - How to contribute to the project
- 🔒 **[Security](./SECURITY.md)** - Security policy and best practices

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| **[Vue 3](https://vuejs.org/)** | Progressive JavaScript framework (Composition API) |
| **[Vue Router 4](https://router.vuejs.org/)** | Client-side routing |
| **[Vite](https://vitejs.dev/)** | Modern build tool and dev server |
| **[NewsAPI](https://newsapi.org/)** | News data provider |
| **[Font Awesome 6](https://fontawesome.com/)** | Icon library |

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code quality checks |

---

## 🏗️ Project Structure

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
│   ├── router.js         # Vue Router configuration
│   ├── App.vue           # Root component
│   └── main.js           # Entry point
├── docs/                 # Documentation
│   ├── getting-started.md
│   ├── configuration.md
│   └── deployment.md
├── .github/              # GitHub Actions workflows
└── public/               # Static files
```

---

## 🌟 Screenshots

### Light Mode
![Light Mode Preview](https://via.placeholder.com/800x400/ffffff/10b981?text=NewsHub+Light+Mode)

### Dark Mode
![Dark Mode Preview](https://via.placeholder.com/800x400/0f172a/8b5cf6?text=NewsHub+Dark+Mode)

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./CONTRIBUTING.md) first.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [NewsAPI.org](https://newsapi.org/) for providing the news data
- [Vue.js](https://vuejs.org/) team for the amazing framework
- [Font Awesome](https://fontawesome.com/) for the icons
- [Vite](https://vitejs.dev/) for the modern build tool

---

## 📞 Support

- 📚 [Documentation](./docs)
- 🐛 [Report Bug](https://github.com/Matheus-C-Martins/news/issues)
- 💡 [Request Feature](https://github.com/Matheus-C-Martins/news/issues)
- 💬 [Discussions](https://github.com/Matheus-C-Martins/news/discussions)

---

<div align="center">

**Made with ❤️ by [Matheus Martins](https://github.com/Matheus-C-Martins)**

Happy reading! 📰 ✨

[⬆ Back to top](#-newshub---news-aggregator)

</div>