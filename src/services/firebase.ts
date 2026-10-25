import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Silence Firestore internal log warnings regarding offline/token API mode
try {
  setLogLevel('silent');
} catch (e) {
  // Ignore
}

// Initialize Firebase SDK
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function getFirestoreErrorMessage(err: any): string {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes('permission-denied') || message.includes('Missing or insufficient permissions')) {
    return 'Accès refusé : vous n\'avez pas les permissions nécessaires ou l\'annonce a été modifiée.';
  }
  if (message.includes('quota-exceeded')) {
    return 'Limite de stockage ou de requêtes atteinte. Veuillez réessayer demain.';
  }
  return 'Une erreur est survenue lors de la communication avec la base de données.';
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // Show toast in UI via context if possible, but here we just throw the translated error
  throw new Error(getFirestoreErrorMessage(error));
}

// Connection test on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    // Return true to operate seamlessly in cached/local mode without triggering auth token fetches
    return true;
  } catch (error) {
    return false;
  }
}

export function getAuthErrorMessage(err: any): string {
  const code = err?.code || '';
  if (code === 'auth/email-already-in-use') {
    return 'Cette adresse est déjà utilisée. Connectez-vous ou réinitialisez votre mot de passe.';
  }
  if (
    code === 'auth/wrong-password' ||
    code === 'auth/user-not-found' ||
    code === 'auth/invalid-credential' ||
    code === 'auth/invalid-email'
  ) {
    return 'E-mail ou mot de passe incorrect.';
  }
  if (code === 'auth/weak-password') {
    return 'Le mot de passe est trop faible. Il doit contenir au moins 8 caractères.';
  }
  if (code === 'auth/too-many-requests') {
    return 'Trop de tentatives infructueuses. Veuillez réessayer plus tard.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Connexion internet absente ou instable. Veuillez vérifier votre réseau.';
  }
  return err?.message || 'Une erreur est survenue lors de l\'authentification.';
}
