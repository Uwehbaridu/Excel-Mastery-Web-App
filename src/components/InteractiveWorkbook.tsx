import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { GridDataset, PracticeExample, Puzzle } from '../types/formula';
import { FormulaBar } from './FormulaBar';
import { SpreadsheetGrid } from './SpreadsheetGrid';
import { evaluateFormula, EvaluationResult, extractReferencedCells } from '../utils/formulaEvaluator';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface InteractiveWorkbookProps {
  itemTitle: string;
  categoryLabel?: string;
  scenario: string;
  dataset: GridDataset;
  targetCell?: string;
  targetResult: any;
  targetResultDisplay: string;
  referenceFormula: string;
  hint: string;
  explanation: string;
  isCompleted?: boolean;
  onComplete: () => void;
  // Navigation between examples
  currentIndex?: number;
  totalCount?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  isNextLocked?: boolean;
  onUnlockProClick?: () => void;
  onClose?: () => void;
}

export const InteractiveWorkbook: React.FC<InteractiveWorkbookProps> = ({
  itemTitle,
  categoryLabel,
  scenario,
  dataset,
  targetCell,
  targetResult,
  targetResultDisplay,
  referenceFormula,
  hint,
  explanation,
  isCompleted = false,
  onComplete,
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
  isNextLocked = false,
  onUnlockProClick,
  onClose,
}) => {
  // Empty blank formula bar by default
  const [formulaInput, setFormulaInput] = useState('');
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Directly derive referenced cells from formula input without extra states or effects
  const referencedCells = useMemo(() => {
    return extractReferencedCells(formulaInput).allCellKeys;
  }, [formulaInput]);

  // Reset state when dataset or scenario changes
  useEffect(() => {
    setFormulaInput('');
    setEvalResult(null);
    setShowHint(false);
    setShowAnswer(false);
  }, [scenario, targetResultDisplay]);

  const handleRun = () => {
    if (!formulaInput.trim()) return;
    setIsRunning(true);

    const res = evaluateFormula(formulaInput, dataset, targetResult);
    setEvalResult(res);
    setIsRunning(false);

    if (res.isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6'],
      });
      onComplete();
    }
  };

  const handleCellClick = (coord: string) => {
    // Append or start formula with cell coordinate
    if (!formulaInput) {
      setFormulaInput(`=${coord}`);
    } else {
      setFormulaInput((prev) => `${prev}${coord}`);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-4xl mx-auto pb-4">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              {categoryLabel && <span>{categoryLabel}</span>}
              {currentIndex !== undefined && totalCount !== undefined && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-emerald-400 font-medium">
                    {currentIndex + 1} of {totalCount}
                  </span>
                </>
              )}
              {isCompleted && (
                <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 truncate">{itemTitle}</h2>
          </div>
        </div>

        {/* Prev / Next buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onPrevious && (
            <button
              onClick={onPrevious}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Previous Example"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {onNext && (
            <button
              onClick={isNextLocked ? onUnlockProClick : onNext}
              disabled={currentIndex !== undefined && totalCount !== undefined && currentIndex >= totalCount - 1}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                isNextLocked
                  ? 'bg-amber-950/60 border-amber-700/70 text-amber-300 hover:bg-amber-900/80'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none'
              }`}
              title={isNextLocked ? 'Next (Pro Locked)' : 'Next Example'}
            >
              {isNextLocked && <Lock className="w-3.5 h-3.5 text-amber-400" />}
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Case Scenario & Target Goal Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1 max-w-xl">
          <div className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
            Task Instructions
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">{scenario}</p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4 shrink-0">
          <span className="text-[11px] text-slate-400 uppercase font-medium">Target Result</span>
          <span className="font-mono text-base font-bold text-amber-300 bg-amber-950/50 px-2.5 py-1 rounded-md border border-amber-800/60">
            {targetResultDisplay}
          </span>
        </div>
      </div>

      {/* Live Spreadsheet Grid */}
      <SpreadsheetGrid
        dataset={dataset}
        referencedCells={referencedCells}
        targetCell={targetCell || dataset.targetCell || 'C2'}
        computedValue={evalResult?.success ? evalResult.value : undefined}
        isCorrect={evalResult?.isCorrect}
        onCellClick={handleCellClick}
      />

      {/* Real-time Syntax-Highlighted Formula Bar */}
      <FormulaBar
        value={formulaInput}
        onChange={setFormulaInput}
        onRun={handleRun}
        isRunning={isRunning}
        activeCellLabel={targetCell || dataset.targetCell || 'C2'}
      />

      {/* Feedback & Result Card */}
      {evalResult && (
        <div
          className={`rounded-xl border p-3.5 sm:p-4 transition-all ${
            evalResult.isCorrect
              ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200'
              : 'bg-rose-950/30 border-rose-600/70 text-rose-200'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              {evalResult.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold text-sm">
                  {evalResult.isCorrect ? 'Correct! Target Achieved' : 'Incorrect Result'}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Your Output:{' '}
                  <span className="font-mono font-semibold text-white px-1.5 py-0.5 rounded bg-black/40 border border-slate-700">
                    {evalResult.displayValue || '(empty)'}
                  </span>
                  {!evalResult.isCorrect && (
                    <span className="ml-2 text-slate-400">
                      (Expected: <span className="font-mono text-amber-300">{targetResultDisplay}</span>)
                    </span>
                  )}
                </div>
                {evalResult.error && (
                  <p className="text-xs text-rose-300 mt-1 font-mono">{evalResult.error}</p>
                )}
              </div>
            </div>

            {/* Hint & Reveal buttons when incorrect */}
            {!evalResult.isCorrect && (
              <div className="flex items-center gap-1.5 shrink-0">
                {!showHint && (
                  <button
                    type="button"
                    onClick={() => setShowHint(true)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-amber-300 hover:bg-slate-700 transition-colors flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Hint</span>
                  </button>
                )}
                {!showAnswer && (
                  <button
                    type="button"
                    onClick={() => setShowAnswer(true)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Reveal</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Contextual Hint Display */}
          {showHint && !evalResult.isCorrect && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-amber-200 bg-amber-950/30 p-2.5 rounded-lg border border-amber-800/50">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Formula Hint: </span>
                {hint}
              </div>
            </div>
          )}

          {/* Reveal Answer comparison */}
          {(showAnswer || evalResult.isCorrect) && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-400">Book Reference Formula:</span>
                <code className="font-mono font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  {referenceFormula}
                </code>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">{explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
