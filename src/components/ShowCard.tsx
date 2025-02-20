import React, { useState } from 'react';
import type { FirebaseShow } from '../types/firebase';
import { AnimatePresence, motion } from 'framer-motion';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import toast from 'react-hot-toast';
import { auth } from '../lib/firebase';
import { createPrediction } from '../lib/firestore';
import { Timestamp } from 'firebase/firestore';

interface ShowCardProps {
  show: FirebaseShow;
  theme: 'dark' | 'light';
}

export function ShowCard({ show, theme }: ShowCardProps) {
  const [prediction, setPrediction] = useState<number>(0);
  const [isPredicted, setIsPredicted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePredictionChange = (value: number | number[]) => {
    if (typeof value === 'number') {
      setPrediction(value * 250000);
    }
  };

  const handleValidatePrediction = async () => {
    if (!auth.currentUser) {
      toast.error('Vous devez être connecté pour faire un pronostic');
      return;
    }

    try {
      setIsLoading(true);
      
      await createPrediction({
        userId: auth.currentUser.uid,
        showId: show.id,
        predictionValue: prediction,
        createdAt: Timestamp.now()
      });
      
      setIsPredicted(true);
      toast.success('Pronostic enregistré avec succès !', {
        icon: '✓',
        style: {
          background: '#10B981',
          color: '#FFFFFF'
        }
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de l\'enregistrement du pronostic', {
        icon: '❌',
        style: {
          background: '#EF4444',
          color: '#FFFFFF'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cardBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const sliderTrackColor = theme === 'dark' ? '#4B5563' : '#E5E7EB';
  const sliderHandleColor = theme === 'dark' ? '#8B5CF6' : '#6D28D9';

  return (
    <div className={`${cardBgColor} rounded-xl overflow-hidden shadow-lg transition-all duration-200`}>
      <img
        src={show.imageUrl}
        alt={show.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-purple-500">{show.channel}</span>
          <div className="flex items-center text-gray-400 text-sm">
            <span>
              {show.datetime.toDate().toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
        <h3 className={`text-lg font-semibold ${textColor} mb-3`}>{show.title}</h3>
        <p className="text-sm text-gray-400 mb-6">{show.description}</p>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className={`text-sm font-medium ${textColor}`}>Audience prédite</span>
              <span className="text-sm text-purple-500 font-medium">
                {(prediction / 1000000).toFixed(2)}M
              </span>
            </div>
            
            <div className="px-2">
              <Slider
                min={0}
                max={40}
                step={0.1}
                value={prediction / 250000}
                onChange={handlePredictionChange}
                disabled={isPredicted}
                railStyle={{ backgroundColor: sliderTrackColor }}
                trackStyle={{ backgroundColor: sliderHandleColor }}
                handleStyle={{
                  borderColor: sliderHandleColor,
                  backgroundColor: sliderHandleColor
                }}
              />
              
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>0M</span>
                <span>2.5M</span>
                <span>5M</span>
                <span>7.5M</span>
                <span>10M</span>
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleValidatePrediction}
            disabled={isPredicted || isLoading}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
              isPredicted
                ? 'bg-green-500 text-white cursor-not-allowed'
                : isLoading
                ? 'bg-purple-400 text-white cursor-wait'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
            whileTap={!isPredicted && !isLoading ? { scale: 0.95 } : {}}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Validation en cours...
              </span>
            ) : isPredicted ? (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center"
              >
                Pronostic validé ✓
              </motion.span>
            ) : (
              'Valider mon pronostic'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
