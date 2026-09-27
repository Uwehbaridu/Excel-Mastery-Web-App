/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { allExcelFunctions } from './data/functionsData';
import { allPuzzles } from './data/puzzlesData';
import { useProgressStore } from './hooks/useProgressStore';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { BrowseView } from './views/BrowseView';
import { PracticeView } from './views/PracticeView';
import { PuzzlesView } from './views/PuzzlesView';
import { ProfileProView } from './views/ProfileProView';
import { ProUpgradeModal } from './components/ProUpgradeModal';
import { ExcelFunction } from './types/formula';
import { Flame, Crown, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('browse');
  const [activeFunction, setActiveFunction] = useState<ExcelFunction>(allExcelFunctions[0]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const {
    progress,
    markPracticeCompleted,
    markPuzzleCompleted,
    toggleBookmark,
    setProStatus,
    resetProgress,
  } = useProgressStore();

  const handleSelectForPractice = (func: ExcelFunction) => {
    setActiveFunction(func);
    setCurrentTab('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Application Bar (1-row 3-zone contract) */}
      <header className="sticky top-0 z-30 h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white font-mono shadow-md shadow-emerald-950">
            fx
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
            Excel Formula Mastery
          </span>
        </div>

        {/* Zone 2: Editorial Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
          <button
            onClick={() => setCurrentTab('browse')}
            className={`transition-colors hover:text-white ${currentTab === 'browse' ? 'text-emerald-400' : ''}`}
          >
            Reference Library
          </button>
          <button
            onClick={() => setCurrentTab('practice')}
            className={`transition-colors hover:text-white ${currentTab === 'practice' ? 'text-emerald-400' : ''}`}
          >
            Live Workbook
          </button>
          <button
            onClick={() => setCurrentTab('puzzles')}
            className={`transition-colors hover:text-white ${currentTab === 'puzzles' ? 'text-emerald-400' : ''}`}
          >
            80 Challenges
          </button>
          <button
            onClick={() => setCurrentTab('profile')}
            className={`transition-colors hover:text-white ${currentTab === 'profile' ? 'text-emerald-400' : ''}`}
          >
            Pro & Cheat-Sheets
          </button>
        </nav>

        {/* Zone 3: Quick Action / Streak & Pro Tag */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-full text-xs font-bold text-amber-400">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{progress.streakDays}d</span>
          </div>

          {progress.isPro ? (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Crown className="w-3 h-3 fill-amber-400" /> PRO
            </span>
          ) : (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-sm flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Pro</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 w-full">
        {currentTab === 'browse' && (
          <BrowseView
            functions={allExcelFunctions}
            bookmarkedIds={progress.bookmarkedFunctions}
            onToggleBookmark={toggleBookmark}
            onSelectForPractice={handleSelectForPractice}
            onUpgradeClick={() => setIsUpgradeModalOpen(true)}
            isPro={progress.isPro}
          />
        )}

        {currentTab === 'practice' && (
          <PracticeView
            functions={allExcelFunctions}
            activeFunction={activeFunction}
            onSelectFunction={setActiveFunction}
            completedExampleIndices={progress.completedPractice[activeFunction.id] || []}
            onCompleteExample={markPracticeCompleted}
            isPro={progress.isPro}
            onUpgradeClick={() => setIsUpgradeModalOpen(true)}
          />
        )}

        {currentTab === 'puzzles' && (
          <PuzzlesView
            puzzles={allPuzzles}
            completedPuzzles={progress.completedPuzzles}
            onCompletePuzzle={markPuzzleCompleted}
            unlockedTiers={progress.unlockedTiers}
            isPro={progress.isPro}
            onUpgradeClick={() => setIsUpgradeModalOpen(true)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileProView
            progress={progress}
            functions={allExcelFunctions}
            onToggleBookmark={toggleBookmark}
            onSetPro={setProStatus}
            onResetProgress={resetProgress}
            onSelectFunctionForPractice={handleSelectForPractice}
            onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
          />
        )}
      </main>

      {/* Bottom Navigation Anchor */}
      <BottomNavBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isPro={progress.isPro}
      />

      {/* Pro Upgrade Gate Modal */}
      <ProUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        isPro={progress.isPro}
        onUpgrade={() => setProStatus(true)}
      />
    </div>
  );
}
