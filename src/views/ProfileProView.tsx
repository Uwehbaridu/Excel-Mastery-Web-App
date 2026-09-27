import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  Crown, 
  Flame, 
  Trophy, 
  CheckCircle2, 
  Bookmark, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Copy, 
  Check, 
  BookOpen,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { ExcelFunction, UserProgress } from '../types/formula';

interface ProfileProViewProps {
  progress: UserProgress;
  functions: ExcelFunction[];
  onToggleBookmark: (id: string) => void;
  onSetPro: (isPro: boolean) => void;
  onResetProgress: () => void;
  onSelectFunctionForPractice: (func: ExcelFunction) => void;
  onOpenUpgradeModal: () => void;
}

export type PricingPlanId = 'annual' | 'monthly' | 'six_months' | 'lifetime';

interface PricingPlan {
  id: PricingPlanId;
  name: string;
  badge?: string;
  priceDisplay: string;
  periodText: string;
  nairaReference: string;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'annual',
    name: 'Excel Mastery Pro Annual',
    badge: '28% OFF',
    priceDisplay: '$12.99',
    periodText: '/ year',
    nairaReference: '₦20,000.00 / year',
  },
  {
    id: 'monthly',
    name: 'Premium Monthly',
    priceDisplay: '$1.99',
    periodText: '/ month',
    nairaReference: '₦3,000.00 / month',
  },
  {
    id: 'six_months',
    name: '6-Months',
    priceDisplay: '$7.99',
    periodText: '/ 6 months',
    nairaReference: '₦12,000.00 / 6 months',
  },
  {
    id: 'lifetime',
    name: 'Lifetime Access',
    priceDisplay: '$31.99',
    periodText: ', lifetime access',
    nairaReference: '₦48,000.00, lifetime access',
  },
];

