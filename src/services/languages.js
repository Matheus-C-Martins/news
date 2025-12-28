/**
 * Language and News Sources Configuration
 * Maps each language to supported news sources and API parameters
 */

export const LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    apiLanguage: 'en',
    countries: ['us', 'gb', 'au', 'ca'],
    defaultCountry: 'us'
  },
  pt: {
    code: 'pt',
    name: 'Português',
    flag: '🇵🇹',
    apiLanguage: 'pt',
    countries: ['pt', 'br'],
    defaultCountry: 'pt'
  },
  es: {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    apiLanguage: 'es',
    countries: ['es', 'mx', 'ar'],
    defaultCountry: 'es'
  },
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    apiLanguage: 'fr',
    countries: ['fr', 'ca'],
    defaultCountry: 'fr'
  },
  de: {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    apiLanguage: 'de',
    countries: ['de', 'at', 'ch'],
    defaultCountry: 'de'
  },
  it: {
    code: 'it',
    name: 'Italiano',
    flag: '🇮🇹',
    apiLanguage: 'it',
    countries: ['it'],
    defaultCountry: 'it'
  }
}

/**
 * News sources organized by language
 * Only sources available in NewsAPI for each language
 */
export const SOURCE_BY_LANGUAGE = {
  en: [
    // Technology
    { id: 'techcrunch', name: 'TechCrunch', category: 'Technology', country: 'USA', description: 'Breaking tech news and in-depth analysis', language: 'en' },
    { id: 'wired', name: 'Wired', category: 'Technology', country: 'USA', description: 'Technology, business, and culture', language: 'en' },
    { id: 'the-verge', name: 'The Verge', category: 'Technology', country: 'USA', description: 'Technology, science, and culture', language: 'en' },
    { id: 'hacker-news', name: 'Hacker News', category: 'Technology', country: 'USA', description: 'Community driven tech news', language: 'en' },
    
    // Business
    { id: 'cnbc', name: 'CNBC', category: 'Business', country: 'USA', description: 'Business news and financial markets', language: 'en' },
    { id: 'bloomberg', name: 'Bloomberg', category: 'Business', country: 'USA', description: 'Global business and financial news', language: 'en' },
    { id: 'reuters', name: 'Reuters', category: 'Business', country: 'UK', description: 'Global news and information', language: 'en' },
    
    // Sports
    { id: 'espn', name: 'ESPN', category: 'Sports', country: 'USA', description: 'Sports news and analysis', language: 'en' },
    { id: 'bbc-sport', name: 'BBC Sport', category: 'Sports', country: 'UK', description: 'International sports coverage', language: 'en' },
    
    // Entertainment
    { id: 'entertainment-weekly', name: 'Entertainment Weekly', category: 'Entertainment', country: 'USA', description: 'Entertainment and celebrity news', language: 'en' },
    { id: 'bbc-entertainment', name: 'BBC Entertainment', category: 'Entertainment', country: 'UK', description: 'Entertainment and media', language: 'en' },
    
    // General
    { id: 'bbc-news', name: 'BBC News', category: 'General', country: 'UK', description: 'World news and current events', language: 'en' },
    { id: 'cnn', name: 'CNN', category: 'General', country: 'USA', description: 'Breaking news and world coverage', language: 'en' },
    { id: 'the-new-york-times', name: 'The New York Times', category: 'General', country: 'USA', description: 'News, politics, and analysis', language: 'en' },
    { id: 'the-guardian', name: 'The Guardian', category: 'General', country: 'UK', description: 'News, opinions, and investigations', language: 'en' },
    { id: 'associated-press', name: 'Associated Press', category: 'General', country: 'USA', description: 'Breaking news from around the world', language: 'en' },
  ],
  
  pt: [
    // Technology
    { id: 'globo', name: 'Globo', category: 'General', country: 'Brazil', description: 'Notícias gerais, política e tecnologia', language: 'pt' },
    { id: 'folha-de-sao-paulo', name: 'Folha de São Paulo', category: 'General', country: 'Brazil', description: 'Notícias, análises e reportagens', language: 'pt' },
    
    // Business
    { id: 'o-globo', name: 'O Globo', category: 'Business', country: 'Brazil', description: 'Notícias de negócios e mercado', language: 'pt' },
    { id: 'valor-economico', name: 'Valor Econômico', category: 'Business', country: 'Brazil', description: 'Análise econômica e financeira', language: 'pt' },
    
    // General
    { id: 'rtp', name: 'RTP', category: 'General', country: 'Portugal', description: 'Notícias de Portugal e do Mundo', language: 'pt' },
    { id: 'publico', name: 'Público', category: 'General', country: 'Portugal', description: 'Notícias, análise e investigação', language: 'pt' },
    { id: 'diario-noticias', name: 'Diário de Notícias', category: 'General', country: 'Portugal', description: 'Notícias diárias de Portugal', language: 'pt' },
  ],
  
  es: [
    // General
    { id: 'el-mundo', name: 'El Mundo', category: 'General', country: 'Spain', description: 'Noticias de España y el mundo', language: 'es' },
    { id: 'el-pais', name: 'El País', category: 'General', country: 'Spain', description: 'Noticias, análisis y reportajes', language: 'es' },
    
    // Business
    { id: 'expansion', name: 'Expansión', category: 'Business', country: 'Spain', description: 'Noticias económicas y empresariales', language: 'es' },
    
    // General
    { id: 'clarin', name: 'Clarin', category: 'General', country: 'Argentina', description: 'Noticias de Argentina y el mundo', language: 'es' },
    { id: 'la-nacion', name: 'La Nación', category: 'General', country: 'Argentina', description: 'Noticias políticas y generales', language: 'es' },
  ],
  
  fr: [
    // General
    { id: 'le-monde', name: 'Le Monde', category: 'General', country: 'France', description: 'Actualités, analyses et enquêtes', language: 'fr' },
    { id: 'figaro', name: 'Le Figaro', category: 'General', country: 'France', description: 'Actualités françaises et internationales', language: 'fr' },
    
    // Business
    { id: 'les-echos', name: 'Les Échos', category: 'Business', country: 'France', description: 'Actualités économiques et financières', language: 'fr' },
    
    // General
    { id: 'rts', name: 'RTS', category: 'General', country: 'Switzerland', description: 'Actualités suisses et internationales', language: 'fr' },
  ],
  
  de: [
    // General
    { id: 'der-spiegel', name: 'Der Spiegel', category: 'General', country: 'Germany', description: 'Nachrichten, Politik und Kultur', language: 'de' },
    { id: 'die-zeit', name: 'Die Zeit', category: 'General', country: 'Germany', description: 'Nachrichten und Analysen', language: 'de' },
    
    // Business
    { id: 'handelsblatt', name: 'Handelsblatt', category: 'Business', country: 'Germany', description: 'Nachrichten de economía y finanzas', language: 'de' },
  ],
  
  it: [
    // General
    { id: 'corriere-della-sera', name: 'Corriere della Sera', category: 'General', country: 'Italy', description: 'Notizie, cronaca e attualità', language: 'it' },
    { id: 'la-repubblica', name: 'La Repubblica', category: 'General', country: 'Italy', description: 'Notizie italiane e internazionali', language: 'it' },
  ]
}

