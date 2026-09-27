import { PracticeExample, GridDataset } from '../types/formula';

export function makePracticeDataset(
  columns: string[],
  headers: string[],
  rows: any[][],
  targetCellDescription?: string,
  targetCell?: string
): GridDataset {
  // Ensure every dataset has 3 to 4 columns (A, B, C, D)
  let finalCols = [...columns];
  let finalHeaders = [...headers];
  let finalRows = rows.map((r) => [...r]);

  // If only 1 column, expand to A, B, C (with B as Context/Ref, C as Result)
  if (finalCols.length === 1) {
    finalCols = ['A', 'B', 'C'];
    finalHeaders = [headers[0] || 'Value', 'Reference', 'Result (fx)'];
    finalRows = finalRows.map((r, i) => [
      r[0],
      i === 0 ? 'Target Row' : `Row ${i + 1}`,
      null, // C2 will receive the formula output
    ]);
  } else if (finalCols.length === 2) {
    // If 2 columns (A & B), expand to A, B, C (with C as Result)
    finalCols = ['A', 'B', 'C'];
    finalHeaders = [headers[0] || 'Col A', headers[1] || 'Col B', 'Result (fx)'];
    finalRows = finalRows.map((r) => [r[0], r[1], null]);
  } else if (finalCols.length === 3) {
    // If 3 columns (A, B, C), if 3rd column is data, add Column D as Result (fx)
    // Check if 3rd col already has data
    const hasDataInThird = finalRows.some((r) => r[2] !== null && r[2] !== undefined);
    if (hasDataInThird) {
      finalCols = ['A', 'B', 'C', 'D'];
      finalHeaders = [headers[0], headers[1], headers[2], 'Result (fx)'];
      finalRows = finalRows.map((r) => [r[0], r[1], r[2], null]);
    }
  }

  // Determine target cell (defaults to C2 if 3 cols, or D2 if 4 cols)
  const resolvedTargetCell =
    targetCell || (finalCols.length >= 4 ? 'D2' : 'C2');

  return {
    columns: finalCols,
    headers: finalHeaders,
    rows: finalRows,
    targetCell: resolvedTargetCell,
    targetCellDescription: targetCellDescription || `Output in ${resolvedTargetCell}`,
  };
}

