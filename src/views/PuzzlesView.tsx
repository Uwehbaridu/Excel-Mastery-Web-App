import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Play, 
  ChevronRight, 
  ArrowLeft,
  Flame,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Puzzle, Difficulty } from '../types/formula';
import { InteractiveWorkbook } from '../components/InteractiveWorkbook';
import { BannerAdPlaceholder } from '../components/BannerAdPlaceholder';

interface PuzzlesViewProps {
  puzzles: Puzzle[];
  completedPuzzles: Record<string, boolean>;
  onCompletePuzzle: (puzzleId: string) => void;
  unlockedTiers: {
    beginner: boolean;
    intermediate: boolean;
    advanced: boolean;
  };
  isPro: boolean;
  onUpgradeClick: () => void;
}

export const PuzzlesView: React.FC<PuzzlesViewProps> = ({
  puzzles,
  completedPuzzles,
  onCompletePuzzle,
  unlockedTiers,
  isPro,
  onUpgradeClick,
}) => {
  const [selectedTier, setSelectedTier] = useState<Difficulty>('beginner');
  const [activePuzzle, setActivePuzzle] = useState<Puzzle | null>(null);

  // Group puzzles by difficulty
  const beginnerList = useMemo(() => puzzles.filter((p) => p.difficulty === 'beginner'), [puzzles]);
  const intermediateList = useMemo(() => puzzles.filter((p) => p.difficulty === 'intermediate'), [puzzles]);
  const advancedList = useMemo(() => puzzles.filter((p) => p.difficulty === 'advanced'), [puzzles]);

  const currentTierList =
    selectedTier === 'beginner'
      ? beginnerList
      : selectedTier === 'intermediate'
      ? intermediateList
      : advancedList;

  // Counts
  const beginnerDone = beginnerList.filter((p) => completedPuzzles[p.id]).length;
  const intermediateDone = intermediateList.filter((p) => completedPuzzles[p.id]).length;
  const advancedDone = advancedList.filter((p) => completedPuzzles[p.id]).length;

  const totalDone = beginnerDone + intermediateDone + advancedDone;
  const totalPuzzles = puzzles.length;
  const overallMastery = Math.round((totalDone / totalPuzzles) * 100);

  // Gating requirements
  const beginnerRequired = Math.ceil(beginnerList.length * 0.7); // 14
  const intermediateRequired = Math.ceil(intermediateList.length * 0.7); // 18

  const isTierLocked =
    selectedTier === 'intermediate'
      ? !unlockedTiers.intermediate && !isPro
      : selectedTier === 'advanced'
      ? !unlockedTiers.advanced && !isPro
      : false;

  const handleOpenPuzzle = (puzzle: Puzzle) => {
    if (isTierLocked) {
      onUpgradeClick();
      return;
    }
    setActivePuzzle(puzzle);
  };

  const handleNextPuzzle = () => {
    if (!activePuzzle) return;
    const idx = currentTierList.findIndex((p) => p.id === activePuzzle.id);
    if (idx !== -1 && idx + 1 < currentTierList.length) {
      setActivePuzzle(currentTierList[idx + 1]);
    }
  };

  const handlePreviousPuzzle = () => {
    if (!activePuzzle) return;
    const idx = currentTierList.findIndex((p) => p.id === activePuzzle.id);
    if (idx > 0) {
      setActivePuzzle(currentTierList[idx - 1]);
    }
  };

  // If active puzzle is open, render the live workbook
  if (activePuzzle) {
    const currentIdx = currentTierList.findIndex((p) => p.id === activePuzzle.id);
    return (
      <div className="max-w-4xl mx-auto px-4 py-3 pb-24">
        <button
          onClick={() => setActivePuzzle(null)}
          className="mb-3 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to {selectedTier.toUpperCase()} Challenges</span>
        </button>

        <InteractiveWorkbook
          itemTitle={activePuzzle.title}
          categoryLabel={`${activePuzzle.difficulty.toUpperCase()} CHALLENGE #${currentIdx + 1}`}
          scenario={`${activePuzzle.scenario} ${activePuzzle.prompt}`}
          dataset={activePuzzle.dataset}
          targetCell={activePuzzle.targetCell || activePuzzle.dataset.targetCell || 'C2'}
          targetResult={activePuzzle.expectedResult}
          targetResultDisplay={activePuzzle.expectedResultDisplay}
          referenceFormula={activePuzzle.targetFormula}
          hint={activePuzzle.hint}
          explanation={activePuzzle.explanation}
          isCompleted={Boolean(completedPuzzles[activePuzzle.id])}
          onComplete={() => onCompletePuzzle(activePuzzle.id)}
          currentIndex={currentIdx}
          totalCount={currentTierList.length}
          onPrevious={handlePreviousPuzzle}
          onNext={handleNextPuzzle}
          isNextLocked={false}
          onUnlockProClick={onUpgradeClick}
          onClose={() => setActivePuzzle(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto px-4 py-4 pb-24">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Challenge Track</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              80 Real-World Business Scenarios · Progression Gated
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full text-xs font-bold text-emerald-400">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalDone}/{totalPuzzles} Solved</span>
          </div>
        </div>
      </div>

      {/* Overall Mastery Stat Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-slate-100">Formula Mastery Rating</span>
          </div>
          <span className="font-mono text-lg font-black text-emerald-400">{overallMastery}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${overallMastery}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Beginner</div>
            <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
              {beginnerDone}/{beginnerList.length}
            </div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Intermediate</div>
            <div className="font-mono font-bold text-amber-400 text-sm mt-0.5">
              {intermediateDone}/{intermediateList.length}
            </div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Advanced</div>
            <div className="font-mono font-bold text-rose-400 text-sm mt-0.5">
              {advancedDone}/{advancedList.length}
            </div>
          </div>
        </div>
      </div>

      {/* Ad slot */}
      <BannerAdPlaceholder onUpgradeClick={onUpgradeClick} isPro={isPro} />

      {/* Tier Selection Buttons with Gating Indicators */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setSelectedTier('beginner')}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedTier === 'beginner'
              ? 'bg-slate-800 border-emerald-500 text-white shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-xs text-emerald-400 uppercase">Beginner</span>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">20</span>
          </div>
          <div className="text-[11px] text-slate-300 font-medium truncate">
            {beginnerDone} completed
          </div>
        </button>

        <button
          onClick={() => setSelectedTier('intermediate')}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedTier === 'intermediate'
              ? 'bg-slate-800 border-amber-500 text-white shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-xs text-amber-400 uppercase">Intermediate</span>
            <div className="flex items-center gap-1">
              {!unlockedTiers.intermediate && !isPro && <Lock className="w-3 h-3 text-amber-400" />}
              <span className="text-[10px] font-mono text-slate-400 font-semibold">25</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-300 font-medium truncate">
            {unlockedTiers.intermediate || isPro ? `${intermediateDone} completed` : 'Requires 70% Beg'}
          </div>
        </button>

        <button
          onClick={() => setSelectedTier('advanced')}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedTier === 'advanced'
              ? 'bg-slate-800 border-rose-500 text-white shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-xs text-rose-400 uppercase">Advanced</span>
            <div className="flex items-center gap-1">
              {!unlockedTiers.advanced && !isPro && <Lock className="w-3 h-3 text-rose-400" />}
              <span className="text-[10px] font-mono text-slate-400 font-semibold">35</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-300 font-medium truncate">
            {unlockedTiers.advanced || isPro ? `${advancedDone} completed` : 'Requires 70% Int'}
          </div>
        </button>
      </div>

      {/* Tier Gating Callout Banner if locked */}
      {isTierLocked && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-700/60 flex items-start justify-between gap-3 text-xs text-amber-200">
          <div className="space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{selectedTier.toUpperCase()} Challenges Locked</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Complete {selectedTier === 'intermediate' ? beginnerRequired : intermediateRequired} puzzles in the prior tier (70% threshold) or unlock all tiers instantly with Pro.
            </p>
          </div>
          <button
            onClick={onUpgradeClick}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-colors cursor-pointer"
          >
            Unlock Pro
          </button>
        </div>
      )}

      {/* Challenges List */}
      <div className="space-y-2.5">
        {currentTierList.map((puzzle, pIdx) => {
          const isDone = Boolean(completedPuzzles[puzzle.id]);

          return (
            <div
              key={puzzle.id}
              onClick={() => handleOpenPuzzle(puzzle)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isTierLocked
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850 shadow-sm'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 text-xs">
                  <span className="font-mono text-slate-400 font-semibold">#{pIdx + 1}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-[11px] text-slate-400 capitalize">{puzzle.category}</span>
                  {isDone && (
                    <>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                      </span>
                    </>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white mb-0.5">{puzzle.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                  {puzzle.scenario}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {isTierLocked ? (
                  <Lock className="w-4 h-4 text-amber-400" />
                ) : isDone ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Solve</span>
                  </button>
                )}
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
