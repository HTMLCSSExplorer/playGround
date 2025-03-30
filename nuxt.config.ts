// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: false,
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  devServer: {
    host: '192.168.1.25',
  },
  runtimeConfig: {
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    GOOGLE_APPLICATION_CREDENTIALS_JSON:
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,

    public: {
      recaptchaKey: process.env.CAPTCHA_SITE_KEY,
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId,
    },
  },
  router: {
    middleware: ['auth'], // Ensure it does not run during SSR
  },

  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    'nuxt-vuefire',
    '@vueuse/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: true,
    },
    config: {
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId,
    },
  },
});
