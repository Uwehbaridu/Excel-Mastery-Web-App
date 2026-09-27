import React, { useMemo, useRef, useEffect } from 'react';
import { extractReferencedCells } from '../utils/formulaEvaluator';
import { Play, Sparkles, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';

interface FormulaBarProps {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
  onReferencesChange?: (refs: { rawReferences: string[]; allCellKeys: Set<string> }) => void;
  isRunning?: boolean;
  activeCellLabel?: string;
  placeholder?: string;
  disabled?: boolean;
}

interface Token {
  type: 'equals' | 'function' | 'reference' | 'string' | 'number' | 'paren' | 'operator' | 'text';
  text: string;
  parenDepth?: number;
}

/**
 * Tokenize Excel formula for syntax highlighting
 */
export function tokenizeFormula(formula: string): Token[] {
  const tokens: Token[] = [];
  if (!formula) return tokens;

  let i = 0;
  let parenDepth = 0;

  if (formula[0] === '=') {
    tokens.push({ type: 'equals', text: '=' });
    i++;
  }

  while (i < formula.length) {
    const char = formula[i];

    // String literal
    if (char === '"') {
      let str = '"';
      i++;
      while (i < formula.length && formula[i] !== '"') {
        str += formula[i];
        i++;
      }
      if (i < formula.length && formula[i] === '"') {
        str += '"';
        i++;
      }
      tokens.push({ type: 'string', text: str });
      continue;
    }

    // Parentheses
    if (char === '(') {
      parenDepth++;
      tokens.push({ type: 'paren', text: '(', parenDepth });
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: 'paren', text: ')', parenDepth });
      if (parenDepth > 0) parenDepth--;
      i++;
      continue;
    }

    // Cell or Range reference: e.g. A1, $A$1, B2:B10, Sheet1!A1
    const refMatch = formula.slice(i).match(/^(\$?[A-Za-z]+\$?\d+(?::\$?[A-Za-z]+\$?\d+)?)/);
    if (refMatch) {
      // Check if it's not preceded by a letter (which would make it part of an identifier)
      tokens.push({ type: 'reference', text: refMatch[1] });
      i += refMatch[1].length;
      continue;
    }

    // Function name or word: e.g. XLOOKUP, SUM, IF, AND
    const wordMatch = formula.slice(i).match(/^([A-Za-z_][A-Za-z0-9_\.]*)/);
    if (wordMatch) {
      const word = wordMatch[1];
      // Check if next non-space char is '(' => Function
      const rest = formula.slice(i + word.length).trimStart();
      if (rest.startsWith('(')) {
        tokens.push({ type: 'function', text: word });
      } else if (word.toUpperCase() === 'TRUE' || word.toUpperCase() === 'FALSE') {
        tokens.push({ type: 'text', text: word });
      } else {
        tokens.push({ type: 'text', text: word });
      }
      i += word.length;
      continue;
    }

    // Number literal: e.g. 100, 3.14, -5
    const numMatch = formula.slice(i).match(/^(\d+(?:\.\d+)?)/);
    if (numMatch) {
      tokens.push({ type: 'number', text: numMatch[1] });
      i += numMatch[1].length;
      continue;
    }

    // Operators and separators
    if (['+', '-', '*', '/', '>', '<', '=', '&', ',', ';', ':', '%', '^'].includes(char)) {
      tokens.push({ type: 'operator', text: char });
      i++;
      continue;
    }

    // Whitespace or other characters
    tokens.push({ type: 'text', text: char });
    i++;
  }

  return tokens;
}

const PAREN_COLORS = [
  'text-amber-400 font-bold',
  'text-pink-400 font-bold',
  'text-cyan-400 font-bold',
  'text-emerald-400 font-bold',
  'text-purple-400 font-bold',
];

