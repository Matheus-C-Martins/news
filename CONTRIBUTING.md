# Contributing to NewsHub

Thank you for your interest in contributing to NewsHub! This document provides guidelines and instructions for contributing to the project.

## 📄 Code of Conduct

- Be respectful and inclusive
- Welcome diverse perspectives
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 14+ and npm/yarn
- Git
- A code editor (VS Code recommended)
- Basic knowledge of Vue 3 and JavaScript

### Development Setup

1. **Fork the repository**
   ```bash
   # Visit: https://github.com/Matheus-C-Martins/news
   # Click "Fork" button
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/news.git
   cd news
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Matheus-C-Martins/news.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```
   Add your NewsAPI key to `.env.local`

6. **Start development server**
   ```bash
   npm run dev
   ```

## 🎄 Branching Strategy

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-name` - Documentation updates
- `refactor/refactor-name` - Code refactoring
- `test/test-name` - Tests and testing

### Example

```bash
# Feature branch
git checkout -b feature/dark-mode-schedule

# Fix branch
git checkout -b fix/search-pagination-bug

# Docs branch
git checkout -b docs/api-documentation
```

## 🗒️ Making Changes

### 1. Create a Feature Branch

```bash
git checkout -b feature/my-feature
```

### 2. Make Your Changes

- Keep commits small and logical
- Write meaningful commit messages
- Follow the code style (see below)
- Test your changes thoroughly

### 3. Commit Guidelines

**Good commit messages:**
```
Feat: Add article bookmarking feature
Fix: Resolve pagination bug on mobile
Docs: Update installation instructions
Refactor: Simplify news card component
Test: Add unit tests for newsApi service
```

**Format:**
```
<Type>: <Summary>

<Optional detailed explanation>

Related: #123 (if fixing an issue)
```

**Types:**
- `Feat`: New feature
- `Fix`: Bug fix
- `Docs`: Documentation
- `Style`: Code style (formatting, semicolons, etc.)
- `Refactor`: Code refactoring
- `Test`: Tests
- `Chore`: Build, dependencies, etc.

## 📉 Code Style Guide

### JavaScript/Vue

1. **Use ES6+ features**
   ```javascript
   // ✅ Good
   const { fetchNews } = useNewsApi()
   const articles = computed(() => news.value.filter(...))
   
   // ❌ Avoid
   var articles = data.news.filter(...)
   ```

2. **Composition API preferred**
   ```vue
   <script setup>
   import { ref } from 'vue'
   
   const count = ref(0)
   </script>
   ```

3. **Comments for complex logic**
   ```javascript
   // Validate and sanitize search query
   function validateQuery(query) {
     // Max 500 characters to prevent abuse
     if (query.length > 500) {
       throw new Error('Query too long')
     }
   }
   ```

4. **Descriptive variable names**
   ```javascript
   // ✅ Good
   const isLoadingArticles = ref(false)
   const articlesPerPage = 20
   
   // ❌ Avoid
   const loading = ref(false)
   const perPage = 20
   ```

### Vue Components

1. **Component naming (PascalCase)**
   ```vue
   <!-- ✅ Good: NewsCard.vue -->
   <!-- ❌ Avoid: news-card.vue or newsCard.vue -->
   ```

2. **Consistent template formatting**
   ```vue
   <template>
     <div class="component">
       <h1>{{ title }}</h1>
       <p>{{ description }}</p>
     </div>
   </template>
   ```

3. **Script setup organization**
   ```vue
   <script setup>
   // Imports first
   import { ref, computed } from 'vue'
   import NewsCard from './NewsCard.vue'
   
   // Props
   const props = defineProps({...})
   
   // Emits
   const emit = defineEmits(['update'])
   
   // Refs and state
   const articles = ref([])
   
   // Computed
   const hasArticles = computed(() => ...)
   
   // Methods
   const loadArticles = async () => {...}
   
   // Lifecycle hooks
   onMounted(() => {...})
   </script>
   ```

### SCSS/CSS

1. **Use CSS variables**
   ```scss
   .card {
     background: var(--bg-secondary);
     color: var(--text-primary);
     border: 1px solid var(--border-color);
   }
   ```

2. **Nested selectors for organization**
   ```scss
   .article-card {
     padding: 1rem;
     
     .header {
       margin-bottom: 1rem;
     }
     
     .content {
       flex: 1;
     }
   }
   ```

3. **Mobile-first responsive design**
   ```scss
   .grid {
     grid-template-columns: 1fr;
     gap: 1rem;
     
     @media (min-width: 768px) {
       grid-template-columns: repeat(2, 1fr);
       gap: 1.5rem;
     }
   }
   ```

## 🪣 Testing

### Before Submitting PR

1. **Test locally**
   ```bash
   npm run dev
   # Test in browser at http://localhost:5173
   ```

2. **Test different scenarios**
   - Different screen sizes (mobile, tablet, desktop)
   - Dark and light modes
   - Different browsers (Chrome, Firefox, Safari)
   - With and without API key errors

3. **Run linter** (if available)
   ```bash
   npm run lint
   ```

4. **Check for console errors**
   - Open DevTools (F12)
   - Check Console tab for any errors
   - Fix any warnings or errors

## 📃 Submitting a Pull Request

### 1. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 2. Push to Your Fork

```bash
git push origin feature/my-feature
```

### 3. Create Pull Request

- Go to GitHub and click "Compare & pull request"
- Fill in the PR template:

```markdown
## Description
Brief description of changes

## Related Issue
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test these changes?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Changes tested locally
```

### 4. Respond to Reviews

- Be open to feedback
- Request changes if you disagree (with explanation)
- Mark conversations as resolved when addressed
- Push new commits (don't force push on PRs)

## 📖 Documentation

### When to Update Docs

- Adding a new feature
- Changing API behavior
- Adding new component
- Changing setup process
- Adding configuration options

### Documentation Files

- `README.md` - Main documentation
- `SECURITY.md` - Security guidelines
- `CHANGELOG.md` - Version history
- `.env.example` - Environment variables
- Component comments - Inline documentation

## 🐦 Finding Issues to Work On

Look for issues labeled:

- `good first issue` - Good for beginners
- `help wanted` - Need community help
- `feature request` - New features
- `bug` - Bug fixes

Comment on the issue to express interest before starting work.

## 🔗 Development Workflow Example

```bash
# 1. Update main branch
git checkout main
git pull upstream main

# 2. Create feature branch
git checkout -b feature/add-bookmarks

# 3. Make changes
# ... edit files ...

# 4. Test changes
npm run dev
# Test in browser

# 5. Commit changes
git add .
git commit -m "Feat: Add bookmarking feature for articles"

# 6. Push to fork
git push origin feature/add-bookmarks

# 7. Create pull request on GitHub
# ... fill in PR template ...

# 8. Respond to reviews
# ... make requested changes ...
# ... push new commits ...

# 9. Merge and cleanup
git checkout main
git pull upstream main
git branch -d feature/add-bookmarks
```

## ❔ Questions or Need Help?

- Comment on related issues
- Check existing discussions
- Review documentation
- Ask in pull request comments

## 🙏 Thank You!

Thank you for contributing to NewsHub! Your help makes this project better for everyone.

---

**Happy contributing! 🎉**