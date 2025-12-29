// This serverless function acts as a proxy for NewsAPI requests
// It solves the CORS issue by making API calls from the server instead of the browser
// Deployed on Vercel, this allows the Vue app to call our function instead of NewsAPI directly

export default async function handler(req, res) {
  // Get origin from request
  const origin = req.headers.origin;
  
  // Allowed origins list
  const allowedOrigins = [
    'https://matheus-c-martins.github.io',
    'http://localhost:8080',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:3000'
  ];

  // CRITICAL: Set CORS headers FIRST, before any logic
  // Check if the origin is in our allowed list
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    // For development/testing, allow all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  // Always set these headers for all requests
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    // Return 200 OK for preflight (some docs say 204, but 200 is more compatible)
    return res.status(200).end();
  }

  // Only allow GET requests for actual data
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      status: 'error',
      message: 'Method not allowed. Only GET and OPTIONS are supported.' 
    });
  }

  try {
    const { q, category, sortBy = 'publishedAt', language = 'en', page = '1', endpoint = 'top-headlines' } = req.query;

    // Get API key from environment variable (never expose in client code)
    const apiKey = process.env.VUE_APP_NEWS_API_KEY || process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      console.error('API key not found in environment variables');
      return res.status(500).json({
        status: 'error',
        message: 'API key not configured on server. Please check Vercel environment variables.'
      });
    }

    // Build the NewsAPI URL based on endpoint
    let url = `https://newsapi.org/v2/${endpoint}?`;
    
    // Add query parameters based on endpoint type
    if (endpoint === 'everything' || q) {
      url = 'https://newsapi.org/v2/everything?';
      if (q) {
        url += `q=${encodeURIComponent(q)}&`;
      }
      url += `sortBy=${sortBy}&`;
    } else {
      // top-headlines endpoint
      url = 'https://newsapi.org/v2/top-headlines?';
      if (category) {
        url += `category=${category}&`;
      }
    }

    // Common parameters
    url += `language=${language}&`;
    url += `page=${page}&`;
    url += `pageSize=20&`;
    url += `apiKey=${apiKey}`;

    console.log(`Proxying request to NewsAPI: ${url.replace(apiKey, 'API_KEY_HIDDEN')}`);

    // Make the request to NewsAPI
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'NewsHub-Proxy/1.0',
      }
    });

    const data = await response.json();

    // Log errors for debugging
    if (data.status === 'error') {
      console.error('NewsAPI returned error:', data);
    }

    // Return the response to the client with appropriate status
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Error proxying request to NewsAPI:', error);
    
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch news from server',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
