import admin from 'firebase-admin';
export default defineNitroPlugin(() => {
  console.log('🔥 Starting ADMIN SDK');
  const config = useRuntimeConfig();

  const cert = JSON.parse(config.GOOGLE_APPLICATION_CREDENTIALS_JSON);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(cert),
    });
    console.log('✅ FireBase Admin started');
  } else {
    console.log('✅ FireBase Admin already started');
  }
  return { admin };
});

// ❌ ✅ 🔥 ➡️
export const adminInstance = admin;
