import drive from '@adonisjs/drive/services/main'
import env from '#start/env'

export async function getImageUrl(path: string | null, defaultPath: string): Promise<string> {
  if (!path) return defaultPath

  // URL locale (dev)
  if (path.startsWith('/uploads/')) return path

  // Chemin S3 (prod) - générer URL signée
  if (env.get('NODE_ENV') === 'production') {
    try {
      return await drive.use('s3').getSignedUrl(path, { expiresIn: '24h' })
    } catch {
      return defaultPath
    }
  }

  return path
}
