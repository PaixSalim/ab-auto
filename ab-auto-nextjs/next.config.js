/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuration pour Hostinger
  output: 'standalone',
  
  // Configuration des images
  images: {
    domains: [
      'localhost',
      'your-domain.com',
      'res.cloudinary.com'
    ],
    unoptimized: true // Important pour Hostinger
  },
  
  // Configuration CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
  
  // Configuration des variables d'environnement
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Configuration pour les fichiers statiques
  trailingSlash: true,
  
  // Configuration pour le déploiement
  distDir: '.next',
  
  // Configuration pour les API routes
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}

module.exports = nextConfig
