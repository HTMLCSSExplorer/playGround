import { doc, setDoc } from 'firebase/firestore';

export const newFireStoreDB = async (db, user, email, name) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    if (!user) return;
    await setDoc(
      userRef,
      {
        email,
        name,
        createdAt: new Date(),
      },
      { merge: true }
    );
    console.log('✅New DB created and assigned');
  } catch (dbErr) {
    console.log('Error creating and assigning DB', dbErr);
    return;
  }

  // user@user.com
};
