
import React from 'react';
import { Home, Calendar, Map, Brain, ChevronLeft, BookImage } from 'lucide-react';
import { playClick } from '../utils/soundUtils';

interface LayoutProps {
  children: React.ReactNode;
  onHome: () => void;
  onCalendar: () => void;
  onPassport: () => void;
  onMemory: () => void;
  onVocab: () => void; 
  onBack?: () => void; 
  isProfileSetup?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, onHome, onCalendar, onPassport, onMemory, onVocab, onBack, isProfileSetup }) => {
  return (
    // Outer Wrapper: Handles background and centering. 
    // h-[100dvh] ensures full viewport height on mobile browsers with dynamic UI bars.
    <div className="h-[100dvh] w-full bg-slate-50 flex items-center justify-center font-sans text-slate-800 md:p-4 lg:p-6 overflow-hidden">
      
      {/* 
        App Container: 
        - Mobile: w-full h-full. 
        - Desktop: Rounded corners, shadow, max-width.
      */}
      <div className="w-full h-full md:max-w-[1000px] md:h-[92dvh] bg-white md:rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col md:border-[6px] md:border-white ring-1 ring-slate-200">
        
        {/* 
          Top Header 
          - Compact height for mobile (h-12 + safe area)
          - z-40 to stay above content
        */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-3 md:px-6 shrink-0 z-40 relative pt-[env(safe-area-inset-top)] pb-1 md:pb-0 min-h-[calc(3rem+env(safe-area-inset-top))] md:min-h-0 md:h-16 box-border">
            <div className="flex items-center gap-2 h-10 md:h-full w-full">
                {/* Back Button */}
                {onBack && (
                    <button 
                        onClick={() => { playClick(); onBack(); }}
                        className="p-1.5 -ml-1 mr-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-brand-blue transition-colors active:scale-95"
                    >
                        <ChevronLeft size={24} strokeWidth={3} />
                    </button>
                )}

                <div className="flex items-center gap-2 group cursor-pointer flex-1" onClick={() => { playClick(); onHome(); }}>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full overflow-hidden shadow-sm border border-slate-200 shrink-0">
                        <img src="https://cdn-icons-png.flaticon.com/512/3069/3069172.png" alt="SnapStory Panda" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h1 className="text-base md:text-xl font-black tracking-tight text-brand-blue leading-none">SnapStory</h1>
                    </div>
                </div>

                {/* Desktop Nav Title (Hidden on Mobile) */}
                <div className="hidden md:block ml-auto text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Adventure Awaits
                </div>
            </div>
        </div>

        {/* Main Content Area - Flex Grow */}
        {/* 'relative' allows absolute positioning inside (like modals) */}
        <div className="flex-1 relative w-full flex flex-col min-h-0 bg-slate-50/50 overflow-hidden">
            {children}
        </div>

        {/* Bottom Navigation Bar */}
        {!isProfileSetup && (
          <div className="bg-white border-t border-slate-100 px-1 py-1 shrink-0 z-40 flex justify-around items-center md:justify-center md:gap-12 shadow-[0_-4px_15px_rgba(0,0,0,0.02)] pb-[calc(0.25rem+env(safe-area-inset-bottom))] md:pb-2">
              <NavButton onClick={() => { playClick(); onHome(); }} icon={<Home size={20} strokeWidth={3} />} label="Home" activeColor="text-brand-blue" />
              <NavButton onClick={() => { playClick(); onPassport(); }} icon={<Map size={20} strokeWidth={3} />} label="Passport" activeColor="text-brand-green" />
              
              <NavButton onClick={() => { playClick(); onVocab(); }} icon={<BookImage size={20} strokeWidth={3} />} label="Words" activeColor="text-pink-500" />
              
              <NavButton onClick={() => { playClick(); onCalendar(); }} icon={<Calendar size={20} strokeWidth={3} />} label="Library" activeColor="text-brand-purple" />
              <NavButton onClick={() => { playClick(); onMemory(); }} icon={<Brain size={20} strokeWidth={3} />} label="Gym" activeColor="text-brand-orange" />
          </div>
        )}
      </div>
    </div>
  );
};

const NavButton: React.FC<{ onClick: () => void, icon: React.ReactNode, label: string, activeColor: string }> = ({ onClick, icon, label, activeColor }) => (
    <button 
        onClick={onClick} 
        className="flex flex-col items-center justify-center w-full md:w-auto p-1.5 md:p-2 rounded-xl transition-all active:scale-95 group"
    >
        <div className={`p-1 rounded-lg text-slate-300 group-hover:${activeColor} transition-colors duration-200 mb-0.5`}>
            {icon}
        </div>
        <span className="text-[9px] md:text-[10px] font-bold text-slate-300 uppercase tracking-wide group-hover:text-slate-500 transition-colors">{label}</span>
    </button>
);
