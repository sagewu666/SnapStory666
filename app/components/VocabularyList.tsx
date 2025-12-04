import React, { useState, useMemo } from 'react';
import { LearnedWord } from '../lib/types';
import { Story } from '../../types';
import { Search, Volume2, X, Grid, Filter } from 'lucide-react';
import { audioManager } from '../services/audioManager';
import { playClick } from '../utils/soundUtils';

interface VocabularyListProps {
  stories: Story[];
}

export const VocabularyList: React.FC<VocabularyListProps> = ({ stories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState<LearnedWord | null>(null);

  // Extract unique words from all stories
  const allWords = useMemo(() => {
    const uniqueWords: LearnedWord[] = [];
    const seenIds = new Set();
    
    stories.forEach(story => {
      if (story.learnedWords) {
        story.learnedWords.forEach(word => {
          // Deduplicate based on word ID or text
          if (!seenIds.has(word.word.toLowerCase())) {
            uniqueWords.push(word);
            seenIds.add(word.word.toLowerCase());
          }
        });
      }
    });
    // Sort alphabetically
    return uniqueWords.sort((a, b) => a.word.localeCompare(b.word));
  }, [stories]);

  const filteredWords = allWords.filter(w => 
    w.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayAudio = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioManager.playTTS(text);
  };

  const handleCardClick = (word: LearnedWord) => {
      playClick();
      setSelectedCard(word);
      audioManager.playTTS(word.word);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-8 bg-white border-b border-slate-100 flex flex-col gap-4 shrink-0 shadow-sm z-10">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-brand-blue flex items-center gap-3">
                        <div className="w-12 h-12 bg-pink-100 rounded-2xl rotate-3 flex items-center justify-center text-pink-500 shadow-sm border-2 border-pink-200">
                            <Grid size={28} strokeWidth={3} />
                        </div>
                        Word Cards
                    </h2>
                    <p className="text-slate-500 font-medium pl-1">Your collection: {allWords.length} words</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search your words..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-slate-600 placeholder:text-slate-400"
                />
            </div>
        </div>

        {/* Grid Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 scrollbar-hide">
            {allWords.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-center opacity-60 mt-10">
                    <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                        <Filter size={40} className="text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-400 mb-2">No words yet!</h3>
                    <p className="text-slate-400 max-w-xs mx-auto">Start a new story to find objects and build your collection.</p>
                 </div>
            ) : filteredWords.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-bold">
                    No words match "{searchTerm}"
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    {filteredWords.map((word) => (
                        <button 
                            key={word.id}
                            onClick={() => handleCardClick(word)}
                            className="bg-white rounded-2xl shadow-sm border-b-4 border-slate-100 hover:border-brand-blue hover:-translate-y-1 hover:shadow-lg transition-all group overflow-hidden flex flex-col"
                        >
                            <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
                                <img src={word.imageUrl} alt={word.word} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div 
                                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-brand-blue hover:text-white"
                                    onClick={(e) => handlePlayAudio(e, word.word)}
                                >
                                    <Volume2 size={16} />
                                </div>
                            </div>
                            <div className="p-3 w-full text-center bg-white">
                                <h3 className="font-black text-slate-700 capitalize text-lg truncate">{word.word}</h3>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Detail Modal */}
        {selectedCard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-pop-in">
                <div className="bg-white rounded-[2.5rem] w-full max-w-sm md:max-w-md shadow-2xl relative border-8 border-white overflow-hidden flex flex-col max-h-[85vh]">
                    
                    {/* Close Button */}
                    <button 
                        onClick={() => { playClick(); setSelectedCard(null); }}
                        className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Image Area */}
                    <div className="h-64 md:h-80 bg-slate-100 shrink-0 relative">
                        <img src={selectedCard.imageUrl} className="w-full h-full object-cover" alt={selectedCard.word} />
                    </div>

                    {/* Content Area */}
                    <div className="p-6 md:p-8 text-center flex-1 overflow-y-auto bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px]">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-blue capitalize mb-2 tracking-tight">{selectedCard.word}</h2>
                        
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 inline-block w-full">
                            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-1">Definition</p>
                            <p className="text-slate-700 font-medium text-lg leading-relaxed">"{selectedCard.definition}"</p>
                        </div>

                        <button 
                            onClick={(e) => handlePlayAudio(e, selectedCard.word)}
                            className="w-full py-4 bg-brand-orange text-white rounded-2xl font-bold text-xl shadow-[0_6px_0_0_#c2410c] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 hover:brightness-110"
                        >
                            <Volume2 size={28} /> Listen
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
