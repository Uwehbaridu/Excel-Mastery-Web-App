import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { GridDataset, PracticeExample, Puzzle } from '../types/formula';
import { FormulaBar } from './FormulaBar';
import { SpreadsheetGrid } from './SpreadsheetGrid';
import { CellNavigator } from './CellNavigator';
import { 
  evaluateFormula, 
  EvaluationResult, 
  extractReferencedCells,
  parseCellAddress,
  indexToColLetter,
  getCellValue
} from '../utils/formulaEvaluator';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Sparkles,
  BookOpen,
  X
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
  // Live editable dataset clone
  const [gridData, setGridData] = useState<GridDataset>(dataset);
  const defaultTarget = targetCell || dataset.targetCell || 'C2';
  const [activeCell, setActiveCell] = useState<string>(defaultTarget);
  const [activeEditCell, setActiveEditCell] = useState<string | null>(null);
  const [cellFormulas, setCellFormulas] = useState<Record<string, string>>({});

  // Dynamic Array Spilling state
  const [spillInfo, setSpillInfo] = useState<
    Record<string, { root: string; coords: string[]; formula: string }>
  >({});
  const [spillChildMap, setSpillChildMap] = useState<Record<string, string>>({}); // childCoord -> rootCoord

  const spillCells = useMemo(() => {
    const set = new Set<string>();
    Object.values(spillInfo).forEach((s) => s.coords.forEach((c) => set.add(c)));
    return set;
  }, [spillInfo]);

  const spillRoots = useMemo(() => {
    return new Set(Object.keys(spillInfo));
  }, [spillInfo]);

  // Formula bar value
  const [formulaInput, setFormulaInput] = useState('');
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Popup message notifying user they can edit worksheets
  const [showSmartTip, setShowSmartTip] = useState(true);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Directly derive referenced cells from formula input without extra states or effects
  const referencedCells = useMemo(() => {
    return extractReferencedCells(formulaInput).allCellKeys;
  }, [formulaInput]);

  // Reset state when dataset or scenario changes
  useEffect(() => {
    setGridData(JSON.parse(JSON.stringify(dataset)));
    const target = targetCell || dataset.targetCell || 'C2';
    setActiveCell(target);
    setActiveEditCell(null);
    setCellFormulas({});
    setSpillInfo({});
    setSpillChildMap({});
    setFormulaInput('');
    setEvalResult(null);
    setShowHint(false);
    setShowAnswer(false);
    setShowSmartTip(true);

    const timer = setTimeout(() => {
      setShowSmartTip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [scenario, targetResultDisplay, currentIndex, dataset, targetCell]);

  // Auto-clear toast notice
  useEffect(() => {
    if (toastNotice) {
      const t = setTimeout(() => setToastNotice(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastNotice]);

  // Select a cell and sync the formula bar with its exact content
  const selectCell = (coord: string) => {
    setActiveCell(coord);
    setActiveEditCell(null);

    // If this cell has a formula, show the formula in the formula bar
    if (cellFormulas[coord]) {
      setFormulaInput(cellFormulas[coord]);
    } else if (spillChildMap[coord]) {
      // Cell is part of a spilled dynamic array
      const root = spillChildMap[coord];
      setFormulaInput(cellFormulas[root] || '');
    } else {
      // Normal cell value (e.g. 'Boy', 250, or empty '')
      const val = getCellValue(gridData, coord);
      setFormulaInput(val !== null && val !== undefined ? String(val) : '');
    }
  };

  // Direct cell update in gridData (with automatic row/column expansion)
  const updateCellDirect = (coord: string, val: string | number | boolean | null) => {
    const parsed = parseCellAddress(coord);
    if (!parsed) return;
    const { colIndex, rowIndex } = parsed;

    let storedVal: any = val;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed === '') {
        storedVal = '';
      } else if (!isNaN(Number(trimmed)) && !trimmed.startsWith('0x')) {
        storedVal = Number(trimmed);
      } else if (trimmed.toUpperCase() === 'TRUE') {
        storedVal = true;
      } else if (trimmed.toUpperCase() === 'FALSE') {
        storedVal = false;
      }
    }

    setGridData((prev) => {
      const next = {
        ...prev,
        columns: [...prev.columns],
        headers: [...prev.headers],
        rows: prev.rows.map((r) => [...r]),
      };

      // Expand columns if needed
      while (next.columns.length <= colIndex) {
        next.columns.push(indexToColLetter(next.columns.length));
        next.headers.push('');
      }

      if (rowIndex < 0) {
        // Header row
        next.headers[colIndex] = String(storedVal);
      } else {
        // Expand rows if needed
        while (next.rows.length <= rowIndex) {
          next.rows.push(new Array(next.columns.length).fill(''));
        }
        while (next.rows[rowIndex].length <= colIndex) {
          next.rows[rowIndex].push('');
        }
        next.rows[rowIndex][colIndex] = storedVal;
      }
      return next;
    });
  };

  // Clear previous dynamic array spill generated by a root cell
  const clearPreviousSpill = (rootCoord: string) => {
    setSpillInfo((prev) => {
      const existing = prev[rootCoord];
      if (!existing) return prev;

      const oldCoords = existing.coords;
      setGridData((currentGrid) => {
        const next = {
          ...currentGrid,
          columns: [...currentGrid.columns],
          headers: [...currentGrid.headers],
          rows: currentGrid.rows.map((r) => [...r]),
        };
        oldCoords.forEach((c) => {
          const p = parseCellAddress(c);
          if (p && p.rowIndex >= 0 && p.rowIndex < next.rows.length) {
            if (p.colIndex < next.rows[p.rowIndex].length) {
              next.rows[p.rowIndex][p.colIndex] = '';
            }
          }
        });
        return next;
      });

      setSpillChildMap((currentChildMap) => {
        const nextMap = { ...currentChildMap };
        oldCoords.forEach((c) => delete nextMap[c]);
        return nextMap;
      });

      const nextInfo = { ...prev };
      delete nextInfo[rootCoord];
      return nextInfo;
    });
  };

  // Handle dynamic array spill into worksheet (like Excel UNIQUE, FILTER, SORT, SEQUENCE)
  const handleSpillResult = (rootCoord: string, formulaStr: string, arr: any[]) => {
    const parsed = parseCellAddress(rootCoord);
    if (!parsed) return;
    const { colIndex: startCol, rowIndex: startRow } = parsed;
    const startRowNum = startRow + 2;

    const is2D = arr.length > 0 && Array.isArray(arr[0]);
    const spillCoords: string[] = [];
    const updates: { coord: string; val: any; col: number; row: number }[] = [];

    if (is2D) {
      arr.forEach((rowArr: any[], rIdx: number) => {
        const rNum = startRowNum + rIdx;
        rowArr.forEach((cellVal: any, cIdx: number) => {
          const cNum = startCol + cIdx;
          const cLetter = indexToColLetter(cNum);
          const coord = `${cLetter}${rNum}`;
          spillCoords.push(coord);
          updates.push({ coord, val: cellVal, col: cNum, row: rNum - 2 });
        });
      });
    } else {
      // 1D array spills vertically downwards
      arr.forEach((itemVal: any, rIdx: number) => {
        const rNum = startRowNum + rIdx;
        const cLetter = indexToColLetter(startCol);
        const coord = `${cLetter}${rNum}`;
        spillCoords.push(coord);
        updates.push({ coord, val: itemVal, col: startCol, row: rNum - 2 });
      });
    }

    // Update gridData with all spilled items
    setGridData((prev) => {
      const next = {
        ...prev,
        columns: [...prev.columns],
        headers: [...prev.headers],
        rows: prev.rows.map((r) => [...r]),
      };

      const maxCol = Math.max(...updates.map((u) => u.col), next.columns.length - 1);
      while (next.columns.length <= maxCol) {
        next.columns.push(indexToColLetter(next.columns.length));
        next.headers.push('');
      }

      const maxRow = Math.max(...updates.map((u) => u.row), next.rows.length - 1);
      while (next.rows.length <= maxRow) {
        next.rows.push(new Array(next.columns.length).fill(''));
      }

      updates.forEach((u) => {
        if (u.row >= 0) {
          while (next.rows[u.row].length < next.columns.length) {
            next.rows[u.row].push('');
          }
          next.rows[u.row][u.col] = u.val;
        }
      });

      return next;
    });

    setSpillInfo((prev) => ({
      ...prev,
      [rootCoord]: { root: rootCoord, coords: spillCoords, formula: formulaStr },
    }));

    setSpillChildMap((prev) => {
      const next = { ...prev };
      spillCoords.forEach((c) => {
        next[c] = rootCoord;
      });
      return next;
    });

    setCellFormulas((prev) => ({ ...prev, [rootCoord]: formulaStr }));
  };

  // Evaluate formula in target cell and handle values / array spills
  const executeFormulaInCell = (cellCoord: string, formulaStr: string) => {
    const trimmed = formulaStr.trim();
    setIsRunning(true);

    clearPreviousSpill(cellCoord);

    const res = evaluateFormula(trimmed, gridData, targetResult);
    setEvalResult(res);
    setIsRunning(false);

    if (res.success && res.value !== undefined && res.value !== null) {
      if (Array.isArray(res.value)) {
        // Excel Dynamic Array Spill!
        handleSpillResult(cellCoord, trimmed, res.value);
      } else {
        // Single scalar value
        setCellFormulas((prev) => ({ ...prev, [cellCoord]: trimmed }));
        updateCellDirect(cellCoord, res.value);
      }
    }

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

  // Live Formula Bar input change (typing or deleting modifies active cell in real-time)
  const handleFormulaBarChange = (newVal: string) => {
    setFormulaInput(newVal);

    if (!newVal.startsWith('=')) {
      // Real Excel behavior: editing text or deleting in formula bar updates the active cell immediately
      clearPreviousSpill(activeCell);

      setCellFormulas((prev) => {
        const next = { ...prev };
        delete next[activeCell];
        return next;
      });

      updateCellDirect(activeCell, newVal);
    }
  };

  // Submit formula bar (Enter key or Calculate/Enter button)
  const handleFormulaBarSubmit = () => {
    const trimmed = formulaInput.trim();
    if (!trimmed) {
      clearPreviousSpill(activeCell);
      updateCellDirect(activeCell, '');
      setFormulaInput('');
      return;
    }

    if (trimmed.startsWith('=')) {
      executeFormulaInCell(activeCell, trimmed);
    } else {
      clearPreviousSpill(activeCell);
      updateCellDirect(activeCell, trimmed);
      setToastNotice(`Saved "${trimmed}" to cell ${activeCell}`);
    }
  };

  // In-cell edit commit (from double-tap or in-cell editing)
  const handleCellChange = (coord: string, newValue: string) => {
    const trimmed = typeof newValue === 'string' ? newValue.trim() : '';

    if (trimmed.startsWith('=')) {
      setFormulaInput(trimmed);
      executeFormulaInCell(coord, trimmed);
    } else {
      clearPreviousSpill(coord);
      setCellFormulas((prev) => {
        const next = { ...prev };
        delete next[coord];
        return next;
      });
      updateCellDirect(coord, trimmed);
      setFormulaInput(trimmed);
      setToastNotice(`Updated ${coord}: ${trimmed}`);
    }
  };

  // Cell click in grid
  const handleCellClick = (coord: string) => {
    const isTypingFormulaWithRef =
      formulaInput.startsWith('=') && /[=+\-*/,(:&]$/.test(formulaInput.trim());

    if (isTypingFormulaWithRef) {
      setFormulaInput((prev) => `${prev}${coord}`);
    } else {
      selectCell(coord);
    }
  };

  // Navigate between cells with directional buttons below formula bar
  const handleNavigate = (direction: 'up' | 'down' | 'left' | 'right') => {
    const parsed = parseCellAddress(activeCell);
    if (!parsed) return;
    const numCols = Math.max(gridData.columns.length, gridData.headers.length);
    const totalRows = Math.max(gridData.rows.length, 5);

    let { colIndex, rowIndex } = parsed;
    let rowNum = rowIndex + 2;

    if (direction === 'up') {
      rowNum = Math.max(1, rowNum - 1);
    } else if (direction === 'down') {
      rowNum = Math.min(totalRows + 1, rowNum + 1);
    } else if (direction === 'left') {
      colIndex = Math.max(0, colIndex - 1);
    } else if (direction === 'right') {
      colIndex = Math.min(numCols - 1, colIndex + 1);
    }

    const newColLetter = indexToColLetter(colIndex);
    const newCoord = `${newColLetter}${rowNum}`;
    selectCell(newCoord);
  };

  const handleInsertEquals = () => {
    setFormulaInput((prev) => (prev.startsWith('=') ? prev : `=${prev}`));
  };

  const handleStartInlineEdit = () => {
    setActiveEditCell(activeCell);
  };

  const handleClearCell = () => {
    clearPreviousSpill(activeCell);
    updateCellDirect(activeCell, '');
    setFormulaInput('');
    setCellFormulas((prev) => {
      const next = { ...prev };
      delete next[activeCell];
      return next;
    });
    setToastNotice(`Cleared cell ${activeCell}`);
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

      {/* Smart Worksheet Informational Pop-up message */}
      {showSmartTip && (
        <div className="relative flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-950/95 via-slate-900 to-cyan-950/90 border border-emerald-500/70 shadow-lg shadow-emerald-950/40 text-xs text-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40 mt-0.5">
              <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <div className="font-semibold text-emerald-300 text-xs flex items-center gap-1.5">
                <span>Smart Worksheet Active</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-medium border border-emerald-500/30">Editable</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal mt-0.5">
                You can edit and enter text into this worksheet! Double-tap any cell or type in the formula bar. Enter text to update cells, or start with <code className="text-emerald-400 font-bold bg-emerald-950/80 px-1 rounded border border-emerald-700/50">=</code> to calculate. Use the navigation buttons below the formula bar to move between cells.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSmartTip(false)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors shrink-0"
            title="Dismiss message"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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

      {/* Live Spreadsheet Grid with Double-tap editing & Dynamic Array Spilling */}
      <SpreadsheetGrid
        dataset={gridData}
        referencedCells={referencedCells}
        selectedCell={activeCell}
        activeEditCell={activeEditCell}
        cellFormulas={cellFormulas}
        spillCells={spillCells}
        spillRoots={spillRoots}
        onCellClick={handleCellClick}
        onCellChange={handleCellChange}
        onStartEdit={(coord) => setActiveCell(coord)}
      />

      {/* Real-time Syntax-Highlighted Formula Bar with Live Cell Sync */}
      <FormulaBar
        value={formulaInput}
        onChange={handleFormulaBarChange}
        onRun={handleFormulaBarSubmit}
        isRunning={isRunning}
        activeCellLabel={activeCell}
      />

      {/* Navigation & Cell Control Toolbar Below Formula Bar */}
      <CellNavigator
        activeCell={activeCell}
        onNavigate={handleNavigate}
        onInsertEquals={handleInsertEquals}
        onStartInlineEdit={handleStartInlineEdit}
        onClearCell={handleClearCell}
        isFormulaMode={formulaInput.trim().startsWith('=')}
      />

      {/* Toast Notice */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-emerald-300 text-xs px-3.5 py-2 rounded-lg border border-emerald-500/60 shadow-xl shadow-black/50 animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastNotice}</span>
        </div>
      )}

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
