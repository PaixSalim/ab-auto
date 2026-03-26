import env from '#start/env'
import { defineConfig, services } from '@adonisjs/drive'

const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK'),

  services: {
    // Disque local pour le développement
    local: services.fs({
      location: './public/uploads',
      visibility: 'public',
    }),

    // Backblaze B2 pour la production
    s3: services.s3({
      credentials: {
        accessKeyId: env.get('S3_KEY'),
        secretAccessKey: env.get('S3_SECRET'),
      },
      region: 'us-east-005',
      bucket: env.get('S3_BUCKET'),
      endpoint: 'https://s3.us-east-005.backblazeb2.com',
      visibility: 'private',
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}