export const ProfileProView: React.FC<ProfileProViewProps> = ({
  progress,
  functions,
  onToggleBookmark,
  onSetPro,
  onResetProgress,
  onSelectFunctionForPractice,
  onOpenUpgradeModal,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlanId>('annual');
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [copiedCheatSheet, setCopiedCheatSheet] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Stats calculation
  const totalPracticeCompleted = Object.values(progress.completedPractice).reduce(
    (acc, list) => acc + list.length,
    0
  );
  const totalPuzzlesCompleted = Object.values(progress.completedPuzzles).filter(Boolean).length;
  const bookmarkedList = functions.filter((f) => progress.bookmarkedFunctions.includes(f.id));

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleCopyAllFormulas = () => {
    const text = functions
      .map(
        (f) =>
          `${f.name} (Ch. ${f.chapter} · ${f.category})\nSyntax: ${f.syntax}\nDescription: ${f.description}\n`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedCheatSheet(true);
    setTimeout(() => setCopiedCheatSheet(false), 2000);
  };

  const handleContinueSubscription = () => {
    onSetPro(true);
    const chosen = PRICING_PLANS.find((p) => p.id === selectedPlan);
    setSuccessNotice(`Congratulations! You have unlocked ${chosen?.name || 'Pro Pass'}. All 100+ functions & 80 challenges unlocked!`);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
    });
    setTimeout(() => setSuccessNotice(null), 6000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto px-4 py-4 pb-28">
      {/* Success Notification Banner */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-medium flex items-center gap-3 animate-fade-in shadow-xl">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="flex-1">{successNotice}</p>
        </div>
      )}

      {/* Main Subscription Section styled exactly after the user's screenshot */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
          Join to unlock the complete Excel Formula Mastery collection
        </h1>

        {/* 4 Plan Cards */}
        <div className="space-y-3 pt-1">
          {PRICING_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer select-none relative ${
                  isSelected
                    ? 'border-blue-500 bg-blue-950/20 shadow-md shadow-blue-950/30'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Radio Button matching screenshot */}
                    <div className="mt-0.5 shrink-0">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-600 bg-transparent" />
                      )}
                    </div>

                    <div>
                      <div className="font-bold text-sm sm:text-base text-white">
                        {plan.name}
                      </div>
                      <div className="text-sm font-semibold text-slate-200 font-mono mt-0.5">
                        {plan.priceDisplay}
                        <span className="font-normal text-xs text-slate-400 font-sans ml-1">
                          {plan.periodText}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badge (e.g. 28% OFF) */}
                  {plan.badge && (
                    <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold tracking-tight shrink-0 shadow-sm">
                      {plan.badge}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button matching screenshot */}
        <button
          type="button"
          onClick={handleContinueSubscription}
          className="w-full py-3.5 sm:py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-1"
        >
          <span>Continue</span>
        </button>
      </div>

      {/* Profile & Practice Stats Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-950/40">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <User className="w-7 h-7 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Excel Specialist</h2>
              {progress.isPro ? (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Crown className="w-3 h-3 fill-amber-400" /> PRO ACTIVE
                </span>
              ) : (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  FREE TIER
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Learner & Practitioner</p>
          </div>
        </div>

        {/* Daily Streak Counter */}
        <div className="flex flex-col items-center bg-slate-950/70 border border-slate-800 px-3.5 py-2 rounded-xl">
          <div className="flex items-center gap-1 text-amber-400 font-black text-lg font-mono">
            <Flame className="w-5 h-5 fill-amber-400 text-amber-400 animate-bounce" />
            <span>{progress.streakDays}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Day Streak
          </span>
        </div>
      </div>

      {/* Progress Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-slate-400 text-xs font-medium">Practice Solved</div>
          <div className="font-mono text-2xl font-black text-emerald-400 mt-2">
            {totalPracticeCompleted}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Scenarios completed</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-slate-400 text-xs font-medium">Puzzles Solved</div>
          <div className="font-mono text-2xl font-black text-amber-400 mt-2">
            {totalPuzzlesCompleted} / 80
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Challenges solved</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="text-slate-400 text-xs font-medium">Bookmarked Formulas</div>
          <div className="font-mono text-2xl font-black text-cyan-400 mt-2">
            {progress.bookmarkedFunctions.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Saved for quick lookup</div>
        </div>
      </div>

      {/* Bookmarked Formulas Quick List */}
      {bookmarkedList.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Bookmarked Formulas ({bookmarkedList.length})</span>
          </div>
          <div className="space-y-2">
            {bookmarkedList.map((fn) => (
              <div
                key={fn.id}
                onClick={() => onSelectFunctionForPractice(fn)}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div>
                  <div className="font-bold text-sm text-white font-mono">{fn.name}</div>
                  <div className="text-xs text-slate-400 font-mono truncate">{fn.syntax}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(fn.id);
                    }}
                    className="p-1.5 text-amber-400 hover:text-slate-400"
                    title="Remove Bookmark"
                  >
                    <Bookmark className="w-4 h-4 fill-amber-400" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offline Reference & Preferences */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Tools & Preferences
        </h3>

        {/* Offline Cheat-Sheet Trigger */}
        <button
          onClick={() => setShowCheatSheet(true)}
          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left text-xs transition-colors"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-bold text-white">Full Offline Formula Cheat-Sheet</div>
              <p className="text-slate-400 text-[11px]">View or copy syntax for all 100+ functions</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left text-xs transition-colors"
        >
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <Moon className="w-4 h-4 text-cyan-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
            <div>
              <div className="font-bold text-white">Display Theme</div>
              <p className="text-slate-400 text-[11px]">Current: {isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400">Toggle</span>
        </button>

        {/* Reset Progress */}
        <button
          onClick={() => {
            if (window.confirm('Reset all practice and challenge progress?')) {
              onResetProgress();
            }
          }}
          className="w-full p-3 rounded-xl bg-slate-950 border border-rose-900/30 hover:border-rose-700/60 flex items-center justify-between text-left text-xs text-rose-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <div>
              <div className="font-bold">Reset All Progress</div>
              <p className="text-rose-400/70 text-[11px]">Clears completed exercises and streaks</p>
            </div>
          </div>
          <span className="text-[11px] text-rose-400 font-semibold">Reset</span>
        </button>
      </div>

      {/* Book Attribution Footer */}
      <div className="text-center text-xs text-slate-500 space-y-1 pt-2">
        <p>
          Based on <b>Excel Formula Mastery 2026</b> by Uweh Bariduanen.
        </p>
        <p className="text-[11px] text-slate-600">
          First Edition: 07-2026 · ISBN: 9798259116948
        </p>
      </div>

      {/* Offline Cheat-Sheet Modal */}
      {showCheatSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden text-slate-100">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Full Formula Cheat-Sheet</h3>
              </div>
              <button
                onClick={() => setShowCheatSheet(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 font-mono text-xs">
              {functions.map((fn) => (
                <div key={fn.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>{fn.name}</span>
                    <span className="text-[10px] text-slate-500 font-sans">{fn.category}</span>
                  </div>
                  <div className="text-slate-300 mt-0.5">{fn.syntax}</div>
                  <div className="text-slate-400 font-sans text-[11px] mt-1">{fn.description}</div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={handleCopyAllFormulas}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                {copiedCheatSheet ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCheatSheet ? 'Copied to Clipboard' : 'Copy All Formulas'}</span>
              </button>
              <button
                onClick={() => setShowCheatSheet(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
