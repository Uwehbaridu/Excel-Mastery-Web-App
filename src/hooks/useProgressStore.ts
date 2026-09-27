import { useState, useEffect } from 'react';
import { UserProgress } from '../types/formula';

const STORAGE_KEY = 'excel_mastery_progress_v1';

const defaultProgress: UserProgress = {
  isPro: false,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedPractice: {},
  completedPuzzles: {},
  bookmarkedFunctions: ['xlookup', 'filter', 'pmt', 'groupby'],
  unlockedTiers: {
    beginner: true,
    intermediate: false,
    advanced: false,
  },
};

export function useProgressStore() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultProgress, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    }
    return defaultProgress;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  // Mark a practice example as completed
  const markPracticeCompleted = (functionId: string, exampleIndex: number) => {
    setProgress((prev) => {
      const currentList = prev.completedPractice[functionId] || [];
      if (currentList.includes(exampleIndex)) return prev;
      const updatedList = [...currentList, exampleIndex];
      return {
        ...prev,
        completedPractice: {
          ...prev.completedPractice,
          [functionId]: updatedList,
        },
      };
    });
  };

  // Mark a puzzle as completed and check progression unlocks
  const markPuzzleCompleted = (puzzleId: string, totalBeginner = 20, totalIntermediate = 25) => {
    setProgress((prev) => {
      const updated = {
        ...prev.completedPuzzles,
        [puzzleId]: true,
      };

      // Count completed in each tier (puzzle IDs start with 'p-beg-', 'p-int-', 'p-adv-')
      const beginnerCount = Object.keys(updated).filter((k) => k.startsWith('p-beg-') && updated[k]).length;
      const intermediateCount = Object.keys(updated).filter((k) => k.startsWith('p-int-') && updated[k]).length;

      // 70% of 20 = 14 beginner puzzles to unlock intermediate
      const unlockInt = prev.isPro || beginnerCount >= Math.ceil(totalBeginner * 0.7);
      // 70% of 25 = 18 intermediate puzzles to unlock advanced
      const unlockAdv = prev.isPro || (unlockInt && intermediateCount >= Math.ceil(totalIntermediate * 0.7));

      return {
        ...prev,
        completedPuzzles: updated,
        unlockedTiers: {
          beginner: true,
          intermediate: unlockInt,
          advanced: unlockAdv,
        },
      };
    });
  };

  // Toggle bookmark
  const toggleBookmark = (functionId: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedFunctions.includes(functionId);
      return {
        ...prev,
        bookmarkedFunctions: exists
          ? prev.bookmarkedFunctions.filter((id) => id !== functionId)
          : [...prev.bookmarkedFunctions, functionId],
      };
    });
  };

  // Upgrade or toggle Pro
  const setProStatus = (isPro: boolean) => {
    setProgress((prev) => ({
      ...prev,
      isPro,
      unlockedTiers: isPro
        ? { beginner: true, intermediate: true, advanced: true }
        : prev.unlockedTiers,
    }));
  };

  // Reset all progress
  const resetProgress = () => {
    setProgress(defaultProgress);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return {
    progress,
    markPracticeCompleted,
    markPuzzleCompleted,
    toggleBookmark,
    setProStatus,
    resetProgress,
  };
}
