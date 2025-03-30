import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
export const signInUsingGoogleProvider = async (auth) => {
  const user = await signInWithPopup(auth, new GoogleAuthProvider());
  return user;
};
