import React, { useState, useEffect } from 'react';
import { LearnedWord, Story, WordMastery } from '@/app/lib/types';
import { Brain, Star, RotateCw, CheckCircle, XCircle, Volume2, Trophy, Dumbbell } from 'lucide-react';
import { playClick, playSuccess, playError, playPop } from '@/app/utils/soundUtils';
import { audioManager } from '@/app/services/audioManager';

interface WordMemoryGymProps {
  stories: Story[];
  mastery: WordMastery;
  onUpdateMastery: (wordId: string, success: boolean) => void;
}

export const WordMemoryGym: React.FC<WordMemoryGymProps> = ({ stories, mastery, onUpdateMastery }) => {
  const [mode, setMode] = useState<'menu' | 'quiz'>('menu');
  const [deck, setDeck] = useState<LearnedWord[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);

  // Extract unique words
  const allWords = React.useMemo(() => {
    const words: LearnedWord[] = [];
    const seen = new Set();
    stories.forEach(s => {
      if (s.learnedWords) {
        s.learnedWords.forEach(w => {
          if (!seen.has(w.id)) {
            words.push(w);
            seen.add(w.id);
          }
        });
      }
    });
    return words;
  }, [stories]);

  const startSession = () => {
    playClick();
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    setDeck(shuffled.slice(0, 5));
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSessionScore(0);
    setMode('quiz');
  };

  const handleFlip = () => {
    playPop();
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
        // Play audio when revealing answer
        audioManager.playTTS(deck[currentCardIndex].word);
    }
  };

  const handleResponse = (success: boolean) => {
    const word = deck[currentCardIndex];
    onUpdateMastery(word.id, success);
    if (success) {
        setSessionScore(prev => prev + 1);
        playSuccess();
    } else {
        playError();
    }

    if (currentCardIndex < deck.length - 1) {
      setTimeout(() => {
        setIsFlipped(false);
        setCurrentCardIndex(prev => prev + 1);
      }, 500);
    } else {
      // End of session
      setMode('menu'); 
    }
  };

  if (allWords.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-60">
        <Dumbbell size={64} className="mb-4 text-slate-300" />
        <h2 className="text-2xl font-bold text-slate-400">Gym Closed</h2>
        <p className="text-slate-400">Go find some words first!</p>
      </div>
    );
  }

  if (mode === 'menu') {
    return (
      <div className="h-full flex flex-col p-6 md:p-12 overflow-y-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-brand-orange mb-2 flex items-center justify-center gap-3">
            <Brain size={40} /> Brain Dojo
          </h2>
          <p className="text-slate-500 font-medium text-lg">Train your brain and remember your words!</p>
        </div>

        {/* Start Button */}
        <div className="flex justify-center mb-10">
          <button 
            onClick={startSession}
            className="w-full max-w-sm aspect-video bg-gradient-to-br from-brand-orange to-red-400 rounded-[2.5rem] shadow-xl text-white flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform border-4 border-white/20"
          >
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm animate-bounce-slow">
              <Dumbbell size={48} />
            </div>
            <span className="text-3xl font-black">Start Training</span>
            <span className="text-white/80 font-bold bg-black/10 px-4 py-1 rounded-full">5 Word Quiz</span>
          </button>
        </div>

        {/* Mastery Grid */}
        <h3 className="text-xl font-bold text-slate-600 mb-4 flex items-center gap-2">
            <Trophy className="text-brand-yellow" /> Mastery Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
            {allWords.map(word => {
                const level = mastery[word.id]?.level || 0;
                return (
                    <div key={word.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <img src={word.imageUrl} className="w-16 h-16 rounded-xl object-cover bg-slate-100" alt={word.word} />
                        <div>
                            <p className="font-bold text-slate-700 capitalize">{word.word}</p>
                            <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star 
                                        key={star} 
                                        size={14} 
                                        className={star <= level ? "fill-brand-yellow text-brand-yellow" : "text-slate-200"} 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    );
  }

  // QUIZ MODE
  const currentCard = deck[currentCardIndex];

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 bg-slate-50 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-slate-200">
            <div 
                className="h-full bg-brand-orange transition-all duration-500" 
                style={{ width: `${((currentCardIndex) / deck.length) * 100}%` }}
            />
        </div>

        <div className="text-center mb-6 z-10">
            <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Question {currentCardIndex + 1} / {deck.length}</h2>
        </div>

        {/* THE CARD (Perspective Container) */}
        <div 
            className="group w-full max-w-sm aspect-[3/4] perspective-1000 cursor-pointer relative z-10" 
            onClick={!isFlipped ? handleFlip : undefined}
        >
            <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                
                {/* FRONT (Image) */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-[2.5rem] shadow-2xl border-8 border-white overflow-hidden flex flex-col">
                    <div className="flex-1 relative">
                        <img src={currentCard.imageUrl} alt="Guess" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                             <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
                                 <RotateCw size={20} className="text-slate-500" />
                                 <span className="font-bold text-slate-600">Tap to Flip</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* BACK (Answer) */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-[2.5rem] shadow-2xl border-8 border-brand-orange overflow-hidden flex flex-col items-center justify-center p-6 text-center rotate-y-180" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                    <h3 className="text-4xl font-black text-slate-800 capitalize mb-4">{currentCard.word}</h3>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed mb-6">"{currentCard.definition}"</p>
                    <button onClick={(e) => { e.stopPropagation(); audioManager.playTTS(currentCard.word); }} className="p-4 bg-brand-yellow/20 text-brand-orange rounded-full mb-8">
                        <Volume2 size={32} />
                    </button>
                </div>
            </div>
        </div>

        {/* CONTROLS */}
        <div className={`mt-8 flex gap-4 transition-opacity duration-300 ${isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <button 
                onClick={() => handleResponse(false)}
                className="flex flex-col items-center gap-2 group"
            >
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-500 border-2 border-red-200 group-active:scale-95 transition-transform">
                    <XCircle size={32} />
                </div>
                <span className="font-bold text-slate-400 text-sm">Forgot</span>
            </button>

            <div className="w-8"></div> {/* Spacer */}

            <button 
                onClick={() => handleResponse(true)}
                className="flex flex-col items-center gap-2 group"
            >
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-500 border-2 border-green-200 group-active:scale-95 transition-transform">
                    <CheckCircle size={32} />
                </div>
                <span className="font-bold text-slate-400 text-sm">I Knew It!</span>
            </button>
        </div>

    </div>
  );
};