'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/app/components/Layout';
import { StartScreen } from '@/app/components/StartScreen';
import { ThemeSelection } from '@/app/components/ThemeSelection';
import { CameraQuest } from '@/app/components/CameraQuest';
import { StoryBook } from '@/app/components/StoryBook';
import { StoryModeSelection } from '@/app/components/StoryModeSelection';
import { KidProfileSelector } from '@/app/components/KidProfileSelector';
import { ExplorerPassport } from '@/app/components/ExplorerPassport';
import { WordMemoryGym } from '@/app/components/WordMemoryGym';
import { StoryQuiz } from '@/app/components/StoryQuiz';
import { VocabularyList } from '@/app/components/VocabularyList'; 
import { StoryLibrary } from '@/app/components/StoryLibrary';
import { apiClient } from '@/app/utils/apiClient';
import { audioManager } from '@/app/services/audioManager';

// Local enums and types (not exported from app/lib/types)
enum AppView {
  HOME = 'HOME',
  THEME_SELECTION = 'THEME_SELECTION',
  CAMERA_QUEST = 'CAMERA_QUEST',
  VOCAB_REVIEW = 'VOCAB_REVIEW',
  KID_PROFILE = 'KID_PROFILE',
  STORY_MODE_SELECT = 'STORY_MODE_SELECT',
  STORY_SETUP = 'STORY_SETUP',
  STORY_READER = 'STORY_READER',
  STORY_QUIZ = 'STORY_QUIZ',
  CALENDAR = 'CALENDAR',
  PASSPORT = 'PASSPORT',
  WORD_MEMORY = 'WORD_MEMORY',
  VOCAB_LIST = 'VOCAB_LIST'
}

interface Story {
  id: string;
  title: string;
  themeId: string;
  date: string;
  pages: any[];
  wordsUsed: string[];
  learnedWords?: any[];
}