/**
 * Get the current language setting
 */
export function getCurrentLanguage() {
  const saved = localStorage.getItem('appLanguage')
  if (saved && LANGUAGES[saved]) {
    return saved
  }
  
  // Fallback to browser language
  const browserLang = navigator.language.substring(0, 2).toLowerCase()
  if (LANGUAGES[browserLang]) {
    return browserLang
  }
  
  return 'en'
}

/**
 * Get available sources for a specific language
 */
export function getSourcesByLanguage(languageCode) {
  return SOURCE_BY_LANGUAGE[languageCode] || SOURCE_BY_LANGUAGE['en']
}

/**
 * Get selected sources for a language
 */
export function getSelectedSourcesForLanguage(languageCode) {
  const stored = localStorage.getItem('selectedNewsSourcesByLanguage')
  if (!stored) return []
  
  try {
    const data = JSON.parse(stored)
    return data[languageCode] || []
  } catch {
    return []
  }
}

/**
 * Save selected sources for a language
 */
export function saveSelectedSourcesForLanguage(languageCode, sources) {
  const stored = localStorage.getItem('selectedNewsSourcesByLanguage') || '{}'
  let data = {}
  
  try {
    data = JSON.parse(stored)
  } catch {
    data = {}
  }
  
  data[languageCode] = sources
  localStorage.setItem('selectedNewsSourcesByLanguage', JSON.stringify(data))
}

/**
 * Set the current language
 */
export function setLanguage(languageCode) {
  if (LANGUAGES[languageCode]) {
    localStorage.setItem('appLanguage', languageCode)
    return true
  }
  return false
}
