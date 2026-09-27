import React from 'react';
import { GridDataset } from '../types/formula';
import { indexToColLetter } from '../utils/formulaEvaluator';

interface SpreadsheetGridProps {
  dataset: GridDataset;
  referencedCells?: Set<string>; // 'B2', 'B3', etc.
  targetCell?: string; // Optional cell where formula output belongs
  computedValue?: any; // Live computed value from evaluated formula
  isCorrect?: boolean; // Whether the evaluated formula matched target
  selectedCell?: string;
  onCellClick?: (cellCoord: string, value: any) => void;
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
  onCellClick,
  maxDisplayRows = 12,
}) => {
  const numCols = Math.max(dataset.columns.length, dataset.headers.length);
  const columnLetters = Array.from({ length: numCols }, (_, i) => indexToColLetter(i));

  // Determine active rows to display (at least dataset.rows.length, or up to maxDisplayRows if padded)
  const rowCount = Math.max(dataset.rows.length, 5);

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
                const headerText = dataset.headers[cIdx] || `Col ${colLetter}`;
                const cellCoord = `${colLetter}1`;
                const isReferenced = referencedCells.has(cellCoord);
                return (
                  <td
                    key={cIdx}
                    onClick={() => onCellClick?.(cellCoord, headerText)}
                    className={`px-1 sm:px-2.5 py-1.5 sm:py-2 font-sans font-semibold text-[10px] sm:text-xs border-r border-b border-slate-700/80 transition-all ${
                      numCols <= 4 ? 'w-auto' : 'min-w-[90px]'
                    } ${
                      isReferenced
                        ? 'bg-emerald-950/80 text-emerald-200 ring-2 ring-emerald-500 ring-inset'
                        : 'text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="truncate text-slate-300 font-semibold" title={headerText}>{headerText}</div>
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
                    const isTarget = targetCell === cellCoord;
                    const rawVal = isTarget && computedValue !== undefined && computedValue !== null
                      ? computedValue
                      : rowData[cIdx];
                    const isReferenced = referencedCells.has(cellCoord);
                    const isSelected = selectedCell === cellCoord;

                    const isNumeric =
                      typeof rawVal === 'number' ||
                      (!isNaN(Number(rawVal)) && rawVal !== '' && rawVal !== null && typeof rawVal !== 'boolean');

                    const hasComputed = isTarget && computedValue !== undefined && computedValue !== null;

                    return (
                      <td
                        key={cellCoord}
                        onClick={() => onCellClick?.(cellCoord, rawVal)}
                        className={`px-1 sm:px-2.5 py-1.5 sm:py-2 border-r border-slate-800 transition-all cursor-pointer relative text-[10px] sm:text-xs ${
                          numCols <= 4 ? 'w-auto' : 'min-w-[90px]'
                        } ${
                          hasComputed
                            ? isCorrect
                              ? 'bg-emerald-950/90 text-emerald-200 ring-2 ring-emerald-400 ring-inset cell-highlight-active'
                              : 'bg-rose-950/80 text-rose-200 ring-2 ring-rose-500 ring-inset'
                            : isReferenced
                            ? 'bg-emerald-950/70 text-emerald-200 ring-2 ring-emerald-500 ring-inset cell-highlight-active'
                            : isTarget
                            ? 'bg-amber-950/30 text-amber-200 ring-2 ring-dashed ring-amber-500/80 ring-inset'
                            : isSelected
                            ? 'bg-blue-950/60 ring-2 ring-blue-500 ring-inset'
                            : 'hover:bg-slate-800/50'
                        }`}
                      >
                        <div
                          className={`truncate ${
                            isNumeric ? 'text-right font-mono' : 'text-left'
                          } ${
                            rawVal === null || rawVal === undefined
                              ? 'text-slate-600 italic'
                              : hasComputed
                              ? isCorrect
                                ? 'text-emerald-100 font-bold'
                                : 'text-rose-100 font-semibold'
                              : isReferenced
                              ? 'text-emerald-100 font-semibold'
                              : 'text-slate-200'
                          }`}
                        >
                          {rawVal !== null && rawVal !== undefined ? (
                            typeof rawVal === 'boolean' ? (
                              rawVal ? 'TRUE' : 'FALSE'
                            ) : typeof rawVal === 'number' ? (
                              rawVal.toLocaleString()
                            ) : (
                              String(rawVal)
                            )
                          ) : isTarget ? (
                            <span className="text-[11px] text-amber-400 font-sans italic flex items-center gap-1">
                              <span className="font-mono font-bold bg-amber-500/20 px-1 rounded">fx</span> Target
                            </span>
                          ) : (
                            ''
                          )}
                        </div>

                        {/* Cell coordinate badge when referenced or target */}
                        {isReferenced && (
                          <span className="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-emerald-400/80 pointer-events-none select-none">
                            {cellCoord}
                          </span>
                        )}
                        {isTarget && !isReferenced && (
                          <span className="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-amber-400/80 pointer-events-none select-none">
                            {cellCoord}
                          </span>
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
        <span>Tip: Tap any cell to view coordinate</span>
        <span className="font-mono text-emerald-400">Green outline = formula active range</span>
      </div>
    </div>
  );
};