interface WordMastery {
  [wordId: string]: {
    level: number;
    lastReviewed: number;
  }
}

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [kidProfile, setKidProfile] = useState<any | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<any | null>(null);
  const [targetItemCount, setTargetItemCount] = useState<number>(3);
  const [learnedWords, setLearnedWords] = useState<any[]>([]);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [wordMastery, setWordMastery] = useState<WordMastery>({});

  // Audio cleanup on view change
  useEffect(() => {
    audioManager.stopAll();
  }, [currentView, hasStarted]);

  const handleStartQuest = (theme: any, count: number) => {
    setSelectedTheme(theme);
    setTargetItemCount(count);
    setCurrentView(AppView.CAMERA_QUEST);
  };

  const handleQuestComplete = (words: any[]) => {
    setLearnedWords(words);
    setCurrentView(AppView.STORY_MODE_SELECT);
  };

  const handleStoryModeSelect = async (userPrompt?: string) => {
    if (!selectedTheme || !kidProfile) return;
    setCurrentView(AppView.STORY_SETUP);
    
    try {
      const storyData = await apiClient.generateStory(learnedWords, selectedTheme, kidProfile, userPrompt);
      
      const newStory: Story = {
        id: Date.now().toString(),
        title: storyData.title,
        themeId: selectedTheme.id,
        date: new Date().toISOString(),
        pages: storyData.pages,
        wordsUsed: learnedWords.map(w => w.word),
        learnedWords: learnedWords 
      };

      setCurrentStory(newStory);
      setStories(prev => [newStory, ...prev]);
      setCurrentView(AppView.STORY_READER);

      // Background generate remaining images
      generateRemainingImages(newStory, storyData.mainCharacterVisual);
    } catch (error) {
      console.error('Error generating story:', error);
      setCurrentView(AppView.STORY_MODE_SELECT);
    }
  };

  const generateRemainingImages = async (story: Story, charVisual: string) => {
    const newPages = [...story.pages];
    for (let i = 1; i < newPages.length; i++) {
      try {
        const img = await apiClient.generateIllustration(newPages[i].text, "storybook style", charVisual);
        if (img) {
          newPages[i].imageUrl = img;
          setCurrentStory(prev => prev ? { ...prev, pages: newPages } : null);
          setStories(prev => prev.map(s => s.id === story.id ? { ...s, pages: newPages } : s));
        }
      } catch (error) {
        console.error('Error generating illustration:', error);
      }
    }
  };

  const handleUpdateMastery = (wordId: string, success: boolean) => {
    setWordMastery(prev => {
      const current = prev[wordId] || { level: 0, lastReviewed: 0 };
      let newLevel = current.level;
      if (success) newLevel = Math.min(5, newLevel + 1);
      
      return {
        ...prev,
        [wordId]: { level: newLevel, lastReviewed: Date.now() }
      };
    });
  };

  const handleOpenLibraryStory = (story: Story) => {
    setCurrentStory(story);
    setCurrentView(AppView.STORY_READER);
  };

  const handleWordAddedToStory = (newWord: any) => {
    if (!currentStory) return;

    const updatedStory = {
      ...currentStory,
      learnedWords: [...(currentStory.learnedWords || []), newWord],
      wordsUsed: [...(currentStory.wordsUsed || []), newWord.word]
    };

    setCurrentStory(updatedStory);
    setStories(prev => prev.map(s => s.id === updatedStory.id ? updatedStory : s));
  };

  if (!hasStarted) {
    return <StartScreen onStart={() => setHasStarted(true)} />;
  }

  if (!kidProfile) {
    return (
      <Layout 
        onHome={() => {}} 
        onCalendar={() => {}} 
        onPassport={() => {}} 
        onMemory={() => {}} 
        onVocab={() => {}}
      >
        <KidProfileSelector onComplete={(profile) => setKidProfile(profile)} />
      </Layout>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.HOME:
      case AppView.THEME_SELECTION:
        return <ThemeSelection onSelectTheme={handleStartQuest} />;
      
      case AppView.CAMERA_QUEST:
        return selectedTheme ? (
          <CameraQuest 
            targetCount={targetItemCount} 
            theme={selectedTheme} 
            onComplete={handleQuestComplete} 
          />
        ) : null;

      case AppView.STORY_MODE_SELECT:
        return selectedTheme ? (
          <StoryModeSelection theme={selectedTheme} onSelectMode={handleStoryModeSelect} />
        ) : null;

      case AppView.STORY_SETUP:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-pulse">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold text-brand-blue">Painting your story...</h2>
            <p className="text-slate-400">Our magic pencils are working!</p>
          </div>
        );

      case AppView.STORY_READER:
        return currentStory ? (
          <StoryBook 
            story={currentStory} 
            kidProfile={kidProfile}
            onWordAdded={handleWordAddedToStory}
            onFinish={() => {
              setCurrentView(AppView.STORY_QUIZ);
            }} 
          />
        ) : null;

      case AppView.STORY_QUIZ:
        return currentStory && currentStory.learnedWords ? (
          <StoryQuiz 
            words={currentStory.learnedWords} 
            onComplete={() => setCurrentView(AppView.PASSPORT)} 
          />
        ) : null;

      case AppView.PASSPORT:
        return <ExplorerPassport stories={stories} />;
      
      case AppView.VOCAB_LIST:
        return <VocabularyList stories={stories} />;

      case AppView.WORD_MEMORY:
        return <WordMemoryGym stories={stories} mastery={wordMastery} onUpdateMastery={handleUpdateMastery} />;
      
      case AppView.CALENDAR:
        return <StoryLibrary stories={stories} onSelectStory={handleOpenLibraryStory} />;

      default:
        return <ThemeSelection onSelectTheme={handleStartQuest} />;
    }
  };

  return (
    <Layout 
      onHome={() => setCurrentView(AppView.HOME)}
      onCalendar={() => setCurrentView(AppView.CALENDAR)}
      onPassport={() => setCurrentView(AppView.PASSPORT)}
      onMemory={() => setCurrentView(AppView.WORD_MEMORY)}
      onVocab={() => setCurrentView(AppView.VOCAB_LIST)}
      onBack={currentView !== AppView.HOME ? () => setCurrentView(AppView.HOME) : undefined}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