export function createPracticeSet(
  funcName: string,
  configs: {
    title: string;
    scenario: string;
    dataset: GridDataset;
    targetResult: any;
    targetResultDisplay: string;
    referenceFormula: string;
    hint: string;
    explanation: string;
    targetCell?: string;
  }[]
): PracticeExample[] {
  // We need exactly 12 examples:
  // 4 Basic (indices 0, 1, 2, 3) -> ALL 4 OPEN (free)
  // 4 Intermediate (indices 4, 5, 6, 7) -> 1st OPEN (idx 4), remaining 3 (5, 6, 7) LOCKED (pro)
  // 4 Advanced (indices 8, 9, 10, 11) -> ALL 4 LOCKED (pro)

  // Ensure we have 12 items. If input has 9 items, dynamically generate the 4th item for each tier
  const fullConfigs = [...configs];

  if (fullConfigs.length < 12) {
    // If we have 9 items (3 basic, 3 int, 3 adv), expand to 12
    const basic3 = fullConfigs.slice(0, 3);
    const int3 = fullConfigs.slice(3, 6);
    const adv3 = fullConfigs.slice(6, 9);

    // Create 4th basic using basic3 tier template
    const bTpl = basic3[1] || basic3[0];
    const b4 = {
      title: `${bTpl.title} (Batch 2)`,
      scenario: `Extended basic drill for ${funcName}: ${bTpl.scenario}`,
      dataset: {
        ...bTpl.dataset,
        columns: [...bTpl.dataset.columns],
        headers: [...bTpl.dataset.headers],
        rows: bTpl.dataset.rows.map((r) => [...r]),
        targetCell: bTpl.targetCell || bTpl.dataset.targetCell || (bTpl.dataset.columns.length >= 4 ? 'D2' : 'C2'),
      },
      targetResult: bTpl.targetResult,
      targetResultDisplay: bTpl.targetResultDisplay,
      referenceFormula: bTpl.referenceFormula,
      hint: bTpl.hint,
      explanation: bTpl.explanation,
      targetCell: bTpl.targetCell || bTpl.dataset.targetCell || (bTpl.dataset.columns.length >= 4 ? 'D2' : 'C2'),
    };

    // Create 4th intermediate using int3 tier template
    const iTpl = int3[1] || int3[0];
    const i4 = {
      title: `${iTpl.title} (Multi-Record)`,
      scenario: `Extended intermediate challenge for ${funcName}: ${iTpl.scenario}`,
      dataset: {
        ...iTpl.dataset,
        columns: [...iTpl.dataset.columns],
        headers: [...iTpl.dataset.headers],
        rows: iTpl.dataset.rows.map((r) => [...r]),
        targetCell: iTpl.targetCell || iTpl.dataset.targetCell || (iTpl.dataset.columns.length >= 4 ? 'D2' : 'C2'),
      },
      targetResult: iTpl.targetResult,
      targetResultDisplay: iTpl.targetResultDisplay,
      referenceFormula: iTpl.referenceFormula,
      hint: iTpl.hint,
      explanation: iTpl.explanation,
      targetCell: iTpl.targetCell || iTpl.dataset.targetCell || (iTpl.dataset.columns.length >= 4 ? 'D2' : 'C2'),
    };

    // Create 4th advanced using adv3 tier template
    const aTpl = adv3[1] || adv3[0];
    const a4 = {
      title: `${aTpl.title} (Master Case)`,
      scenario: `Composite advanced business case for ${funcName}: ${aTpl.scenario}`,
      dataset: {
        ...aTpl.dataset,
        columns: [...aTpl.dataset.columns],
        headers: [...aTpl.dataset.headers],
        rows: aTpl.dataset.rows.map((r) => [...r]),
        targetCell: aTpl.targetCell || aTpl.dataset.targetCell || (aTpl.dataset.columns.length >= 4 ? 'D2' : 'C2'),
      },
      targetResult: aTpl.targetResult,
      targetResultDisplay: aTpl.targetResultDisplay,
      referenceFormula: aTpl.referenceFormula,
      hint: aTpl.hint,
      explanation: aTpl.explanation,
      targetCell: aTpl.targetCell || aTpl.dataset.targetCell || (aTpl.dataset.columns.length >= 4 ? 'D2' : 'C2'),
    };

    // Reconstruct 12 items: 4 basic, 4 intermediate, 4 advanced
    fullConfigs.splice(3, 0, b4); // index 3
    fullConfigs.splice(7, 0, i4); // index 7
    fullConfigs.push(a4);         // index 11
  }

  return fullConfigs.map((cfg, idx) => {
    // 4 Basic: 0, 1, 2, 3
    // 4 Intermediate: 4, 5, 6, 7
    // 4 Advanced: 8, 9, 10, 11
    const tier: 'basic' | 'intermediate' | 'advanced' =
      idx < 4 ? 'basic' : idx < 8 ? 'intermediate' : 'advanced';

    // Access rule:
    // All 4 Basic are free/open (idx 0, 1, 2, 3)
    // 1st Intermediate is free/open (idx 4)
    // Remaining 3 Intermediate (idx 5, 6, 7) are locked
    // All 4 Advanced (idx 8, 9, 10, 11) are locked
    const locked = idx > 4;

    const tierNumber =
      idx < 4 ? idx + 1 : idx < 8 ? idx - 3 : idx - 7;

    const resolvedTargetCell = cfg.targetCell || cfg.dataset.targetCell || 'C2';

    return {
      id: `${funcName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-ex-${idx + 1}`,
      title: `${cfg.title} (${tier.toUpperCase()} ${tierNumber})`,
      tier,
      index: idx,
      locked,
      scenario: cfg.scenario,
      dataset: cfg.dataset,
      targetCell: resolvedTargetCell,
      targetResult: cfg.targetResult,
      targetResultDisplay: cfg.targetResultDisplay,
      referenceFormula: cfg.referenceFormula,
      hint: cfg.hint,
      explanation: cfg.explanation,
    };
  });
}

