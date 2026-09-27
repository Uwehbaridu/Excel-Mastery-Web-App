import React, { useState } from 'react';
import { 
  Check, 
  Crown, 
  X, 
  Sparkles, 
  ShieldCheck, 
  FileSpreadsheet, 
  Download, 
  Flame, 
  Lock 
} from 'lucide-react';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onUpgrade: () => void;
}

export type ModalPlanId = 'annual' | 'monthly' | 'six_months' | 'lifetime';

interface ModalPlan {
  id: ModalPlanId;
  name: string;
  badge?: string;
  priceDisplay: string;
  periodText: string;
  nairaReference: string;
}

const MODAL_PLANS: ModalPlan[] = [
  {
    id: 'annual',
    name: 'Excel Mastery Pro Annual',
    badge: '28% OFF',
    priceDisplay: '$12.99',
    periodText: '/ year',
    nairaReference: '₦20,000 / yr equivalent',
  },
  {
    id: 'monthly',
    name: 'Premium Monthly',
    priceDisplay: '$1.99',
    periodText: '/ month',
    nairaReference: '₦3,000 / mo equivalent',
  },
  {
    id: 'six_months',
    name: '6-Months Access',
    priceDisplay: '$7.99',
    periodText: '/ 6 months',
    nairaReference: '₦12,000 / 6mo equivalent',
  },
  {
    id: 'lifetime',
    name: 'Lifetime Access',
    priceDisplay: '$31.99',
    periodText: ', lifetime access',
    nairaReference: '₦48,000 lifetime equivalent',
  },
];

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  isPro,
  onUpgrade,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<ModalPlanId>('annual');

  if (!isOpen) return null;

  const currentPlan = MODAL_PLANS.find((p) => p.id === selectedPlan) || MODAL_PLANS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Glowing emerald backdrop accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-950/40 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-400 fill-amber-400/20" />
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-400">
              Complete Curriculum Access
            </div>
            <h3 className="text-xl font-black text-white leading-tight">Excel Formula Mastery Pro</h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
          Join to unlock the complete Excel Formula Mastery collection across all 10 categories, all intermediate & advanced practice scenarios, and all 80 business challenges.
        </p>

        {/* 4 Pricing Plans */}
        <div className="space-y-2.5 mb-5">
          {MODAL_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-950/30 shadow-md shadow-blue-950/40'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-600 bg-transparent" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-white">{plan.name}</div>
                    <div className="text-xs text-slate-300 font-mono">
                      {plan.priceDisplay}
                      <span className="font-sans text-[11px] text-slate-400 ml-1">{plan.periodText}</span>
                    </div>
                  </div>
                </div>

                {plan.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shrink-0">
                    {plan.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-2 mb-5 text-[11px] text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>All 12 Practice / Function</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>All 80 Business Puzzles</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>100% Ad-Free Experience</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Offline Cheat-Sheets</span>
          </div>
        </div>

        {/* Action Button */}
        {isPro ? (
          <div className="flex flex-col gap-2">
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-center text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Pro License is Currently Active!
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                onUpgrade();
                onClose();
              }}
              className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>Unlock with {currentPlan.name} ({currentPlan.priceDisplay})</span>
            </button>
            <p className="text-center text-[10px] text-slate-400">
              Instant access unlocked · All 100+ functions & challenges active
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

