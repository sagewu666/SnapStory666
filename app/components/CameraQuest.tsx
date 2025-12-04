
import React, { useState, useRef } from 'react';
import { Camera, Check, RefreshCw, Loader2, ArrowRight, Volume2, Mic, X, Star, Trash2, AlertCircle } from 'lucide-react';
import { LearnedWord, Theme } from '@/app/lib/types';
import { apiClient } from '@/app/utils/apiClient';
import { playClick, playSuccess, playError, playPop, playFanfare } from '@/app/utils/soundUtils';
import { audioManager } from '@/app/services/audioManager';

interface CameraQuestProps {
  targetCount: number;
  theme: Theme;
  onComplete: (words: LearnedWord[]) => void;
}

export const CameraQuest: React.FC<CameraQuestProps> = ({ targetCount, theme, onComplete }) => {
  const [items, setItems] = useState<LearnedWord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewItem, setPreviewItem] = useState<LearnedWord | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showMicFeedback, setShowMicFeedback] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [validationError, setValidationError] = useState<{ feedback: string, image: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playClick();
    setIsProcessing(true);
    setValidationError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const result = await apiClient.identifyObject(base64, theme);
      
      if (!result.matchesTheme) {
          playError();
          setIsProcessing(false);
          setValidationError({
              feedback: result.feedback || `That doesn't look like ${theme.label}! Try again.`,
              image: base64
          });
          playAudio(result.feedback || `That is not ${theme.label}. Try again.`);
          return;
      }

      const newItem: LearnedWord = {
        id: Date.now().toString(),
        word: result.word,
        definition: result.definition,
        imageUrl: base64,
        originalImage: base64,
        timestamp: Date.now(),
        visualDetail: result.visualDetail
      };

      setItems(prev => [...prev, newItem]);
      setPreviewItem(newItem);
      setIsProcessing(false);
      playSuccess();
      playAudio(`You found a ${result.word}!`);
    };
    reader.readAsDataURL(file);
  };

  const triggerCamera = () => {
    playClick();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const playAudio = async (text: string) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    try {
        const audioData = await apiClient.generateSpeech(text);
        if (audioData) {
            await audioManager.playGeminiAudio(audioData);
        } else {
            audioManager.playTTS(text);
        }
    } catch (e) {
        console.error(e);
        audioManager.playTTS(text);
    } finally {
        setIsPlayingAudio(false);
    }
  };

  const startListening = () => {
    playClick();
    setIsRecording(true);
    setTimeout(() => {
        setIsRecording(false);
        setShowMicFeedback(true);
        playSuccess();
        setTimeout(() => setShowMicFeedback(false), 2000);
    }, 2000);
  };

  const deleteItem = (id: string) => {
      playError();
      setItems(prev => prev.filter(i => i.id !== id));
      if (previewItem?.id === id) {
          setPreviewItem(null);
      }
  };

  const closePreview = () => {
      playClick();
      setPreviewItem(null);
  };

  const closeValidationError = () => {
      playClick();
      setValidationError(null);
  };

  if (items.length >= targetCount && !previewItem && !isProcessing && !validationError) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-pop-in bg-slate-50">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Check size={48} strokeWidth={4} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Quest Complete!</h2>
        <p className="text-lg text-slate-500 mb-8">You found all {targetCount} items!</p>
        <button 
          onClick={() => { playFanfare(); onComplete(items); }}
          className="px-8 py-4 bg-brand-blue text-white rounded-full font-bold text-xl shadow-xl hover:scale-105 transition-transform flex items-center gap-3"
        >
          Create Story <ArrowRight />
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden">
      
      {/* Compact Header */}
      <div className="flex justify-between items-center px-4 py-3 shrink-0 bg-white border-b border-slate-100 z-10">
        <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center text-2xl">
                 {theme.icon}
             </div>
             <div>
                <h2 className="text-base font-bold text-slate-800 leading-tight">{theme.label}</h2>
                <p className="text-xs text-slate-500 line-clamp-1">{theme.description}</p>
             </div>
        </div>
        <div className="bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap border border-slate-200">
          <span className="text-lg font-black text-brand-orange">{items.length}</span>
          <span className="text-slate-400 text-sm font-bold"> / {targetCount}</span>
        </div>
      </div>

      {/* Main Camera Area - Takes Maximum Space */}
      <div className="flex-1 min-h-0 p-3 flex flex-col">
        <div className="flex-1 w-full bg-slate-200 rounded-3xl border-4 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden group active:bg-slate-300 transition-colors shadow-inner" onClick={triggerCamera}>
            <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            />

            {isProcessing ? (
            <div className="text-center z-10">
                <Loader2 size={48} className="animate-spin text-brand-blue mb-4 mx-auto" />
                <p className="text-lg font-bold text-slate-600 bg-white/80 px-4 py-1 rounded-full">Identifying...</p>
            </div>
            ) : (
            <div className="text-center cursor-pointer flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 text-brand-blue animate-pulse">
                     <Camera size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-600">Tap to Snap</h3>
            </div>
            )}
        </div>
      </div>

      {/* Compact Found Items Strip */}
      <div className="h-20 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto px-4 py-2 shrink-0 scrollbar-hide items-center">
        {items.map((item) => (
          <div key={item.id} className="min-w-[60px] w-14 h-14 bg-slate-100 rounded-lg shadow-sm border border-slate-200 relative animate-pop-in shrink-0">
            <img src={item.imageUrl} alt={item.word} className="w-full h-full object-cover rounded-lg" />
            <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5 shadow-sm">
              <Check size={8} strokeWidth={4} />
            </div>
          </div>
        ))}
        {Array.from({ length: targetCount - items.length }).map((_, i) => (
          <div key={i} className="min-w-[60px] w-14 h-14 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center opacity-50 shrink-0">
            <span className="text-sm font-bold text-slate-300">{i + 1 + items.length}</span>
          </div>
        ))}
      </div>

      {/* --- VALIDATION ERROR MODAL --- */}
      {validationError && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-6 animate-shake">
            <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl relative flex flex-col items-center p-6 text-center border-4 border-white">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500 shrink-0">
                    <AlertCircle size={32} strokeWidth={3} />
                </div>
                
                <h2 className="text-2xl font-black text-slate-800 mb-2">Oops!</h2>
                
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-200 mb-4 rotate-2 shadow-sm">
                    <img src={validationError.image} className="w-full h-full object-cover" alt="Wrong item" />
                </div>

                <p className="text-red-600 font-bold text-base leading-snug mb-6 bg-red-50 p-3 rounded-xl w-full">"{validationError.feedback}"</p>

                <button 
                    onClick={closeValidationError}
                    className="w-full py-3 bg-brand-orange text-white rounded-xl font-bold text-lg shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw size={20} /> Try Again
                </button>
            </div>
          </div>
      )}

      {/* --- PREVIEW MODAL --- */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-pop-in">
           <div className="bg-white rounded-[2rem] w-full max-w-xs md:max-w-sm overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]">
              
              <div className="h-48 bg-slate-100 relative shrink-0">
                  <img src={previewItem.imageUrl} className="w-full h-full object-cover" alt="Captured" />
                  <button 
                        onClick={() => playAudio(previewItem.word)} 
                        className="absolute bottom-3 right-3 p-3 bg-brand-yellow rounded-full text-brand-blue shadow-lg hover:scale-110 transition-transform"
                    >
                        <Volume2 size={24} />
                    </button>
              </div>

              <div className="p-6 text-center flex flex-col items-center overflow-y-auto flex-1">
                  <h2 className="text-3xl font-black text-brand-blue capitalize mb-2">{previewItem.word}</h2>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed mb-6 bg-slate-50 p-3 rounded-xl w-full">
                      "{previewItem.definition}"
                  </p>

                  <div className="flex gap-3 w-full mt-auto">
                      <button 
                        onClick={() => deleteItem(previewItem.id)}
                        className="p-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                         <Trash2 size={24} />
                      </button>
                      
                      <button 
                        onClick={closePreview}
                        className="flex-1 py-3 bg-brand-green text-white rounded-xl font-bold text-xl shadow-[0_4px_0_0_#166534] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
                      >
                        Keep It! <Check size={24} strokeWidth={3} />
                      </button>
                  </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
