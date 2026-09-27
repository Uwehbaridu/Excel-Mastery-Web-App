import React, { useEffect, useRef } from 'react';
import { FunctionSuggestion } from '../utils/functionAutocomplete';
import { Calculator, ArrowRight } from 'lucide-react';

interface FunctionAutocompleteDropdownProps {
  suggestions: FunctionSuggestion[];
  selectedIndex: number;
  onSelect: (suggestion: FunctionSuggestion) => void;
  query: string;
}

export const FunctionAutocompleteDropdown: React.FC<FunctionAutocompleteDropdownProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  query,
}) => {
  const listRef = useRef<HTMLUListElement>(null);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (suggestions.length === 0) return null;

  const currentActive = suggestions[selectedIndex] || suggestions[0];

  return (
    <div
      className="absolute top-full left-0 mt-1 w-full max-w-lg bg-slate-900/98 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col text-xs animate-in fade-in zoom-in-95 duration-150"
      onMouseDown={(e) => e.preventDefault()} // Prevent stealing input focus
    >
      {/* Header Info */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/90 border-b border-slate-700/80 text-[10px] text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300">Excel Functions</span>
        </div>
        <span>
          <kbd className="px-1 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300">Tab</kbd> or <kbd className="px-1 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300">Enter</kbd> to insert
        </span>
      </div>

      {/* Suggestion list */}
      <ul ref={listRef} className="max-h-48 overflow-y-auto divide-y divide-slate-800/60 p-1">
        {suggestions.map((fn, idx) => {
          const isSelected = idx === selectedIndex;
          const matchLen = query.length;
          const prefix = fn.name.slice(0, matchLen);
          const rest = fn.name.slice(matchLen);

          return (
            <li
              key={fn.name}
              onClick={() => onSelect(fn)}
              className={`px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                isSelected
                  ? 'bg-cyan-950/80 text-cyan-200 border-l-4 border-cyan-400 pl-2 shadow-inner'
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-800 text-[10px] font-mono font-bold text-cyan-400 flex items-center justify-center border border-slate-700 shrink-0">
                  fx
                </span>
                <span className="font-mono font-bold text-sm tracking-wide">
                  <span className="text-cyan-300 underline underline-offset-2">{prefix}</span>
                  <span className="text-white">{rest}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider font-mono">
                  {fn.category}
                </span>
                {isSelected && <ArrowRight className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Function Description & Syntax Footer */}
      {currentActive && (
        <div className="px-3 py-2 bg-slate-950/90 border-t border-slate-800 text-[11px] space-y-1">
          <div className="font-mono text-cyan-300 font-semibold truncate">
            {currentActive.syntax || `=${currentActive.name}(...)`}
          </div>
          <p className="text-slate-400 line-clamp-2 leading-relaxed">
            {currentActive.description}
          </p>
        </div>
      )}
    </div>
  );
};
