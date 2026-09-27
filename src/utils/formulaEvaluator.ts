import * as formulajs from '@formulajs/formulajs';
import { GridDataset } from '../types/formula';

export interface EvaluationResult {
  success: boolean;
  value: any;
  displayValue: string;
  error?: string;
  isCorrect?: boolean;
}

/**
 * Convert column letter (A, B, C...) to 0-based column index
 */
export function colLetterToIndex(col: string): number {
  let index = 0;
  const upper = col.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    index = index * 26 + (upper.charCodeAt(i) - 64);
  }
  return index - 1;
}

/**
 * Convert 0-based index to column letter
 */
export function indexToColLetter(index: number): string {
  let letter = '';
  let temp = index;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

/**
 * Parse an Excel coordinate like 'B2' into { colIndex: 1, rowIndex: 0 } (0-based in rows array)
 * Note: Excel row 1 is headers in our grid, row 2 is rows[0], row 3 is rows[1], etc.
 */
export function parseCellAddress(addr: string): { colIndex: number; rowIndex: number } | null {
  const match = addr.trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  const col = colLetterToIndex(match[1]);
  const rowNum = parseInt(match[2], 10);
  // Row 1 is header, row 2 is data index 0
  const rowIndex = rowNum - 2;
  return { colIndex: col, rowIndex };
}

/**
 * Extract value from dataset at cell coordinate
 */
export function getCellValue(dataset: GridDataset, addr: string): any {
  const parsed = parseCellAddress(addr);
  if (!parsed) return null;
  const { colIndex, rowIndex } = parsed;
  if (rowIndex < 0) {
    // Header row
    return dataset.headers[colIndex] ?? null;
  }
  if (rowIndex >= dataset.rows.length) return null;
  const row = dataset.rows[rowIndex];
  if (!row || colIndex >= row.length) return null;
  return row[colIndex];
}

/**
 * Extract 1D or 2D array from dataset for a range like 'A2:B5' or 'B2:B10'
 */
export function getRangeValues(dataset: GridDataset, rangeStr: string): any[] | any[][] {
  const parts = rangeStr.trim().toUpperCase().split(':');
  if (parts.length !== 2) return [];

  const start = parseCellAddress(parts[0]);
  const end = parseCellAddress(parts[1]);
  if (!start || !end) return [];

  const minCol = Math.min(start.colIndex, end.colIndex);
  const maxCol = Math.max(start.colIndex, end.colIndex);
  const minRow = Math.min(start.rowIndex, end.rowIndex);
  const maxRow = Math.max(start.rowIndex, end.rowIndex);

  const isSingleCol = minCol === maxCol;
  const isSingleRow = minRow === maxRow;

  if (isSingleCol) {
    const list: any[] = [];
    for (let r = minRow; r <= maxRow; r++) {
      if (r >= 0 && r < dataset.rows.length) {
        list.push(dataset.rows[r][minCol]);
      }
    }
    return list;
  }

  if (isSingleRow) {
    const list: any[] = [];
    if (minRow >= 0 && minRow < dataset.rows.length) {
      for (let c = minCol; c <= maxCol; c++) {
        list.push(dataset.rows[minRow][c]);
      }
    }
    return list;
  }

  // 2D matrix
  const matrix: any[][] = [];
  for (let r = minRow; r <= maxRow; r++) {
    if (r >= 0 && r < dataset.rows.length) {
      const rowSlice: any[] = [];
      for (let c = minCol; c <= maxCol; c++) {
        rowSlice.push(dataset.rows[r][c]);
      }
      matrix.push(rowSlice);
    }
  }
  return matrix;
}

/**
 * Parse all cell and range references from a formula string in real-time.
 * E.g., "=SUM(B2:B5) + ABS(A2)" -> ["B2", "B3", "B4", "B5", "A2"] (individual cells for grid highlighting)
 * And returns raw references like ["B2:B5", "A2"]
 */
export function extractReferencedCells(formula: string): {
  rawReferences: string[];
  allCellKeys: Set<string>; // 'B2', 'B3', etc.
} {
  const allCellKeys = new Set<string>();
  const rawReferences: string[] = [];

  if (!formula) return { rawReferences, allCellKeys };

  // Regex to match ranges: A1:B10 or $A$1:$B$10 or single cell A1, B2
  const rangeRegex = /\$?[A-Z]+\$?\d+:\$?[A-Z]+\$?\d+/gi;
  const singleCellRegex = /\b\$?[A-Z]+\$?\d+\b/gi;

  const cleanFormula = formula.replace(/"[^"]*"/g, ''); // strip strings

  const ranges = cleanFormula.match(rangeRegex) || [];
  for (const r of ranges) {
    const cleanR = r.replace(/\$/g, '').toUpperCase();
    rawReferences.push(cleanR);
    const [c1, c2] = cleanR.split(':');
    const p1 = parseCellAddress(c1);
    const p2 = parseCellAddress(c2);
    if (p1 && p2) {
      const minCol = Math.min(p1.colIndex, p2.colIndex);
      const maxCol = Math.max(p1.colIndex, p2.colIndex);
      const minRow = Math.min(p1.rowIndex, p2.rowIndex);
      const maxRow = Math.max(p1.rowIndex, p2.rowIndex);
      for (let col = minCol; col <= maxCol; col++) {
        for (let row = minRow; row <= maxRow; row++) {
          const colLetter = indexToColLetter(col);
          const rowNumber = row + 2;
          allCellKeys.add(`${colLetter}${rowNumber}`);
        }
      }
    }
  }

  // Remove ranges from formula before checking single cells
  const withoutRanges = cleanFormula.replace(rangeRegex, '');
  const singles = withoutRanges.match(singleCellRegex) || [];
  for (const s of singles) {
    const cleanS = s.replace(/\$/g, '').toUpperCase();
    if (parseCellAddress(cleanS)) {
      rawReferences.push(cleanS);
      allCellKeys.add(cleanS);
    }
  }

  return { rawReferences, allCellKeys };
}

/**
 * Modern Excel Functions not in standard formulajs:
 */
const customExcelFunctions: Record<string, Function> = {
  TEXTBEFORE: (text: string, delim: string, instance = 1) => {
    if (typeof text !== 'string') text = String(text ?? '');
    if (!delim) return text;
    if (instance === -1) {
      const idx = text.lastIndexOf(delim);
      return idx === -1 ? '#N/A' : text.slice(0, idx);
    }
    const idx = text.indexOf(delim);
    return idx === -1 ? '#N/A' : text.slice(0, idx);
  },
  TEXTAFTER: (text: string, delim: string, instance = 1, match_mode = 0, match_end = 0, if_not_found = '#N/A') => {
    if (typeof text !== 'string') text = String(text ?? '');
    if (!delim) return text;
    if (instance === -1) {
      const idx = text.lastIndexOf(delim);
      return idx === -1 ? if_not_found : text.slice(idx + delim.length);
    }
    const idx = text.indexOf(delim);
    return idx === -1 ? if_not_found : text.slice(idx + delim.length);
  },
  TEXTSPLIT: (text: string, colDelim: string) => {
    if (typeof text !== 'string') text = String(text ?? '');
    return text.split(colDelim);
  },
  VALUETOTEXT: (val: any) => String(val ?? ''),
  ARRAYTOTEXT: (arr: any[], format = 0) => {
    if (!Array.isArray(arr)) return String(arr ?? '');
    const flat = arr.flat(2);
    return format === 1 ? JSON.stringify(flat) : flat.join(', ');
  },
  UNIQUE: (arr: any[]) => {
    if (!Array.isArray(arr)) return [arr];
    const flat = arr.flat();
    return Array.from(new Set(flat));
  },
  FILTER: (arr: any[], include: any, ifEmpty = '#CALC!') => {
    if (!Array.isArray(arr)) return ifEmpty;
    if (typeof include === 'boolean') {
      return include ? arr : ifEmpty;
    }
    if (!Array.isArray(include)) return ifEmpty;
    const res = arr.filter((_, idx) => Boolean(include[idx]));
    return res.length > 0 ? res : ifEmpty;
  },
  SORTBY: (arr: any[], byArr: any[], sortOrder = 1) => {
    if (!Array.isArray(arr) || !Array.isArray(byArr)) return arr;
    const indices = arr.map((_, i) => i);
    indices.sort((i, j) => {
      const a = byArr[i];
      const b = byArr[j];
      if (typeof a === 'number' && typeof b === 'number') {
        return sortOrder === 1 ? a - b : b - a;
      }
      return sortOrder === 1 ? String(a).localeCompare(String(b)) : String(b).localeCompare(String(a));
    });
    return indices.map((i) => arr[i]);
  },
  SORT: (arr: any[], sortIndex = 1, sortOrder = 1) => {
    if (!Array.isArray(arr)) return [arr];
    const copy = [...arr];
    return copy.sort((a, b) => {
      const valA = Array.isArray(a) ? a[sortIndex - 1] : a;
      const valB = Array.isArray(b) ? b[sortIndex - 1] : b;
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 1 ? valA - valB : valB - valA;
      }
      return sortOrder === 1 ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });
  },
  CHOOSEROWS: (arr: any[][], ...rows: number[]) => {
    if (!Array.isArray(arr)) return [];
    return rows.map(r => arr[r - 1]);
  },
  CHOOSECOLS: (arr: any[][], ...cols: number[]) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(row => (Array.isArray(row) ? cols.map(c => row[c - 1]) : row));
  },
  TAKE: (arr: any[], rows?: number, cols?: number) => {
    if (!Array.isArray(arr)) return arr;
    let res = [...arr];
    if (rows !== undefined) {
      res = rows >= 0 ? res.slice(0, rows) : res.slice(rows);
    }
    return res;
  },
  DROP: (arr: any[], rows?: number, cols?: number) => {
    if (!Array.isArray(arr)) return arr;
    let res = [...arr];
    if (rows !== undefined) {
      res = rows >= 0 ? res.slice(rows) : res.slice(0, rows);
    }
    return res;
  },
  TOCOL: (arr: any[][]) => {
    if (!Array.isArray(arr)) return [arr];
    return arr.flat();
  },
  TOROW: (arr: any[][]) => {
    if (!Array.isArray(arr)) return [arr];
    return arr.flat();
  },
  HSTACK: (...arrays: any[]) => {
    return arrays.flat();
  },
  VSTACK: (...arrays: any[]) => {
    return arrays.flat();
  },
  SEQUENCE: (rows = 1, cols = 1, start = 1, step = 1) => {
    const res: number[] = [];
    for (let i = 0; i < rows * cols; i++) {
      res.push(start + i * step);
    }
    return res;
  },
  PERCENTOF: (subset: any, total: any) => {
    const sumSubset = Array.isArray(subset) ? subset.reduce((a, b) => Number(a) + Number(b), 0) : Number(subset);
    const sumTotal = Array.isArray(total) ? total.reduce((a, b) => Number(a) + Number(b), 0) : Number(total);
    if (!sumTotal) return 0;
    return Number((sumSubset / sumTotal).toFixed(4));
  },
  REGEXTEST: (text: string, pattern: string) => {
    try {
      const reg = new RegExp(pattern);
      return reg.test(String(text));
    } catch {
      return false;
    }
  },
  REGEXEXTRACT: (text: string, pattern: string) => {
    try {
      const reg = new RegExp(pattern);
      const m = String(text).match(reg);
      return m ? m[0] : '#N/A';
    } catch {
      return '#VALUE!';
    }
  },
  REGEXREPLACE: (text: string, pattern: string, replacement: string) => {
    try {
      const reg = new RegExp(pattern, 'g');
      return String(text).replace(reg, replacement);
    } catch {
      return '#VALUE!';
    }
  },
  FIELDVALUE: (dataCell: any, fieldName: string) => {
    if (typeof dataCell === 'object' && dataCell !== null) {
      return dataCell[fieldName] ?? dataCell[fieldName.toLowerCase()] ?? '#FIELD!';
    }
    return `#FIELD!`;
  },
  IMAGE: (source: string, alt = '') => `[IMAGE: ${alt || source}]`,
  COPILOT: (prompt: string, ...data: any[]) => {
    return `AI Analysis: Processed prompt "${prompt}" on ${data.length ? data.length + ' ranges' : 'data'}.`;
  },
  XLOOKUP: (lookupVal: any, lookupArr: any[], returnArr: any[], notFound = '#N/A', matchMode = 0) => {
    if (!Array.isArray(lookupArr) || !Array.isArray(returnArr)) return notFound;
    let idx = -1;
    if (matchMode === 0) {
      idx = lookupArr.findIndex(x => String(x).toLowerCase() === String(lookupVal).toLowerCase());
    } else if (matchMode === -1) {
      // Exact or next smaller
      for (let i = 0; i < lookupArr.length; i++) {
        if (Number(lookupArr[i]) <= Number(lookupVal)) idx = i;
      }
    } else {
      idx = lookupArr.findIndex(x => String(x).includes(String(lookupVal)));
    }
    return idx !== -1 ? returnArr[idx] : notFound;
  },
  XMATCH: (lookupVal: any, lookupArr: any[], matchMode = 0, searchMode = 1) => {
    if (!Array.isArray(lookupArr)) return '#N/A';
    if (searchMode === -1) {
      for (let i = lookupArr.length - 1; i >= 0; i--) {
        if (String(lookupArr[i]).toLowerCase() === String(lookupVal).toLowerCase()) return i + 1;
      }
      return '#N/A';
    }
    const idx = lookupArr.findIndex(x => String(x).toLowerCase() === String(lookupVal).toLowerCase());
    return idx !== -1 ? idx + 1 : '#N/A';
  },
  GROUPBY: (keys: any[], values: any[], funcCode: any = 1) => {
    if (!Array.isArray(keys) || !Array.isArray(values)) return [];
    const groups = new Map<string, number[]>();
    keys.forEach((k, i) => {
      const keyStr = String(k);
      if (!groups.has(keyStr)) groups.set(keyStr, []);
      groups.get(keyStr)!.push(Number(values[i]) || 0);
    });
    const result: any[][] = [];
    groups.forEach((vals, k) => {
      let agg = 0;
      if (funcCode === 1 || funcCode === 'SUM') agg = vals.reduce((a, b) => a + b, 0);
      else if (funcCode === 2 || funcCode === 'AVERAGE') agg = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
      else if (funcCode === 3 || funcCode === 'COUNT') agg = vals.length;
      result.push([k, Math.round(agg * 100) / 100]);
    });
    return result;
  },
  PIVOTBY: (rowKeys: any[], colKeys: any[], values: any[], funcCode = 1) => {
    return customExcelFunctions.GROUPBY(rowKeys, values, funcCode);
  }
};

