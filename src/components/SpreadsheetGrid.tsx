import React, { useState, useRef, useEffect } from 'react';
import { GridDataset } from '../types/formula';
import { indexToColLetter } from '../utils/formulaEvaluator';
import { 
  getActiveFunctionQuery, 
  getFunctionSuggestions, 
  applyFunctionSuggestion, 
  FunctionSuggestion, 
  AutocompleteTarget 
} from '../utils/functionAutocomplete';
import { FunctionAutocompleteDropdown } from './FunctionAutocompleteDropdown';

interface SpreadsheetGridProps {
  dataset: GridDataset;
  referencedCells?: Set<string>; // 'B2', 'B3', etc.
  targetCell?: string; // Optional cell reference
  computedValue?: any; // Live computed value from evaluated formula
  isCorrect?: boolean; // Whether the evaluated formula matched target
  selectedCell?: string;
  cellFormulas?: Record<string, string>;
  spillCells?: Set<string>;
  spillRoots?: Set<string>;
  onCellClick?: (cellCoord: string, value: any) => void;
  onCellChange?: (cellCoord: string, newValue: string) => void;
  activeEditCell?: string | null;
  onStartEdit?: (cellCoord: string) => void;
  maxDisplayRows?: number;
  highlightColor?: string;
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  dataset,
  referencedCells = new Set(),
  targetCell,
  computedValue,
  isCorrect,
  selectedCell,
  cellFormulas = {},
  spillCells = new Set(),
  spillRoots = new Set(),
  onCellClick,
  onCellChange,
  activeEditCell,
  onStartEdit,
  maxDisplayRows = 12,
}) => {
  const numCols = Math.max(dataset.columns.length, dataset.headers.length);
  const columnLetters = Array.from({ length: numCols }, (_, i) => indexToColLetter(i));

  // Determine active rows to display (at least dataset.rows.length, or up to maxDisplayRows if padded)
  const rowCount = Math.max(dataset.rows.length, 5);

  // Local state for inline cell editing (from double-click/double-tap or props)
  const [internalEditingCell, setInternalEditingCell] = useState<string | null>(null);
  const [inlineValue, setInlineValue] = useState<string>('');
  const lastTapRef = useRef<{ time: number; coord: string }>({ time: 0, coord: '' });
  const inputRef = useRef<HTMLInputElement>(null);

  // In-cell autocomplete state
  const [inlineSuggestions, setInlineSuggestions] = useState<FunctionSuggestion[]>([]);
  const [inlineSelectedIndex, setInlineSelectedIndex] = useState(0);
  const [inlineActiveTarget, setInlineActiveTarget] = useState<AutocompleteTarget | null>(null);

  const effectiveEditingCell = activeEditCell !== undefined ? activeEditCell : internalEditingCell;

  // Sync edit mode input when activeEditCell changes externally
  useEffect(() => {
    if (activeEditCell) {
      setInternalEditingCell(activeEditCell);
      if (cellFormulas[activeEditCell]) {
        setInlineValue(cellFormulas[activeEditCell]);
      } else {
        const match = activeEditCell.match(/^([A-Z]+)(\d+)$/);
        if (match) {
          const colIdx = columnLetters.indexOf(match[1]);
          const rowNum = parseInt(match[2], 10);
          let currVal: any = '';
          if (rowNum === 1) {
            currVal = dataset.headers[colIdx] ?? '';
          } else {
            currVal = dataset.rows[rowNum - 2]?.[colIdx] ?? '';
          }
          setInlineValue(currVal !== null && currVal !== undefined ? String(currVal) : '');
        }
      }
    }
  }, [activeEditCell, dataset, cellFormulas]);

  // Auto-focus inline input
  useEffect(() => {
    if (effectiveEditingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [effectiveEditingCell]);

  const startEditing = (cellCoord: string, currentVal: any) => {
    setInternalEditingCell(cellCoord);
    // If formula exists for this cell, load the formula (e.g. =SUM(A2:B2))
    const formula = cellFormulas[cellCoord];
    const initial = formula !== undefined
      ? formula
      : currentVal !== null && currentVal !== undefined
      ? String(currentVal)
      : '';
    setInlineValue(initial);
    setInlineSuggestions([]);
    setInlineActiveTarget(null);
    onStartEdit?.(cellCoord);
  };

  const handleCellClickOrDoubleTap = (cellCoord: string, currentVal: any) => {
    const now = Date.now();
    const isDoubleTap = lastTapRef.current.coord === cellCoord && (now - lastTapRef.current.time < 380);
    lastTapRef.current = { time: now, coord: cellCoord };

    if (isDoubleTap) {
      startEditing(cellCoord, currentVal);
    } else {
      onCellClick?.(cellCoord, currentVal);
    }
  };

  // Dedicated touch-end double tap handler for mobile
  const handleCellTouchEnd = (e: React.TouchEvent, cellCoord: string, currentVal: any) => {
    const now = Date.now();
    if (lastTapRef.current.coord === cellCoord && (now - lastTapRef.current.time < 380)) {
      e.preventDefault();
      startEditing(cellCoord, currentVal);
    } else {
      lastTapRef.current = { time: now, coord: cellCoord };
    }
  };

  const checkInlineAutocomplete = (val: string, caretPos?: number) => {
    const target = getActiveFunctionQuery(val, caretPos);
    if (target && target.query.length >= 1) {
      const matches = getFunctionSuggestions(target.query);
      if (matches.length > 0) {
        setInlineSuggestions(matches);
        setInlineSelectedIndex(0);
        setInlineActiveTarget(target);
        return;
      }
    }
    setInlineSuggestions([]);
    setInlineActiveTarget(null);
  };

  const handleInlineInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInlineValue(newVal);
    checkInlineAutocomplete(newVal, e.target.selectionStart ?? newVal.length);
  };

  const handleSelectInlineSuggestion = (fn: FunctionSuggestion) => {
    if (!inlineActiveTarget) return;
    const { newText, newCaretPos } = applyFunctionSuggestion(inlineValue, inlineActiveTarget, fn.name);
    setInlineValue(newText);
    setInlineSuggestions([]);
    setInlineActiveTarget(null);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newCaretPos, newCaretPos);
      }
    }, 20);
  };

  const handleInlineKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (inlineSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setInlineSelectedIndex((prev) => (prev + 1) % inlineSuggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setInlineSelectedIndex((prev) => (prev - 1 + inlineSuggestions.length) % inlineSuggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        handleSelectInlineSuggestion(inlineSuggestions[inlineSelectedIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setInlineSuggestions([]);
        setInlineActiveTarget(null);
        return;
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  const commitEdit = () => {
    if (effectiveEditingCell) {
      onCellChange?.(effectiveEditingCell, inlineValue);
      setInternalEditingCell(null);
      setInlineSuggestions([]);
      setInlineActiveTarget(null);
    }
  };

  const cancelEdit = () => {
    setInternalEditingCell(null);
    setInlineSuggestions([]);
    setInlineActiveTarget(null);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden shadow-inner flex flex-col">
      {/* Excel Sheet Tab & Grid Status Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/90 border-b border-slate-700 text-xs text-slate-300 select-none">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-mono text-[11px] font-semibold border border-emerald-800/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Sheet1
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            {dataset.rows.length} rows × {numCols} columns
          </span>
        </div>
        {referencedCells.size > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
            <span>Referenced:</span>
            <span className="bg-emerald-900/40 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-700/50">
              {Array.from(referencedCells).slice(0, 3).join(', ')}
              {referencedCells.size > 3 ? ` +${referencedCells.size - 3}` : ''}
            </span>
          </div>
        )}
      </div>

      {/* Responsive Spreadsheet Grid */}
      <div className="spreadsheet-grid overflow-x-auto overflow-y-auto max-h-[340px] min-h-[200px] w-full relative touch-pan-x touch-pan-y">
        <table className={`w-full border-collapse border-spacing-0 font-mono text-xs text-left ${numCols <= 4 ? 'table-fixed' : 'min-w-[480px]'}`}>
          <thead>
            {/* Top row: Column Letters A, B, C, D... */}
            <tr className="sticky top-0 z-20 bg-slate-800/95 backdrop-blur-sm shadow-sm">
              <th className="w-6 sm:w-8 p-1 text-center text-[10px] font-medium text-slate-400 bg-slate-850 border-r border-b border-slate-700 select-none sticky left-0 z-30">
                #
              </th>
              {columnLetters.map((colLetter, cIdx) => {
                // Check if any referenced cell belongs to this column
                const isColActive = Array.from(referencedCells).some((ref) =>
                  ref.startsWith(colLetter)
                );
                return (
                  <th
                    key={colLetter}
                    className={`px-1 sm:px-2.5 py-1.5 text-center text-[10px] sm:text-xs font-semibold border-r border-b border-slate-700 transition-colors select-none ${
                      numCols <= 4 ? 'w-auto' : 'min-w-[90px]'
                    } ${
                      isColActive
                        ? 'bg-emerald-950/70 text-emerald-300 border-b-emerald-600'
                        : 'text-slate-300'
                    }`}
                  >
                    {colLetter}
                  </th>
                );
              })}
            </tr>

            {/* Row 1: Header names (e.g. Item, Projected, Actual, Output) */}
            <tr className="bg-slate-850/90 border-b border-slate-700 text-slate-200">
              <th className="w-6 sm:w-8 p-1 text-center text-[10px] font-semibold text-slate-400 bg-slate-850 border-r border-b border-slate-700 select-none sticky left-0 z-10">
                1
              </th>
              {columnLetters.map((colLetter, cIdx) => {
                const rawHeaderText = dataset.headers[cIdx];
                const headerText = rawHeaderText !== undefined && rawHeaderText !== null ? rawHeaderText : '';
                const cellCoord = `${colLetter}1`;
                const isReferenced = referencedCells.has(cellCoord);
                const isSelected = selectedCell === cellCoord;
                const isEditing = effectiveEditingCell === cellCoord;

                return (
                  <td
                    key={cIdx}
                    onClick={() => handleCellClickOrDoubleTap(cellCoord, headerText)}
                    onDoubleClick={() => startEditing(cellCoord, headerText)}
                    onTouchEnd={(e) => handleCellTouchEnd(e, cellCoord, headerText)}
                    className={`px-1 sm:px-2 py-1 sm:py-1.5 font-sans font-semibold text-[10px] sm:text-xs border-r border-b border-slate-700/80 transition-all relative ${
                      numCols <= 4 ? 'w-auto' : 'min-w-[90px]'
                    } ${
                      isEditing
                        ? 'p-0 bg-slate-950 ring-2 ring-emerald-400 z-30'
                        : isSelected
                        ? 'bg-blue-950/70 text-blue-200 ring-2 ring-blue-500 ring-inset'
                        : isReferenced
                        ? 'bg-emerald-950/80 text-emerald-200 ring-2 ring-emerald-500 ring-inset'
                        : 'text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {isEditing ? (
                      <div className="relative w-full h-full min-h-[26px]">
                        <input
                          ref={inputRef}
                          type="text"
                          value={inlineValue}
                          autoCapitalize="none"
                          autoCorrect="off"
                          autoComplete="off"
                          onChange={handleInlineInputChange}
                          onKeyDown={handleInlineKeyDown}
                          onBlur={commitEdit}
                          className="w-full h-full min-h-[26px] px-1.5 py-1 text-[11px] sm:text-xs font-sans font-semibold bg-slate-950 text-emerald-200 border-none outline-none ring-2 ring-emerald-400 rounded-none"
                        />
                        {inlineSuggestions.length > 0 && (
                          <FunctionAutocompleteDropdown
                            suggestions={inlineSuggestions}
                            selectedIndex={inlineSelectedIndex}
                            onSelect={handleSelectInlineSuggestion}
                            query={inlineActiveTarget?.query || ''}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="truncate text-slate-300 font-semibold min-h-[16px]" title={headerText}>
                        {headerText}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {/* Rows 2 and onwards */}
            {Array.from({ length: rowCount }, (_, rIdx) => {
              const rowNum = rIdx + 2; // Row numbers 2, 3, 4...
              const rowData = dataset.rows[rIdx] || [];

              // Check if any cell in this row is referenced
              const isRowActive = columnLetters.some((colLetter) =>
                referencedCells.has(`${colLetter}${rowNum}`)
              );

              return (
                <tr
                  key={rowNum}
                  className={`border-b border-slate-800/80 transition-colors ${
                    rIdx % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/50'
                  }`}
                >
                  {/* Left Row Number sticky header */}
                  <th
                    className={`w-6 sm:w-8 p-1 text-center text-[10px] font-medium border-r border-slate-700 select-none sticky left-0 z-10 transition-colors ${
                      isRowActive
                        ? 'bg-emerald-950/80 text-emerald-300 font-bold border-r-emerald-500'
                        : 'bg-slate-850 text-slate-400'
                    }`}
                  >
                    {rowNum}
                  </th>

                  {columnLetters.map((colLetter, cIdx) => {
                    const cellCoord = `${colLetter}${rowNum}`;
                    const rawVal = rowData[cIdx];
                    const isReferenced = referencedCells.has(cellCoord);
                    const isSelected = selectedCell === cellCoord;
                    const isEditing = effectiveEditingCell === cellCoord;
                    const isSpillRoot = spillRoots?.has(cellCoord);
                    const isSpill = spillCells?.has(cellCoord);

                    const isNumeric =
                      typeof rawVal === 'number' ||
                      (!isNaN(Number(rawVal)) && rawVal !== '' && rawVal !== null && typeof rawVal !== 'boolean');

                    return (
                      <td
                        key={cellCoord}
                        onClick={() => handleCellClickOrDoubleTap(cellCoord, rawVal)}
                        onDoubleClick={() => startEditing(cellCoord, rawVal)}
                        onTouchEnd={(e) => handleCellTouchEnd(e, cellCoord, rawVal)}
                        className={`px-1 sm:px-2.5 py-1.5 sm:py-2 border-r border-slate-800 transition-all cursor-pointer relative text-[10px] sm:text-xs ${
                          numCols <= 4 ? 'w-auto' : 'min-w-[90px]'
                        } ${
                          isEditing
                            ? 'p-0 bg-slate-950 ring-2 ring-emerald-400 z-30'
                            : isSelected
                            ? 'bg-blue-950/70 text-blue-200 ring-2 ring-blue-500 ring-inset shadow-inner z-20'
                            : isReferenced
                            ? 'bg-emerald-950/70 text-emerald-200 ring-2 ring-emerald-500 ring-inset cell-highlight-active z-10'
                            : isSpillRoot
                            ? 'bg-cyan-950/40 text-cyan-200 ring-2 ring-cyan-500 ring-inset'
                            : isSpill
                            ? 'bg-cyan-950/20 text-cyan-200 ring-1 ring-cyan-500/50 ring-inset'
                            : 'hover:bg-slate-800/50'
                        }`}
                      >
                        {isEditing ? (
                          <div className="relative w-full h-full min-h-[26px]">
                            <input
                              ref={inputRef}
                              type="text"
                              value={inlineValue}
                              autoCapitalize="none"
                              autoCorrect="off"
                              autoComplete="off"
                              onChange={handleInlineInputChange}
                              onKeyDown={handleInlineKeyDown}
                              onBlur={commitEdit}
                              className="w-full h-full min-h-[26px] px-1.5 py-1 text-[11px] sm:text-xs font-mono bg-slate-950 text-emerald-200 border-none outline-none ring-2 ring-emerald-400 rounded-none"
                            />
                            {inlineSuggestions.length > 0 && (
                              <FunctionAutocompleteDropdown
                                suggestions={inlineSuggestions}
                                selectedIndex={inlineSelectedIndex}
                                onSelect={handleSelectInlineSuggestion}
                                query={inlineActiveTarget?.query || ''}
                              />
                            )}
                          </div>
                        ) : (
                          <>
                            <div
                              className={`truncate ${
                                isNumeric ? 'text-right font-mono' : 'text-left'
                              } ${
                                rawVal === null || rawVal === undefined || rawVal === ''
                                  ? 'text-slate-600'
                                  : isReferenced
                                  ? 'text-emerald-100 font-semibold'
                                  : isSpillRoot || isSpill
                                  ? 'text-cyan-200 font-medium'
                                  : 'text-slate-200'
                              }`}
                            >
                              {rawVal !== null && rawVal !== undefined && rawVal !== '' ? (
                                typeof rawVal === 'boolean' ? (
                                  rawVal ? 'TRUE' : 'FALSE'
                                ) : typeof rawVal === 'number' ? (
                                  rawVal.toLocaleString()
                                ) : (
                                  String(rawVal)
                                )
                              ) : (
                                ''
                              )}
                            </div>

                            {/* Cell coordinate badge when referenced or spill root */}
                            {isReferenced && (
                              <span className="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-emerald-400/80 pointer-events-none select-none">
                                {cellCoord}
                              </span>
                            )}
                            {isSpillRoot && !isReferenced && (
                              <span className="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-cyan-400/80 pointer-events-none select-none">
                                {cellCoord}#
                              </span>
                            )}
                          </>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Grid Quick Helper Tip */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-950 text-[10px] text-slate-400 border-t border-slate-800 select-none">
        <span className="truncate">Tip: Double-tap any cell or type in formula bar to edit • Use navigation buttons below</span>
        <span className="font-mono text-emerald-400 shrink-0 ml-2">Smart Grid Active</span>
      </div>
    </div>
  );
};
