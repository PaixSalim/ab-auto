import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    notification: (ctx) => ctx.session.flashMessages.get('notification'),
    auth: (ctx) => ({
      user: ctx.auth.user ? {
        id: ctx.auth.user.id,
        email: ctx.auth.user.email,
        fullName: ctx.auth.user.fullName,
        role: ctx.auth.user.role,
      } : null,
    }),
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: true,
    entrypoint: 'inertia/app/ssr.ts'
  }
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}