/**
 * Format any evaluated value for display
 */
export function formatEvaluationResult(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return val.toLocaleString();
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    if (Array.isArray(val[0])) {
      return val.map(r => r.join(' | ')).join('\n');
    }
    return val.join(', ');
  }
  return String(val);
}

/**
 * Compare user evaluated result to target result with smart tolerance
 */
export function checkResultMatch(actual: any, target: any): boolean {
  if (actual === target) return true;

  // Numbers comparison with delta
  if (typeof actual === 'number' && typeof target === 'number') {
    return Math.abs(actual - target) < 0.05 || Math.abs(actual - target) / Math.abs(target || 1) < 0.01;
  }

  // String comparison case-insensitive & trimmed
  if (typeof actual === 'string' && typeof target === 'string') {
    return actual.trim().toLowerCase() === target.trim().toLowerCase();
  }

  // Number vs String number
  if (!isNaN(Number(actual)) && !isNaN(Number(target))) {
    return Math.abs(Number(actual) - Number(target)) < 0.05;
  }

  // Booleans
  if (typeof actual === 'boolean' || typeof target === 'boolean') {
    return Boolean(actual) === Boolean(target);
  }

  // Arrays
  if (Array.isArray(actual) && Array.isArray(target)) {
    if (actual.length !== target.length) return false;
    return actual.every((item, i) => checkResultMatch(item, target[i]));
  }

  return false;
}

