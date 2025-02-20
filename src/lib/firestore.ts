import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import type { FirebaseShow, FirebaseUser, FirebasePrediction } from '../types/firebase';

// Collections
const USERS = 'users';
const SHOWS = 'shows';
const PREDICTIONS = 'predictions';

// User functions
export const createUser = async (userId: string, userData: Partial<FirebaseUser>) => {
  await setDoc(doc(db, USERS, userId), userData);
};

export const getUser = async (userId: string) => {
  const userDoc = await getDoc(doc(db, USERS, userId));
  return userDoc.data() as FirebaseUser;
};

// Show functions
export const getShows = async () => {
  const showsSnapshot = await getDocs(collection(db, SHOWS));
  return showsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseShow[];
};

export const createShow = async (showData: Omit<FirebaseShow, 'id'>) => {
  const showRef = doc(collection(db, SHOWS));
  await setDoc(showRef, showData);
  return showRef.id;
};

// Prediction functions
export const createPrediction = async (predictionData: Omit<FirebasePrediction, 'id'>) => {
  const predictionRef = doc(collection(db, PREDICTIONS));
  await setDoc(predictionRef, predictionData);
  return predictionRef.id;
};

export const getUserPredictions = async (userId: string) => {
  const q = query(
    collection(db, PREDICTIONS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const predictionsSnapshot = await getDocs(q);
  return predictionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebasePrediction[];
};
