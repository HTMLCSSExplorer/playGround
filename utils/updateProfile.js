import { updateProfile } from 'firebase/auth';

export const updateUserPropfile = async (auth, user, name) => {
  try {
    await updateProfile(auth, user, {
      displayName: name || 'Anonymous',
    });
    console.log('✅User profile updated');
  } catch (upErr) {
    console.log('Error updating user`s profile', upErr.message);
    return;
  }
};
// user@user.com
