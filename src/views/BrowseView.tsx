import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Bookmark, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Calculator, 
  BarChart2, 
  GitBranch, 
  Type, 
  Calendar, 
  Layers, 
  Code, 
  DollarSign, 
  BookOpen, 
  CheckCircle2, 
  X,
  ChevronRight
} from 'lucide-react';
import { ExcelFunction, CategoryId } from '../types/formula';
import { CATEGORIES } from '../data/categories';
import { BannerAdPlaceholder } from '../components/BannerAdPlaceholder';

interface BrowseViewProps {
  functions: ExcelFunction[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onSelectForPractice: (func: ExcelFunction) => void;
  onUpgradeClick: () => void;
  isPro: boolean;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Calculator,
  BarChart2,
  GitBranch,
  Type,
  Calendar,
  Search,
  DollarSign,
  Layers,
  Code,
  Sparkles,
};

export const BrowseView: React.FC<BrowseViewProps> = ({
  functions,
  bookmarkedIds,
  onToggleBookmark,
  onSelectForPractice,
  onUpgradeClick,
  isPro,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedFunction, setSelectedFunction] = useState<ExcelFunction | null>(null);
  const [copiedSyntax, setCopiedSyntax] = useState(false);

  // Formula of the Day (seeded by current day)
  const formulaOfTheDay = useMemo(() => {
    const day = new Date().getDate();
    return functions[day % functions.length] || functions[0];
  }, [functions]);

  // Full-text search and filtering across ALL functions in the book
  const filteredFunctions = useMemo(() => {
    return functions.filter((fn) => {
      const matchesSearch =
        !searchQuery.trim() ||
        fn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fn.syntax.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fn.realWorldScenarios.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || fn.category === selectedCategory;
      const matchesDiff = difficultyFilter === 'all' || fn.difficulty === difficultyFilter;

      return matchesSearch && matchesCat && matchesDiff;
    });
  }, [functions, searchQuery, selectedCategory, difficultyFilter]);

  const handleCopySyntax = (syntax: string) => {
    navigator.clipboard.writeText(syntax);
    setCopiedSyntax(true);
    setTimeout(() => setCopiedSyntax(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto px-4 py-4 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Formula Reference Library
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Source of Truth: <i>Excel Formula Mastery 2026</i> · {functions.length} functions
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full font-semibold">
            100+ Functions
          </span>
        </div>
      </div>

      {/* Search Bar - Indexes ALL functions with discovery placeholder */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search any function — try XLOOKUP, FILTER, PMT..."
          className="w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-md"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Ad slot placeholder */}
      <BannerAdPlaceholder onUpgradeClick={onUpgradeClick} isPro={isPro} />

      {/* "Formula of the Day" Card (when no active search query) */}
      {!searchQuery && selectedCategory === 'all' && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/30 p-4 sm:p-5 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Formula of the Day</span>
              </div>
              <h3 className="text-xl font-black text-white">{formulaOfTheDay.name}</h3>
              <code className="text-xs font-mono text-emerald-300 block mt-0.5">
                {formulaOfTheDay.syntax}
              </code>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                {formulaOfTheDay.description}
              </p>
            </div>
            <button
              onClick={() => onSelectForPractice(formulaOfTheDay)}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-md shadow-emerald-950/40 flex items-center gap-1.5"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Category Grid (10 categories from book) */}
      {!searchQuery && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Browse by Category
            </h2>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs text-emerald-400 hover:underline font-medium"
              >
                View All Categories
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.iconName] || BookOpen;
              const count = functions.filter((f) => f.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                    isSelected
                      ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      Ch. {cat.chapter}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-100 truncate mt-1">
                      {cat.name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {count} functions · {cat.difficultyLabel.split('–')[0]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Function Results Header & Filter Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-slate-400">
            Showing <span className="font-bold text-slate-200">{filteredFunctions.length}</span> functions
          </div>

          {/* Difficulty Quick Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2 py-0.5 rounded capitalize text-[11px] font-medium transition-colors ${
                  difficultyFilter === diff
                    ? 'bg-slate-800 text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Function Cards List */}
        <div className="space-y-2">
          {filteredFunctions.map((fn) => {
            const isBookmarked = bookmarkedIds.includes(fn.id);
            const difficultyBadge =
              fn.difficulty === 'beginner'
                ? 'text-emerald-400'
                : fn.difficulty === 'intermediate'
                ? 'text-amber-400'
                : 'text-rose-400';

            return (
              <div
                key={fn.id}
                onClick={() => setSelectedFunction(fn)}
                className="group p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 hover:bg-slate-850/90 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors font-mono">
                      {fn.name}
                    </span>
                    <span className={`text-[10px] font-medium ${difficultyBadge} capitalize`}>
                      · {fn.difficulty}
                    </span>
                    {fn.microsoft365Only && (
                      <span className="text-[10px] font-medium text-cyan-400">
                        · M365 ★
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-xs text-slate-400 truncate mb-1">
                    {fn.syntax}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                    {fn.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(fn.id);
                    }}
                    className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Formula'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`}
                    />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula Detail Modal / Sheet */}
      {selectedFunction && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-100">
            {/* Top Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-3 bg-slate-900/90">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span>Chapter {selectedFunction.chapter}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{selectedFunction.difficulty}</span>
                  {selectedFunction.microsoft365Only && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-cyan-400 font-semibold">Microsoft 365 ★</span>
                    </>
                  )}
                </div>
                <h3 className="text-2xl font-black text-white font-mono">
                  {selectedFunction.name} Function
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onToggleBookmark(selectedFunction.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                  title="Bookmark"
                >
                  <Bookmark
                    className={`w-5 h-5 ${
                      bookmarkedIds.includes(selectedFunction.id)
                        ? 'fill-amber-400 text-amber-400'
                        : ''
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFunction(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
              {/* Syntax Card with Copy button */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <code className="font-mono text-xs sm:text-sm text-emerald-400 font-semibold overflow-x-auto">
                  {selectedFunction.syntax}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopySyntax(selectedFunction.syntax)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 shrink-0 transition-colors"
                  title="Copy Syntax"
                >
                  {copiedSyntax ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Plain-English Explanation */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Plain-English Explanation
                </h4>
                <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                  {selectedFunction.description}
                </p>
              </div>

              {/* Parameters List */}
              {selectedFunction.parameters.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Parameters
                  </h4>
                  <div className="space-y-2">
                    {selectedFunction.parameters.map((param, pIdx) => (
                      <div
                        key={pIdx}
                        className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 text-xs"
                      >
                        <div className="font-mono font-bold text-emerald-300">
                          {param.name} {param.required ? '(required)' : '(optional)'}
                        </div>
                        <div className="text-slate-300 mt-0.5">{param.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reference Examples from the book */}
              {selectedFunction.referenceExamples.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Examples from the Book
                  </h4>
                  <div className="space-y-3">
                    {selectedFunction.referenceExamples.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5"
                      >
                        <div className="text-slate-300 font-medium">{ex.context}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Formula:</span>
                          <code className="font-mono text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {ex.formula}
                          </code>
                        </div>
                        <div className="text-slate-400">
                          Result: <span className="font-mono text-amber-300 font-semibold">{ex.result}</span>
                        </div>
                        <p className="text-slate-400 italic text-[11px] pt-1 border-t border-slate-850">
                          {ex.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real World Scenarios */}
              {selectedFunction.realWorldScenarios.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Real-World Scenarios
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                    {selectedFunction.realWorldScenarios.map((sc, sIdx) => (
                      <li key={sIdx} className="leading-relaxed">
                        {sc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Sticky Action: Practice Button */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 hidden sm:inline">
                9 practical scenarios available
              </span>
              <button
                type="button"
                onClick={() => {
                  const target = selectedFunction;
                  setSelectedFunction(null);
                  onSelectForPractice(target);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Practice {selectedFunction.name} Function</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
