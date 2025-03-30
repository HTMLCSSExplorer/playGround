import { signInWithCustomToken } from 'firebase/auth';

export const signInWithCustomtoken = async (auth, customToken) => {
  try {
   
    await signInWithCustomToken(auth, customToken);
    console.log('✅User signed in');
  } catch (err) {
    console.log('Error signing the user in ', err.message);
    return;
  }
};