export const FormulaBar: React.FC<FormulaBarProps> = ({
  value,
  onChange,
  onRun,
  onReferencesChange,
  isRunning = false,
  activeCellLabel = 'fx',
  placeholder = 'Type formula (e.g. =ABS(A2) or =SUM(B2:B10))...',
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Purely memoize tokens for syntax highlighting without causing re-renders
  const tokens = useMemo(() => tokenizeFormula(value), [value]);

  // Keep ref for onReferencesChange to avoid dependency cycles if callback is recreated
  const onReferencesChangeRef = useRef(onReferencesChange);
  useEffect(() => {
    onReferencesChangeRef.current = onReferencesChange;
  });

  const prevValueRef = useRef<string | null>(null);
  useEffect(() => {
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      if (onReferencesChangeRef.current) {
        const refs = extractReferencedCells(value);
        onReferencesChangeRef.current(refs);
      }
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onRun();
    }
  };

  const handleClear = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 shadow-lg shadow-black/30">
      <div className="flex items-center gap-2">
        {/* Active cell or fx badge */}
        <div className="flex items-center justify-center h-8 px-2.5 rounded-lg bg-slate-800 text-xs font-mono font-semibold text-emerald-400 border border-slate-700 select-none shrink-0 min-w-[42px]">
          {activeCellLabel}
        </div>

        {/* Input container with synchronized real-time syntax highlighter */}
        <div className="relative flex-1 h-9 rounded-lg bg-slate-950 border border-slate-700/80 focus-within:border-emerald-500/80 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all overflow-hidden flex items-center">
          {/* Syntax Highlighted Ghost Display (behind transparent input) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 px-3 py-1.5 font-mono text-sm tracking-tight whitespace-nowrap overflow-x-hidden pointer-events-none select-none flex items-center"
          >
            {value.length === 0 ? (
              <span className="text-slate-500 italic select-none">{placeholder}</span>
            ) : (
              tokens.map((tok, idx) => {
                let colorClass = 'text-slate-200';
                if (tok.type === 'equals') colorClass = 'text-emerald-400 font-bold';
                else if (tok.type === 'function') colorClass = 'text-cyan-400 font-semibold';
                else if (tok.type === 'reference') colorClass = 'text-emerald-400 font-semibold underline decoration-emerald-500/40 decoration-wavy underline-offset-2';
                else if (tok.type === 'string') colorClass = 'text-purple-300';
                else if (tok.type === 'number') colorClass = 'text-amber-300';
                else if (tok.type === 'operator') colorClass = 'text-slate-400 font-medium';
                else if (tok.type === 'paren') {
                  const depthIdx = ((tok.parenDepth ?? 1) - 1) % PAREN_COLORS.length;
                  colorClass = PAREN_COLORS[Math.max(0, depthIdx)];
                }
                return (
                  <span key={idx} className={colorClass}>
                    {tok.text}
                  </span>
                );
              })
            )}
          </div>

          {/* Actual transparent input for caret & typing */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder=""
            spellCheck={false}
            autoCapitalize="characters"
            className="relative z-10 w-full h-full px-3 py-1.5 font-mono text-sm tracking-tight text-transparent caret-emerald-400 bg-transparent focus:outline-none"
          />

          {value.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="relative z-20 mr-2 text-slate-400 hover:text-slate-200 p-1 rounded-md text-xs hover:bg-slate-800 transition-colors"
              title="Clear formula"
            >
              ×
            </button>
          )}
        </div>

        {/* Evaluate / Run Button */}
        <button
          type="button"
          onClick={onRun}
          disabled={disabled || !value.trim() || isRunning}
          className={`h-9 px-3.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-all shrink-0 active:scale-95 ${
            !value.trim() || disabled
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 cursor-pointer'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Run</span>
        </button>
      </div>

      {/* Syntax Guide quick indicators */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 select-none">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Function
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Cell Range
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> ( ) Match
          </span>
        </div>
        <span className="text-slate-500 text-[10px]">Press Enter or Tap Run</span>
      </div>
    </div>
  );
};
