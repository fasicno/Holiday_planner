'use client';

import { useState, useCallback } from 'react';
import { 
  useUser, 
  useFirebase,
  setDocumentNonBlocking,
} from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc } from 'firebase/firestore';

export function useAuth() {
  const { user, isUserLoading, userError } = useUser();
  const { auth, firestore } = useFirebase();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleAuthError = (error: any) => {
    let message = 'An unknown error occurred.';
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          message = 'Invalid email or password.';
          break;
        case 'auth/email-already-in-use':
          message = 'An account already exists with this email.';
          break;
        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          message = 'Password is too weak. Please use at least 6 characters.';
          break;
        default:
          message = error.message;
          break;
      }
    }
    setAuthError(message);
  };

  const signUp = useCallback(
    async (email: string, password: string, additionalData: { firstName: string; lastName: string }) => {
      try {
        setAuthError(null);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: `${additionalData.firstName} ${additionalData.lastName}`,
        });

        const userDocRef = doc(firestore, 'users', user.uid);
        setDocumentNonBlocking(userDocRef, {
          id: user.uid,
          email: user.email,
          firstName: additionalData.firstName,
          lastName: additionalData.lastName,
          dateJoined: new Date().toISOString(),
        }, { merge: true });

      } catch (error) {
        handleAuthError(error);
      }
    },
    [auth, firestore]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setAuthError(null);
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        handleAuthError(error);
      }
    },
    [auth]
  );

  const signOut = useCallback(async () => {
    try {
      setAuthError(null);
      await firebaseSignOut(auth);
    } catch (error) {
      handleAuthError(error);
    }
  }, [auth]);

  return {
    user,
    isUserLoading,
    authError: authError || userError?.message,
    signUp,
    signIn,
    signOut,
  };
}
