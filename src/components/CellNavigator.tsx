import React from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  Calculator,
  Compass
} from 'lucide-react';

interface CellNavigatorProps {
  activeCell: string;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onInsertEquals: () => void;
  onStartInlineEdit: () => void;
  onClearCell: () => void;
  isFormulaMode?: boolean;
}

export const CellNavigator: React.FC<CellNavigatorProps> = ({
  activeCell,
  onNavigate,
  onInsertEquals,
  onStartInlineEdit,
  onClearCell,
  isFormulaMode = false,
}) => {
  return (
    <div className="w-full bg-slate-900/95 border border-slate-700/80 rounded-xl p-2.5 shadow-md flex flex-wrap items-center justify-between gap-2.5">
      {/* Active Cell Badge & Mode indicator */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-emerald-300">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active:</span>
          <span className="text-white bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-emerald-400">
            {activeCell}
          </span>
        </div>

        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border hidden sm:inline-flex items-center gap-1 ${
          isFormulaMode 
            ? 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60' 
            : 'bg-slate-800/80 text-slate-300 border-slate-700'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isFormulaMode ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`}></span>
          {isFormulaMode ? 'Formula Mode (=)' : 'Editable Text / Value'}
        </span>
      </div>

      {/* D-Pad Cell Navigation Buttons */}
      <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
        <span className="text-[10px] text-slate-500 font-medium px-1.5 select-none hidden md:inline">
          Move:
        </span>
        <button
          type="button"
          onClick={() => onNavigate('left')}
          className="p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95 border border-slate-700/60 transition-all text-xs flex items-center justify-center"
          title="Move Left (◄)"
          aria-label="Move Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate('up')}
          className="p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95 border border-slate-700/60 transition-all text-xs flex items-center justify-center"
          title="Move Up (▲)"
          aria-label="Move Up"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate('down')}
          className="p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95 border border-slate-700/60 transition-all text-xs flex items-center justify-center"
          title="Move Down (▼)"
          aria-label="Move Down"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate('right')}
          className="p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95 border border-slate-700/60 transition-all text-xs flex items-center justify-center"
          title="Move Right (►)"
          aria-label="Move Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onInsertEquals}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
            isFormulaMode
              ? 'bg-cyan-950/80 border-cyan-500/70 text-cyan-300 shadow-sm'
              : 'bg-slate-800 border-slate-700 text-slate-200 hover:text-cyan-300 hover:bg-slate-700'
          }`}
          title="Start formula calculation with ="
        >
          <Calculator className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono">= fx</span>
        </button>

        <button
          type="button"
          onClick={onStartInlineEdit}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 active:scale-95 transition-all"
          title="Double-tap cell or click to edit cell inline"
        >
          <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Edit</span>
        </button>

        <button
          type="button"
          onClick={onClearCell}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 hover:border-rose-800/60 active:scale-95 transition-all"
          title="Clear cell contents"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>
    </div>
  );
};
