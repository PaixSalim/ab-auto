/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data dto.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),
  // GEMINI_API_KEY: Env.schema.string(),
  

  /*
  |----------------------------------------------------------
  | Variables for configuring the drive package
  |----------------------------------------------------------
  */
  // DRIVE_DISK: Env.schema.enum(['r2'] as const),
  // R2_KEY: Env.schema.string(),
  // R2_SECRET: Env.schema.string(),
  // R2_BUCKET: Env.schema.string(),
  // R2_ENDPOINT: Env.schema.string(),
GEMINI_API_KEY: Env.schema.string.optional(),
GROQ_API_KEY: Env.schema.string.optional(),
DRIVE_DISK: Env.schema.string.optional(),
R2_KEY: Env.schema.string.optional(),
R2_SECRET: Env.schema.string.optional(),
R2_BUCKET: Env.schema.string.optional(),
R2_ENDPOINT: Env.schema.string.optional(),
SMTP_HOST: Env.schema.string.optional(),
SMTP_PORT: Env.schema.number.optional(),
MAIL_FROM_ADDRESS: Env.schema.string.optional(),
MAIL_TO_ADDRESS: Env.schema.string.optional(),
MAIL_TO_ADDRESS1: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the mail package
  |----------------------------------------------------------
  */
  // SMTP_HOST: Env.schema.string(),
  // SMTP_PORT: Env.schema.string(),
  // MAIL_FROM_ADDRESS: Env.schema.string(),
  // MAIL_TO_ADDRESS: Env.schema.string(),
  // MAIL_TO_ADDRESS1: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),
})
