const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/news/' : '/',
  devServer: {
    headers: {
      // SECURITY FIX: Content Security Policy (CSP) to prevent XSS attacks
      // This header restricts the sources from which content can be loaded
      'Content-Security-Policy': [
        "default-src 'self'",                    // Only allow resources from same origin
        "script-src 'self' 'unsafe-inline'",     // Allow inline scripts (needed for Vue dev server)
        "style-src 'self' 'unsafe-inline'",      // Allow inline styles
        "img-src 'self' https: data:",           // Allow images from HTTPS and data URIs
        "font-src 'self' data:",                 // Allow fonts from same origin and data URIs
        "connect-src 'self' https://newsapi.org", // Allow API calls to NewsAPI
        "frame-ancestors 'none'",                // Prevent framing (clickjacking protection)
        "base-uri 'self'",                       // Restrict base tag
        "form-action 'self'"                     // Restrict form submissions
      ].join('; '),
      
      // SECURITY: X-Content-Type-Options header prevents MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // SECURITY: X-Frame-Options header prevents clickjacking attacks
      'X-Frame-Options': 'DENY',
      
      // SECURITY: X-XSS-Protection header enables browser XSS protection
      'X-XSS-Protection': '1; mode=block',
      
      // SECURITY: Referrer-Policy controls referrer information
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  
  // For production builds (if using history mode with express or similar)
  configureWebpack: {
    optimization: {
      usedExports: true
    }
  }
})