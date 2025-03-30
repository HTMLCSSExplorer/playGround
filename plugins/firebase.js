import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public
  // ✅ Ensure Firebase is initialized only once
  const app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
      });

  console.log('✅ Firebase client Started');

  const auth = getAuth(app);
  const db = getFirestore(app);

  // ✅ Prevent duplicate AppCheck initialization
  if (!globalThis._appCheckInitialized) {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(config.recaptchaKey),
      isTokenAutoRefreshEnabled: true, // Auto-refresh token
    });

    globalThis._appCheckInitialized = true; // Store flag globally
    console.log('✅ AppCheck Initialized');
  } else {
    console.log('🔄 AppCheck Already Initialized');
  }

  // Provide Firebase instances globally in Nuxt
  nuxtApp.vueApp.provide('auth', auth);
  nuxtApp.vueApp.provide('db', db);
});
