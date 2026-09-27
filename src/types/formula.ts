export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type CategoryId = 
  | 'math-trig'
  | 'statistical'
  | 'logical'
  | 'text'
  | 'date-time'
  | 'lookup-reference'
  | 'financial'
  | 'dynamic-arrays'
  | 'lambda-helpers'
  | 'summary-grouping-ai';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  chapter: number;
  difficultyLabel: string;
  difficulty: Difficulty;
  description: string;
  iconName: string;
  color: string;
}

export interface FormulaParameter {
  name: string;
  required: boolean;
  description: string;
}

export interface ReferenceExample {
  context: string;
  formula: string;
  result: string;
  explanation: string;
}

export interface GridCell {
  value: string | number | boolean | null;
  formatted?: string;
  type?: 'text' | 'number' | 'currency' | 'date';
}

export interface GridDataset {
  columns: string[]; // ['A', 'B', 'C', 'D']
  headers: string[]; // e.g. ['Item', 'Projected', 'Actual', 'Output']
  // Rows data: each row corresponds to Excel row 2, row 3, etc.
  rows: (string | number | boolean | null | any)[][];
  targetCell?: string; // e.g. 'C2' or 'D2'
  targetCellDescription?: string;
}

export interface PracticeExample {
  id: string;
  title: string;
  tier: 'basic' | 'intermediate' | 'advanced';
  index: number; // 0 to 8
  locked: boolean;
  scenario: string;
  dataset: GridDataset;
  targetCell?: string;
  targetResult: any;
  targetResultDisplay: string;
  referenceFormula: string;
  hint: string;
  explanation: string;
}

export interface ExcelFunction {
  id: string;
  name: string;
  category: CategoryId;
  difficulty: Difficulty;
  chapter: number;
  microsoft365Only: boolean;
  syntax: string;
  description: string;
  parameters: FormulaParameter[];
  referenceExamples: ReferenceExample[];
  realWorldScenarios: string[];
  practiceExamples: PracticeExample[];
}

export interface Puzzle {
  id: string;
  title: string;
  category: CategoryId;
  difficulty: Difficulty;
  scenario: string;
  prompt: string;
  dataset: GridDataset;
  targetCell?: string;
  targetFormula: string;
  expectedResult: any;
  expectedResultDisplay: string;
  hint: string;
  explanation: string;
}

export interface UserProgress {
  isPro: boolean;
  streakDays: number;
  lastActiveDate: string;
  completedPractice: Record<string, number[]>; // functionId -> array of completed example indices (0-8)
  completedPuzzles: Record<string, boolean>; // puzzleId -> boolean
  bookmarkedFunctions: string[]; // functionIds
  unlockedTiers: {
    beginner: boolean;
    intermediate: boolean;
    advanced: boolean;
  };
}
