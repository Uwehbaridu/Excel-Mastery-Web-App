import React, { useState, useMemo } from 'react';
import { 
  Lock, 
  CheckCircle2, 
  Play, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  Search,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { ExcelFunction, PracticeExample } from '../types/formula';
import { InteractiveWorkbook } from '../components/InteractiveWorkbook';

interface PracticeViewProps {
  functions: ExcelFunction[];
  activeFunction: ExcelFunction;
  onSelectFunction: (fn: ExcelFunction) => void;
  completedExampleIndices: number[]; // 0 to 8
  onCompleteExample: (funcId: string, exampleIndex: number) => void;
  isPro: boolean;
  onUpgradeClick: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  functions,
  activeFunction,
  onSelectFunction,
  completedExampleIndices,
  onCompleteExample,
  isPro,
  onUpgradeClick,
}) => {
  const [activeTier, setActiveTier] = useState<'all' | 'basic' | 'intermediate' | 'advanced'>('all');
  const [activeWorkbookExample, setActiveWorkbookExample] = useState<PracticeExample | null>(null);
  const [searchFn, setSearchFn] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const practiceExamples = activeFunction.practiceExamples;

  // Filter functions for picker dropdown
  const filteredPickList = useMemo(() => {
    if (!searchFn.trim()) return functions;
    return functions.filter(
      (f) =>
        f.name.toLowerCase().includes(searchFn.toLowerCase()) ||
        f.category.toLowerCase().includes(searchFn.toLowerCase())
    );
  }, [functions, searchFn]);

  // Filtered examples by tier
  const displayedExamples = useMemo(() => {
    if (activeTier === 'all') return practiceExamples;
    return practiceExamples.filter((ex) => ex.tier === activeTier);
  }, [practiceExamples, activeTier]);

  // Handle opening live workbook
  const handleOpenWorkbook = (ex: PracticeExample) => {
    if (ex.locked && !isPro) {
      onUpgradeClick();
      return;
    }
    setActiveWorkbookExample(ex);
  };

  const handleNextExample = () => {
    if (!activeWorkbookExample) return;
    const nextIdx = activeWorkbookExample.index + 1;
    if (nextIdx < practiceExamples.length) {
      const nextEx = practiceExamples[nextIdx];
      if (nextEx.locked && !isPro) {
        onUpgradeClick();
      } else {
        setActiveWorkbookExample(nextEx);
      }
    }
  };

  const handlePreviousExample = () => {
    if (!activeWorkbookExample) return;
    const prevIdx = activeWorkbookExample.index - 1;
    if (prevIdx >= 0) {
      setActiveWorkbookExample(practiceExamples[prevIdx]);
    }
  };

  // If active workbook is open, render the full-screen interactive workbook view
  if (activeWorkbookExample) {
    const totalExamples = practiceExamples.length;
    const isNextLocked =
      activeWorkbookExample.index < totalExamples - 1 &&
      practiceExamples[activeWorkbookExample.index + 1]?.locked &&
      !isPro;

    return (
      <div className="max-w-4xl mx-auto px-4 py-3 pb-24">
        <button
          onClick={() => setActiveWorkbookExample(null)}
          className="mb-3 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to {activeFunction.name} Scenarios</span>
        </button>

        <InteractiveWorkbook
          itemTitle={`${activeFunction.name} · ${activeWorkbookExample.title}`}
          categoryLabel={`${activeFunction.name} Function · ${activeWorkbookExample.tier.toUpperCase()}`}
          scenario={activeWorkbookExample.scenario}
          dataset={activeWorkbookExample.dataset}
          targetCell={activeWorkbookExample.targetCell || activeWorkbookExample.dataset.targetCell || 'C2'}
          targetResult={activeWorkbookExample.targetResult}
          targetResultDisplay={activeWorkbookExample.targetResultDisplay}
          referenceFormula={activeWorkbookExample.referenceFormula}
          hint={activeWorkbookExample.hint}
          explanation={activeWorkbookExample.explanation}
          isCompleted={completedExampleIndices.includes(activeWorkbookExample.index)}
          onComplete={() => onCompleteExample(activeFunction.id, activeWorkbookExample.index)}
          currentIndex={activeWorkbookExample.index}
          totalCount={totalExamples}
          onPrevious={handlePreviousExample}
          onNext={handleNextExample}
          isNextLocked={isNextLocked}
          onUnlockProClick={onUpgradeClick}
          onClose={() => setActiveWorkbookExample(null)}
        />
      </div>
    );
  }

  // Example Cards Overview Mode
  const totalExamples = practiceExamples.length;
  const completedCount = completedExampleIndices.length;
  const progressPercent = Math.round((completedCount / totalExamples) * 100);

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto px-4 py-4 pb-24">
      {/* Top Header & Function Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Live Practice Workbook</h1>
            <p className="text-xs text-slate-400">
              Interactive spreadsheet solver with real formula execution
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full font-semibold">
            {completedCount}/{totalExamples} Solved
          </span>
        </div>

        {/* Function Dropdown Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-emerald-500/80 text-left flex items-center justify-between transition-colors shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 font-mono font-bold flex items-center justify-center border border-emerald-800/80 text-xs">
                fx
              </div>
              <div>
                <div className="font-mono font-bold text-sm text-white">
                  {activeFunction.name} Function
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                  {activeFunction.syntax}
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform ${
                isDropdownOpen ? 'rotate-180 text-emerald-400' : ''
              }`}
            />
          </button>

          {/* Function Selector Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden p-2 max-h-72 flex flex-col">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchFn}
                  onChange={(e) => setSearchFn(e.target.value)}
                  placeholder="Filter functions..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="overflow-y-auto space-y-1">
                {filteredPickList.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onSelectFunction(f);
                      setIsDropdownOpen(false);
                      setSearchFn('');
                    }}
                    className={`w-full p-2 rounded-lg text-left text-xs font-mono flex items-center justify-between transition-colors ${
                      f.id === activeFunction.id
                        ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-700/60'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{f.name}</span>
                    <span className="text-[10px] text-slate-500 font-sans capitalize">
                      {f.difficulty}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar for Current Function */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Function Mastery Progress</span>
          <span className="font-mono text-emerald-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Tier Switcher Tabs: All / Basic (4 Free) / Intermediate (4) / Advanced (4 Pro) */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs select-none">
        <button
          onClick={() => setActiveTier('all')}
          className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-colors ${
            activeTier === 'all'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({totalExamples})
        </button>
        <button
          onClick={() => setActiveTier('basic')}
          className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-colors ${
            activeTier === 'basic'
              ? 'bg-slate-800 text-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Basic (4 Free)
        </button>
        <button
          onClick={() => setActiveTier('intermediate')}
          className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-colors ${
            activeTier === 'intermediate'
              ? 'bg-slate-800 text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Intermediate (4)
        </button>
        <button
          onClick={() => setActiveTier('advanced')}
          className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-colors ${
            activeTier === 'advanced'
              ? 'bg-slate-800 text-rose-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Advanced (4 Pro)
        </button>
      </div>

      {/* 9 Example Cards */}
      <div className="space-y-3">
        {displayedExamples.map((ex) => {
          const isCompleted = completedExampleIndices.includes(ex.index);
          const isLocked = ex.locked && !isPro;

          const tierColor =
            ex.tier === 'basic'
              ? 'text-emerald-400'
              : ex.tier === 'intermediate'
              ? 'text-amber-400'
              : 'text-rose-400';

          return (
            <div
              key={ex.id}
              className={`p-4 rounded-xl border transition-all ${
                isLocked
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-85'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5 text-xs">
                    <span className="font-mono text-slate-400 font-semibold">
                      #{ex.index + 1}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className={`font-semibold capitalize text-[11px] ${tierColor}`}>
                      {ex.tier}
                    </span>
                    {isCompleted && (
                      <>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 mb-1">{ex.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                    {ex.scenario}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Target:</span>
                    <code className="font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-slate-800">
                      {ex.targetResultDisplay}
                    </code>
                  </div>
                </div>

                {/* Practice or Unlock Button */}
                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  {isLocked ? (
                    <button
                      type="button"
                      onClick={onUpgradeClick}
                      className="px-3.5 py-2 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 border border-amber-700/80 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Unlock with Pro</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenWorkbook(ex)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
                        isCompleted
                          ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCompleted ? 'Review' : 'Practice'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
