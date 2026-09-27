import { allExcelFunctions } from '../data/functionsData';

export interface AutocompleteTarget {
  query: string;
  startIndex: number;
  endIndex: number;
}

export interface FunctionSuggestion {
  name: string;
  syntax: string;
  description: string;
  category: string;
}

/**
 * Checks if the text at caret is currently typing a function name (e.g. '=S', '=SUM(', '=IF(A1, X')
 */
export function getActiveFunctionQuery(text: string, caretPos?: number): AutocompleteTarget | null {
  if (!text.includes('=')) return null;

  const pos = caretPos !== undefined && caretPos >= 0 ? caretPos : text.length;
  const textBefore = text.slice(0, pos);

  // Match letters immediately following '=', '(', ',', '+', '-', '*', '/', '&', ':', '>', '<', etc.
  const match = textBefore.match(/([=+\-*/,(:&><]\s*)([A-Za-z0-9_.]+)$/);
  if (!match) return null;

  const query = match[2];
  // Do not suggest if query is purely numeric (e.g. user typed =123)
  if (/^\d+$/.test(query)) return null;

  const startIndex = pos - query.length;
  return {
    query,
    startIndex,
    endIndex: pos,
  };
}

/**
 * Get matching Excel function suggestions for a query string
 */
export function getFunctionSuggestions(query: string, limit = 8): FunctionSuggestion[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toUpperCase();

  const startsWithMatches: FunctionSuggestion[] = [];
  const containsMatches: FunctionSuggestion[] = [];
  const seen = new Set<string>();

  for (const fn of allExcelFunctions) {
    if (seen.has(fn.name)) continue;
    seen.add(fn.name);

    const upper = fn.name.toUpperCase();
    if (upper.startsWith(q)) {
      startsWithMatches.push({
        name: fn.name,
        syntax: fn.syntax,
        description: fn.description,
        category: fn.category,
      });
    } else if (upper.includes(q)) {
      containsMatches.push({
        name: fn.name,
        syntax: fn.syntax,
        description: fn.description,
        category: fn.category,
      });
    }
  }

  // Common core formulas fallback if not found
  const CORE_FALLBACKS: FunctionSuggestion[] = [
    { name: 'SUM', syntax: '=SUM(number1, [number2], ...)', description: 'Adds all the numbers in a range of cells.', category: 'math-trig' },
    { name: 'AVERAGE', syntax: '=AVERAGE(number1, [number2], ...)', description: 'Returns the average (arithmetic mean) of arguments.', category: 'statistical' },
    { name: 'IF', syntax: '=IF(logical_test, [value_if_true], [value_if_false])', description: 'Checks whether condition is met and returns one value if TRUE, and another if FALSE.', category: 'logical' },
    { name: 'VLOOKUP', syntax: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])', description: 'Looks up a value in the leftmost column of a table.', category: 'lookup-reference' },
    { name: 'XLOOKUP', syntax: '=XLOOKUP(lookup_value, lookup_array, return_array, ...)', description: 'Searches a range or an array, and returns an item corresponding to the first match.', category: 'lookup-reference' },
    { name: 'COUNT', syntax: '=COUNT(value1, [value2], ...)', description: 'Counts how many numbers are in the list of arguments.', category: 'statistical' },
    { name: 'COUNTA', syntax: '=COUNTA(value1, [value2], ...)', description: 'Counts how many values are in the list of arguments.', category: 'statistical' },
    { name: 'MAX', syntax: '=MAX(number1, [number2], ...)', description: 'Returns the largest value in a set of values.', category: 'statistical' },
    { name: 'MIN', syntax: '=MIN(number1, [number2], ...)', description: 'Returns the smallest number in a set of values.', category: 'statistical' },
    { name: 'ABS', syntax: '=ABS(number)', description: 'Returns the absolute value of a number.', category: 'math-trig' },
    { name: 'ROUND', syntax: '=ROUND(number, num_digits)', description: 'Rounds a number to a specified number of digits.', category: 'math-trig' },
    { name: 'CONCAT', syntax: '=CONCAT(text1, [text2], ...)', description: 'Combines text from multiple ranges and/or strings.', category: 'text' },
  ];

  for (const fallback of CORE_FALLBACKS) {
    if (!seen.has(fallback.name)) {
      seen.add(fallback.name);
      if (fallback.name.startsWith(q)) {
        startsWithMatches.push(fallback);
      } else if (fallback.name.includes(q)) {
        containsMatches.push(fallback);
      }
    }
  }

  return [...startsWithMatches, ...containsMatches].slice(0, limit);
}

/**
 * Replaces the query with the function name and opens a parenthesis
 */
export function applyFunctionSuggestion(
  text: string,
  target: AutocompleteTarget,
  functionName: string
): { newText: string; newCaretPos: number } {
  const before = text.slice(0, target.startIndex);
  const after = text.slice(target.endIndex);
  const insertText = `${functionName}(`;
  const newText = `${before}${insertText}${after}`;
  const newCaretPos = target.startIndex + insertText.length;
  return { newText, newCaretPos };
}
