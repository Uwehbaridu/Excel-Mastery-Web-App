import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface BannerAdProps {
  onUpgradeClick?: () => void;
  isPro?: boolean;
}

export const BannerAdPlaceholder: React.FC<BannerAdProps> = ({ onUpgradeClick, isPro = false }) => {
  if (isPro) return null; // Pro users see no ads!

  return (
    <div className="w-full bg-slate-900/60 border border-dashed border-slate-700/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-slate-400 select-none">
      <div className="flex items-center gap-2.5">
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase tracking-wider">
          AD
        </span>
        <span className="text-slate-300">
          Supercharge your Excel skills with <span className="font-semibold text-emerald-400">Excel Mastery Pro</span>.
        </span>
      </div>

      <button
        type="button"
        onClick={onUpgradeClick}
        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold border border-emerald-500/30 transition-colors shrink-0 flex items-center gap-1"
      >
        <Sparkles className="w-3 h-3 text-emerald-400" />
        <span>Remove Ads</span>
      </button>
    </div>
  );
};
