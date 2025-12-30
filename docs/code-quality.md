# 🎯 Code Quality Guide

This project uses automated tools to maintain consistent code quality and style.

## Tools

### Prettier - Code Formatter
**Purpose:** Enforce consistent code style automatically

**Configuration:** `.prettierrc.json`

```json
{
  "semi": false,              // No semicolons
  "singleQuote": true,        // Use single quotes
  "tabWidth": 2,              // 2 space indentation
  "printWidth": 100,          // Max line length
  "trailingComma": "es5"      // Trailing commas where valid
}
```

**Usage:**
```bash
# Format all files
npm run format

# Check formatting without changing files
npm run format:check

# Format specific file
npx prettier --write src/components/MyComponent.vue
```

### ESLint - Code Linter
**Purpose:** Find and fix code quality issues

**Configuration:** `package.json` (eslintConfig)

**Usage:**
```bash
# Lint all files
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Husky - Git Hooks
**Purpose:** Run checks automatically on git actions

**Hooks configured:**
- **pre-commit:** Format and lint staged files
- **pre-push:** Run test suite

### lint-staged
**Purpose:** Run linters only on staged files (faster)

**Configuration:** `.lintstagedrc.json`

```json
{
  "*.{js,jsx,vue}": [
    "prettier --write",
    "eslint --fix"
  ]
}
```

### EditorConfig
**Purpose:** Consistent editor settings across team

**Configuration:** `.editorconfig`

---

## Workflow

### 1. During Development

**Automatic (VS Code with extensions):**
- Format on save
- Lint errors highlighted
- Auto-fix on save

**Manual:**
```bash
npm run format      # Format code
npm run lint:fix    # Fix linting issues
```

### 2. Before Commit

**Automatic (Husky pre-commit hook):**
```bash
git add .
git commit -m "feat: add new feature"

# Husky runs automatically:
# 1. Prettier formats staged files
# 2. ESLint fixes staged files
# 3. Files are staged again
# 4. Commit proceeds
```

**If checks fail:**
- Fix the issues manually
- Stage the fixed files
- Commit again

### 3. Before Push

**Automatic (Husky pre-push hook):**
```bash
git push

# Husky runs:
# 1. npm test (runs all tests)
# 2. If tests pass, push proceeds
# 3. If tests fail, push is blocked
```

---

## Editor Setup

### VS Code (Recommended)

**Install extensions:**
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "editorconfig.editorconfig",
    "Vue.volar"
  ]
}
```

**Settings (`.vscode/settings.json`):**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### WebStorm / IntelliJ IDEA

1. Enable Prettier:
   - Settings → Languages & Frameworks → JavaScript → Prettier
   - Enable "On save"

2. Enable ESLint:
   - Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
   - Enable "Automatic ESLint configuration"

---

## Configuration Files

### .prettierrc.json
Prettier formatting rules

### .prettierignore
Files to exclude from formatting

### .editorconfig
Editor-agnostic settings

### .lintstagedrc.json
Staged files processing rules

### .husky/
Git hook scripts

---

## Best Practices

### ✅ DO

- **Let tools do the work** - Don't format manually
- **Commit formatted code** - Use pre-commit hooks
- **Fix lint errors** - Don't suppress unless necessary
- **Run tests before push** - Don't skip with `--no-verify`
- **Follow naming conventions** - camelCase, PascalCase, etc.
- **Write meaningful commits** - Follow conventional commits

### ❌ DON'T

- **Skip hooks** - `git commit --no-verify` only in emergencies
- **Disable rules** - Unless you have a good reason
- **Mix styles** - Prettier handles formatting
- **Commit failing tests** - Fix or skip specific tests
- **Ignore warnings** - They exist for a reason

---

## Troubleshooting

### Husky hooks not running

```bash
# Reinstall Husky
npm run prepare

# Check hook files are executable
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Prettier not formatting

```bash
# Check Prettier is installed
npm list prettier

# Run manually
npx prettier --write src/

# Check ignore files
cat .prettierignore
```

### ESLint errors after formatting

```bash
# Prettier and ESLint conflict
# Make sure you have eslint-config-prettier installed
npm install --save-dev eslint-config-prettier

# Add to eslintConfig in package.json
"extends": [
  "plugin:vue/vue3-essential",
  "eslint:recommended",
  "prettier"  // Add this
]
```

### Pre-push tests taking too long

```bash
# Option 1: Speed up tests
npm run test -- --run --reporter=dot

# Option 2: Run specific tests only
# (Modify .husky/pre-push)

# Option 3: Skip tests temporarily (not recommended)
git push --no-verify
```

---

## CI/CD Integration

These tools integrate seamlessly with CI/CD:

```yaml
# GitHub Actions example
- name: Check formatting
  run: npm run format:check

- name: Lint code
  run: npm run lint

- name: Run tests
  run: npm test
```

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check if files are formatted |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm test` | Run test suite |
| `npm run prepare` | Setup Husky (runs after npm install) |

---

## Resources

- [Prettier Documentation](https://prettier.io/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/okonet/lint-staged)
- [EditorConfig](https://editorconfig.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Happy coding with consistent style!** ✨
