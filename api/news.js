// This serverless function acts as a proxy for NewsAPI requests
// It solves the CORS issue by making API calls from the server instead of the browser
// Deployed on Vercel, this allows the Vue app to call our function instead of NewsAPI directly

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q, category, sortBy = 'publishedAt', language = 'en', page = '1' } = req.query;

    // Get API key from environment variable (never expose in client code)
    const apiKey = process.env.VUE_APP_NEWS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        status: 'error',
        message: 'API key not configured on server'
      });
    }

    // Build the NewsAPI URL
    let url = 'https://newsapi.org/v2/';
    if (q) {
      // Search endpoint
      url += 'everything?';
      url += `q=${encodeURIComponent(q)}&`;
    } else if (category) {
      // Top headlines endpoint with category
      url += 'top-headlines?';
      url += `category=${category}&`;
    } else {
      // Top headlines endpoint (general)
      url += 'top-headlines?';
    }

    // Add parameters
    url += `language=${language}&`;
    url += `sortBy=${sortBy}&`;
    url += `page=${page}&`;
    url += `pageSize=20&`;
    url += `apiKey=${apiKey}`;

    // Make the request to NewsAPI
    const response = await fetch(url);
    const data = await response.json();

    // Return the response to the client
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying request to NewsAPI:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch news: ' + error.message
    });
  }
}
