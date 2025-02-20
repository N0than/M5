import { Timestamp } from 'firebase/firestore';

export interface FirebaseShow {
  id: string;
  title: string;
  channel: string;
  datetime: Timestamp;
  description: string;
  host: string;
  genre: string;
  imageUrl: string;
  expectedAudience?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseUser {
  id: string;
  username: string;
  avatarUrl: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings: {
    theme: 'dark' | 'light';
    emailNotifications: boolean;
    publicProfile: boolean;
    showPredictions: boolean;
  };
}

export interface FirebasePrediction {
  id: string;
  userId: string;
  showId: string;
  predictionValue: number;
  accuracy?: number;
  createdAt: Timestamp;
}