/**
 * Main Formula Evaluator:
 * Executes Excel formula string against the grid dataset
 */
export function evaluateFormula(formulaText: string, dataset: GridDataset, targetResult?: any): EvaluationResult {
  let text = formulaText.trim();
  if (!text) {
    return { success: false, value: null, displayValue: '', error: 'Enter a formula starting with =' };
  }

  if (text.startsWith('=')) {
    text = text.substring(1).trim();
  }

  try {
    // 1. Build execution context with dataset references
    // Replace ranges like B2:B10 with evaluated arrays
    // and cell references like A2 with values
    const rangeRegex = /\$?[A-Z]+\$?\d+:\$?[A-Z]+\$?\d+/gi;
    const singleCellRegex = /\b\$?[A-Z]+\$?\d+\b/gi;

    let jsExpression = text;

    // Collect ranges and replace with variable placeholders
    const rangeReplacements = new Map<string, any>();
    let rangeCounter = 0;

    jsExpression = jsExpression.replace(rangeRegex, (match) => {
      const cleanRange = match.replace(/\$/g, '').toUpperCase();
      const varName = `__RANGE_${rangeCounter++}__`;
      const vals = getRangeValues(dataset, cleanRange);
      rangeReplacements.set(varName, vals);
      return varName;
    });

    // Collect single cells and replace with variable placeholders
    const cellReplacements = new Map<string, any>();
    let cellCounter = 0;

    jsExpression = jsExpression.replace(singleCellRegex, (match) => {
      const cleanCell = match.replace(/\$/g, '').toUpperCase();
      // Check if it's a known function or word
      if (['TRUE', 'FALSE', 'IF', 'AND', 'OR', 'NOT'].includes(cleanCell)) {
        return match;
      }
      const varName = `__CELL_${cellCounter++}__`;
      const val = getCellValue(dataset, cleanCell);
      cellReplacements.set(varName, val);
      return varName;
    });

    // Vector comparison helper for Excel array formulas (e.g. FILTER(A2:A10, B2:B10 > 50))
    const compareHelper = (a: any, op: string, b: any) => {
      const cmp = (x: any, y: any) => {
        if (op === '>') return Number(x) > Number(y);
        if (op === '<') return Number(x) < Number(y);
        if (op === '>=') return Number(x) >= Number(y);
        if (op === '<=') return Number(x) <= Number(y);
        if (op === '=' || op === '===' || op === '==') {
          return String(x).trim().toLowerCase() === String(y).trim().toLowerCase();
        }
        if (op === '<>' || op === '!==' || op === '!=') {
          return String(x).trim().toLowerCase() !== String(y).trim().toLowerCase();
        }
        return false;
      };

      if (Array.isArray(a) && !Array.isArray(b)) {
        return a.map((item) => cmp(item, b));
      }
      if (!Array.isArray(a) && Array.isArray(b)) {
        return b.map((item) => cmp(a, item));
      }
      if (Array.isArray(a) && Array.isArray(b)) {
        return a.map((item, i) => cmp(item, b[i]));
      }
      return cmp(a, b);
    };

    // Build scope combining formulajs, customExcelFunctions, ranges, and cells
    const scope: Record<string, any> = {
      ...formulajs,
      ...customExcelFunctions,
      __VECTOR_COMPARE__: compareHelper,
      // Common aliases
      TODAY: () => new Date(),
      NOW: () => new Date(),
    };

    rangeReplacements.forEach((val, key) => {
      scope[key] = val;
    });

    cellReplacements.forEach((val, key) => {
      scope[key] = val;
    });

    let transformed = jsExpression;

    // Transform range comparisons like __RANGE_0__ > 50 to __VECTOR_COMPARE__(__RANGE_0__, '>', 50)
    transformed = transformed.replace(
      /(__RANGE_\d+__)\s*([><]=?|<>|=)\s*(__RANGE_\d+__|__CELL_\d+__|"[^"]*"|\d+(?:\.\d+)?|true|false)/gi,
      (_, p1, op, p2) => `__VECTOR_COMPARE__(${p1}, '${op}', ${p2})`
    );

    // Replace <> with !==
    transformed = transformed.replace(/<>/g, ' !== ');

    // Replace single = (equality) with === when used in comparisons
    transformed = transformed.replace(/([A-Za-z0-9_")\]])\s*=\s*([A-Za-z0-9_"(])/g, '$1 === $2');

    const scopeKeys = Object.keys(scope);
    const scopeValues = Object.values(scope);

    // Compile and execute in isolated function
    const fn = new Function(...scopeKeys, `
      try {
        with (this) {
          return (${transformed});
        }
      } catch (err) {
        throw err;
      }
    `);

    const result = fn.apply(scope, scopeValues);

    const isCorrect = targetResult !== undefined ? checkResultMatch(result, targetResult) : undefined;

    return {
      success: true,
      value: result,
      displayValue: formatEvaluationResult(result),
      isCorrect
    };
  } catch (err: any) {
    // Attempt fallback via formulajs direct call for basic functions:
    // e.g. ABS(number), ROUND(x, y), PMT(...)
    const matchSimple = text.match(/^([A-Z0-9_\.]+)\s*\((.*)\)$/i);
    if (matchSimple) {
      const funcName = matchSimple[1].toUpperCase();
      const fn = (customExcelFunctions as any)[funcName] || (formulajs as any)[funcName];
      if (typeof fn === 'function') {
        try {
          // If fallback succeeds or gives error
        } catch {
          // pass
        }
      }
    }

    return {
      success: false,
      value: null,
      displayValue: '#ERROR!',
      error: err?.message || 'Formula calculation error'
    };
  }
}
