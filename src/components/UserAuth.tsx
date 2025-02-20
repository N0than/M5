import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { createUser } from '../lib/firestore';
import { Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

interface UserAuthProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, username: string) => void;
  error?: string;
}

export function UserAuth({ onLogin, onRegister, error }: UserAuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Créer un profil utilisateur s'il n'existe pas déjà
      await createUser(result.user.uid, {
        username: result.user.displayName || result.user.email?.split('@')[0] || '',
        avatarUrl: result.user.photoURL || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        settings: {
          theme: 'dark',
          emailNotifications: true,
          publicProfile: true,
          showPredictions: true
        }
      });

      toast.success('Connexion avec Google réussie !');
      navigate('/');
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('Erreur lors de la connexion avec Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user) throw new Error('No user data');
        toast.success('Connexion réussie !');
        navigate('/');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUser(userCredential.user.uid, {
          username,
          avatarUrl: '',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          settings: {
            theme: 'dark',
            emailNotifications: true,
            publicProfile: true,
            showPredictions: true
          }
        });
        toast.success('Inscription réussie !');
        navigate('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(isLogin ? 'Erreur de connexion' : 'Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Link to="/">
            <img
              src="https://i.ibb.co/LXvXDJX1/logo.png"
              alt="Audience Masters"
              style={{ width: '150px', height: '150px', objectFit: 'contain' }}
            />
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-8">
          {isLogin ? 'Connexion' : "Inscription"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
          
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required={!isLogin}
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-purple-600 text-white rounded-lg font-medium transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? 'Connexion...' : 'Inscription...'}
              </span>
            ) : (
              isLogin ? 'Se connecter' : "S'inscrire"
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">ou</span>
          </div>
        </div>

        <div id="buttonDiv"></div>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
}
