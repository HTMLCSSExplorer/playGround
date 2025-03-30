import { adminInstance } from '@/server/plugins/firebase';

export default defineEventHandler(async (event) => {
  const admin = adminInstance;
  const { email, password } = await readBody(event);

  try {
    const user = await admin.auth().createUser({
      email,
      password,
    });
    console.log('✅ New user created');
    const customToken = await admin.auth().createCustomToken(user.uid);
    return { user, customToken };
  } catch (error: any) {
    console.log('❌ Error from server creating user', error.message);
  }
});
