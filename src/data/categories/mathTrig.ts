import { ExcelFunction } from '../../types/formula';
import { makePracticeDataset, createPracticeSet } from '../practiceFactory';

export const mathTrigFunctions: ExcelFunction[] = [
  {
    id: 'abs',
    name: 'ABS',
    category: 'math-trig',
    difficulty: 'beginner',
    chapter: 2,
    microsoft365Only: false,
    syntax: '=ABS(number)',
    description: 'Returns the absolute (positive) value of a number, stripping away minus signs. Essential for variance analysis, error margins, and cash flow magnitude.',
    parameters: [{ name: 'number', required: true, description: 'Any real number, cell reference, or calculation result.' }],
    referenceExamples: [
      { context: 'Cell A2 has net outflow -450.', formula: '=ABS(A2)', result: '450', explanation: 'Converts negative outflow into unsigned magnitude.' },
      { context: 'Projected sales B2=1200, Actual C2=980.', formula: '=ABS(B2-C2)', result: '220', explanation: 'Calculates the performance gap regardless of direction.' },
      { context: 'Month-end variance A2=-1340.', formula: '=IF(ABS(A2)>1000,"High Variance","Normal")', result: 'High Variance', explanation: 'Flags major deviations over 1,000 in either direction.' }
    ],
    realWorldScenarios: [
      'Accounting: Convert negative journal entries to positive figures for gross volume.',
      'Manufacturing: Measure dimensional deviation from target tolerance.',
      'Sales Management: Benchmark gap between target and actual deals.'
    ],
    practiceExamples: createPracticeSet('ABS', [
      {
        title: 'Cash Outflow Magnitude',
        scenario: 'Find the positive magnitude of the daily net cash outflow in cell A2.',
        dataset: makePracticeDataset(['A'], ['CashFlow'], [[-450], [320], [-180]]),
        targetResult: 450,
        targetResultDisplay: '450',
        referenceFormula: '=ABS(A2)',
        hint: 'Reference cell A2 inside the ABS function: =ABS(A2)',
        explanation: 'ABS strips the negative sign from -450 to return 450.'
      },
      {
        title: 'Sales Variance Gap',
        scenario: 'Calculate the absolute sales gap between Projected (B2) and Actual (C2).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Month', 'Projected', 'Actual'], [['Jan', 1200, 980], ['Feb', 1500, 1620]]),
        targetResult: 220,
        targetResultDisplay: '220',
        referenceFormula: '=ABS(B2-C2)',
        hint: 'Subtract C2 from B2 inside ABS: =ABS(B2-C2)',
        explanation: '1200 minus 980 is 220. ABS ensures variance is positive.'
      },
      {
        title: 'Temperature Deviation',
        scenario: 'Find the absolute temperature difference between Target 20°C (B2) and Lab Sensor 14°C (C2).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Sensor', 'TargetTemp', 'MeasuredTemp'], [['Sensor-1', 20, 14], ['Sensor-2', 20, 23]]),
        targetResult: 6,
        targetResultDisplay: '6',
        referenceFormula: '=ABS(B2-C2)',
        hint: 'Use =ABS(B2-C2)',
        explanation: 'The difference of 6 degrees deviation is captured without sign.'
      },
      {
        title: 'Threshold Breach Check',
        scenario: 'Check if variance in A2 exceeds 500 using IF and ABS. Output "Alert" or "OK".',
        dataset: makePracticeDataset(['A'], ['BudgetDelta'], [[-750], [120], [-300]]),
        targetResult: 'Alert',
        targetResultDisplay: '"Alert"',
        referenceFormula: '=IF(ABS(A2)>500,"Alert","OK")',
        hint: 'Wrap ABS(A2)>500 inside an IF statement.',
        explanation: 'ABS(-750) is 750, which is > 500, so it returns "Alert".'
      },
      {
        title: 'Returned Goods Quantity',
        scenario: 'Inventory returns in A2 are logged as -15. Convert to positive stock quantity.',
        dataset: makePracticeDataset(['A'], ['ReturnedUnits'], [[-15], [-8], [-22]]),
        targetResult: 15,
        targetResultDisplay: '15',
        referenceFormula: '=ABS(A2)',
        hint: 'Use =ABS(A2)',
        explanation: 'Converts negative return count into positive restock count.'
      },
      {
        title: 'Foreign Exchange Rate Spread',
        scenario: 'Calculate the absolute basis point gap between Buy rate (B2: 1.0850) and Sell rate (C2: 1.0820).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Pair', 'Buy', 'Sell'], [['EUR/USD', 1.085, 1.082]]),
        targetResult: 0.003,
        targetResultDisplay: '0.003',
        referenceFormula: '=ABS(B2-C2)',
        hint: 'Subtract C2 from B2 inside ABS.',
        explanation: 'Gives the positive spread value 0.003.'
      },
      {
        title: 'Sum of Absolute Magnitudes',
        scenario: 'Total the absolute transaction volume across daily movements in A2:A4.',
        dataset: makePracticeDataset(['A'], ['DailyDelta'], [[-100], [250], [-150]]),
        targetResult: 500,
        targetResultDisplay: '500',
        referenceFormula: '=SUM(ABS(A2:A4))',
        hint: 'Combine SUM and ABS on range A2:A4.',
        explanation: '|-100| + |250| + |-150| = 100 + 250 + 150 = 500.'
      },
      {
        title: 'Machine Calibration Bias',
        scenario: 'Determine the error magnitude between calibrated weight B2 (50.0) and scale reading C2 (49.4).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Part', 'Standard', 'Reading'], [['Bolt-M8', 50.0, 49.4]]),
        targetResult: 0.6,
        targetResultDisplay: '0.6',
        referenceFormula: '=ABS(B2-C2)',
        hint: 'Use =ABS(B2-C2)',
        explanation: 'Captures the 0.6 unit calibration bias.'
      },
      {
        title: 'Portfolio Tracking Error',
        scenario: 'Calculate the absolute tracking error between Benchmark return B2 (0.08) and Fund return C2 (0.055).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Year', 'Benchmark', 'Fund'], [['2026', 0.08, 0.055]]),
        targetResult: 0.025,
        targetResultDisplay: '0.025',
        referenceFormula: '=ABS(B2-C2)',
        hint: 'Use =ABS(B2-C2)',
        explanation: 'Tracking error magnitude is 0.025 (2.5%).'
      }
    ])
  },
  {
    id: 'ceiling-math',
    name: 'CEILING.MATH',
    category: 'math-trig',
    difficulty: 'beginner',
    chapter: 2,
    microsoft365Only: false,
    syntax: '=CEILING.MATH(number, [significance], [mode])',
    description: 'Rounds a number UP to the nearest integer or specified multiple. Perfect for bulk packaging, billing hours, and psychological pricing.',
    parameters: [
      { name: 'number', required: true, description: 'The value to round up.' },
      { name: 'significance', required: false, description: 'The multiple to round to (default 1).' },
      { name: 'mode', required: false, description: 'Direction for negative numbers (0 towards zero, 1 away).' }
    ],
    referenceExamples: [
      { context: 'Billable time A2=12.3 hours.', formula: '=CEILING.MATH(A2)', result: '13', explanation: 'Rounds up to full whole billing hours.' },
      { context: 'Raw price A2=7.89, round to 5 cents.', formula: '=CEILING.MATH(A2, 0.05)', result: '7.90', explanation: 'Rounds up to the nearest $0.05 boundary.' },
      { context: 'Order quantity A2=43, sold in packs of 10.', formula: '=CEILING.MATH(A2, 10)', result: '50', explanation: 'Rounds up to 5 whole packs.' }
    ],
    realWorldScenarios: [
      'Retail Pricing: Enforce price points ending on neat nickel/dime boundaries.',
      'Logistics: Round units to pallet/case capacities.',
      'Timesheets: Round contractor minutes up to 15-minute billable blocks.'
    ],
    practiceExamples: createPracticeSet('CEILING.MATH', [
      {
        title: 'Billable Hour Rounding',
        scenario: 'Round up the task duration in cell A2 (12.3 hours) to the next full hour.',
        dataset: makePracticeDataset(['A'], ['TaskHours'], [[12.3], [4.1], [8.7]]),
        targetResult: 13,
        targetResultDisplay: '13',
        referenceFormula: '=CEILING.MATH(A2)',
        hint: 'Call =CEILING.MATH(A2)',
        explanation: 'Always rounds up to the next integer (13).'
      },
      {
        title: 'Retail 5-Cent Boundary',
        scenario: 'Round product cost A2 (7.89) up to the nearest $0.05 boundary.',
        dataset: makePracticeDataset(['A'], ['Cost'], [[7.89], [12.41], [3.99]]),
        targetResult: 7.9,
        targetResultDisplay: '7.90',
        referenceFormula: '=CEILING.MATH(A2, 0.05)',
        hint: 'Use 0.05 as the second parameter: =CEILING.MATH(A2, 0.05)',
        explanation: '7.89 rounds up to 7.90.'
      },
      {
        title: 'Warehouse Pack Sizing',
        scenario: 'We need 43 parts (A2). The supplier only ships in boxes of 10. How many must we order?',
        dataset: makePracticeDataset(['A'], ['PartsNeeded'], [[43], [78], [112]]),
        targetResult: 50,
        targetResultDisplay: '50',
        referenceFormula: '=CEILING.MATH(A2, 10)',
        hint: 'Use 10 as significance: =CEILING.MATH(A2, 10)',
        explanation: 'Rounds 43 up to 50.'
      },
      {
        title: 'Shipping Pallet Capacity',
        scenario: 'Calculate pallet requirements for 125 boxes (A2) where each pallet holds 40 boxes.',
        dataset: makePracticeDataset(['A'], ['TotalBoxes'], [[125], [210]]),
        targetResult: 160,
        targetResultDisplay: '160',
        referenceFormula: '=CEILING.MATH(A2, 40)',
        hint: 'Use 40 as the multiple: =CEILING.MATH(A2, 40)',
        explanation: 'Rounds 125 up to 160 (4 full pallets).'
      },
      {
        title: 'Consulting 15-Minute Blocks',
        scenario: 'A meeting took 47 minutes (A2). Round up to the nearest 15-minute billing block.',
        dataset: makePracticeDataset(['A'], ['Minutes'], [[47], [18], [62]]),
        targetResult: 60,
        targetResultDisplay: '60',
        referenceFormula: '=CEILING.MATH(A2, 15)',
        hint: 'Use 15 as significance: =CEILING.MATH(A2, 15)',
        explanation: '47 minutes rounds up to 60 minutes.'
      },
      {
        title: 'Raw Cable Cut Lengths',
        scenario: 'Cable run requires 22.4 meters (A2). Reels are sold in 5-meter increments. Find order length.',
        dataset: makePracticeDataset(['A'], ['NeededMeters'], [[22.4], [14.1]]),
        targetResult: 25,
        targetResultDisplay: '25',
        referenceFormula: '=CEILING.MATH(A2, 5)',
        hint: 'Round up to multiple of 5: =CEILING.MATH(A2, 5)',
        explanation: 'Rounds 22.4 up to 25 meters.'
      },
      {
        title: 'Negative Temperature Step',
        scenario: 'Round negative temperature -12.3°C (A2) up toward zero.',
        dataset: makePracticeDataset(['A'], ['TempC'], [[-12.3], [-4.8]]),
        targetResult: -12,
        targetResultDisplay: '-12',
        referenceFormula: '=CEILING.MATH(A2)',
        hint: 'Default mode rounds negative numbers toward zero: =CEILING.MATH(A2)',
        explanation: '-12 is greater than -12.3.'
      },
      {
        title: 'Event Catering Table Count',
        scenario: 'Guests count is 86 (A2). Each table seats 8 people. Calculate seat capacity needed.',
        dataset: makePracticeDataset(['A'], ['GuestCount'], [[86], [120]]),
        targetResult: 88,
        targetResultDisplay: '88',
        referenceFormula: '=CEILING.MATH(A2, 8)',
        hint: 'Round up to multiple of 8: =CEILING.MATH(A2, 8)',
        explanation: '88 seats (11 tables) accommodates 86 guests.'
      },
      {
        title: 'Bulk Data Transfer Batches',
        scenario: '145 files to process (A2) in batch chunks of 50. What is the allocated slot capacity?',
        dataset: makePracticeDataset(['A'], ['FileCount'], [[145], [310]]),
        targetResult: 150,
        targetResultDisplay: '150',
        referenceFormula: '=CEILING.MATH(A2, 50)',
        hint: 'Round up to nearest 50: =CEILING.MATH(A2, 50)',
        explanation: 'Rounds 145 up to 150.'
      }
    ])
  },
  {
    id: 'round',
    name: 'ROUND',
    category: 'math-trig',
    difficulty: 'beginner',
    chapter: 2,
    microsoft365Only: false,
    syntax: '=ROUND(number, num_digits)',
    description: 'Rounds a number to a specified number of decimal places (or powers of 10) using standard rounding rules (0.5 rounds up). Essential for financial balancing.',
    parameters: [
      { name: 'number', required: true, description: 'The number you want to round.' },
      { name: 'num_digits', required: true, description: 'Positive = decimal places; 0 = nearest integer; negative = nearest 10, 100, 1000.' }
    ],
    referenceExamples: [
      { context: 'Unit cost A2=145.678 to currency.', formula: '=ROUND(A2, 2)', result: '145.68', explanation: 'Rounds to 2 decimal places.' },
      { context: 'Gross pay A2=1234.7 for tax.', formula: '=ROUND(A2, 0)', result: '1235', explanation: 'Rounds to nearest whole dollar.' },
      { context: 'Executive revenue A2=48763.', formula: '=ROUND(A2, -1)', result: '48760', explanation: 'Rounds to nearest 10 dollars.' }
    ],
    realWorldScenarios: [
      'Financial Reporting: Prevent cumulative penny reconciliation errors.',
      'Payroll: Round tax deductions to compliant legal whole cents or dollars.',
      'Scientific Metrics: Standardize precision according to sensor resolution.'
    ],
    practiceExamples: createPracticeSet('ROUND', [
      {
        title: 'Currency Cents Rounding',
        scenario: 'Round unit price in A2 (145.678) to 2 decimal places for billing.',
        dataset: makePracticeDataset(['A'], ['Price'], [[145.678], [89.123], [45.999]]),
        targetResult: 145.68,
        targetResultDisplay: '145.68',
        referenceFormula: '=ROUND(A2, 2)',
        hint: 'Use 2 as num_digits: =ROUND(A2, 2)',
        explanation: 'Third decimal 8 rounds the second decimal 7 up to 8.'
      },
      {
        title: 'Nearest Whole Dollar',
        scenario: 'Round taxable gross pay in A2 (1234.70) to the nearest integer dollar.',
        dataset: makePracticeDataset(['A'], ['GrossPay'], [[1234.7], [850.2], [999.5]]),
        targetResult: 1235,
        targetResultDisplay: '1235',
        referenceFormula: '=ROUND(A2, 0)',
        hint: 'Use 0 as num_digits: =ROUND(A2, 0)',
        explanation: '0.7 rounds up to the next integer 1235.'
      },
      {
        title: 'Nearest Ten for Board Summary',
        scenario: 'Round revenue figure in A2 (48763) to the nearest $10.',
        dataset: makePracticeDataset(['A'], ['Revenue'], [[48763], [12458]]),
        targetResult: 48760,
        targetResultDisplay: '48760',
        referenceFormula: '=ROUND(A2, -1)',
        hint: 'Negative num_digits round left of decimal: =ROUND(A2, -1)',
        explanation: 'Last digit 3 rounds down to 0, giving 48760.'
      },
      {
        title: 'Nearest Thousand for Forecast',
        scenario: 'Round annual forecast in A2 (342890) to the nearest $1,000.',
        dataset: makePracticeDataset(['A'], ['Forecast'], [[342890], [189200]]),
        targetResult: 343000,
        targetResultDisplay: '343000',
        referenceFormula: '=ROUND(A2, -3)',
        hint: 'Use -3 for thousands: =ROUND(A2, -3)',
        explanation: '890 rounds up to the nearest thousand (343000).'
      },
      {
        title: 'Round a Total SUM',
        scenario: 'Sum the values in B2:B4 and round the final total to 2 decimal places.',
        dataset: makePracticeDataset(['A', 'B'], ['Item', 'Amount'], [['A', 12.345], ['B', 24.556], ['C', 10.111]]),
        targetResult: 47.01,
        targetResultDisplay: '47.01',
        referenceFormula: '=ROUND(SUM(B2:B4), 2)',
        hint: 'Wrap SUM inside ROUND: =ROUND(SUM(B2:B4), 2)',
        explanation: 'Total 47.012 rounds to 47.01.'
      },
      {
        title: 'Interest Rate Percentage',
        scenario: 'Round calculation in A2 (0.056784) to 4 decimal places (for basis points).',
        dataset: makePracticeDataset(['A'], ['RawRate'], [[0.056784]]),
        targetResult: 0.0568,
        targetResultDisplay: '0.0568',
        referenceFormula: '=ROUND(A2, 4)',
        hint: 'Use 4 decimal places: =ROUND(A2, 4)',
        explanation: '0.056784 rounds to 0.0568.'
      },
      {
        title: 'Average Score Rounding',
        scenario: 'Calculate the average of exam scores in B2:B4 rounded to 1 decimal place.',
        dataset: makePracticeDataset(['A', 'B'], ['Student', 'Score'], [['Liam', 85], ['Emma', 92], ['Noah', 78]]),
        targetResult: 85,
        targetResultDisplay: '85',
        referenceFormula: '=ROUND(AVERAGE(B2:B4), 1)',
        hint: 'Use =ROUND(AVERAGE(B2:B4), 1)',
        explanation: 'Average is 85.0.'
      },
      {
        title: 'Discounted Price Check',
        scenario: 'Calculate price in A2 ($59.99) minus 15% discount, rounded to 2 decimal places.',
        dataset: makePracticeDataset(['A'], ['Price'], [[59.99]]),
        targetResult: 50.99,
        targetResultDisplay: '50.99',
        referenceFormula: '=ROUND(A2*0.85, 2)',
        hint: 'Multiply A2 by 0.85 inside ROUND(..., 2).',
        explanation: '59.99 * 0.85 = 50.9915, which rounds to 50.99.'
      },
      {
        title: 'Nearest Hundred Thousand',
        scenario: 'Round company valuation A2 (4876500) to the nearest 100,000.',
        dataset: makePracticeDataset(['A'], ['Valuation'], [[4876500]]),
        targetResult: 4900000,
        targetResultDisplay: '4900000',
        referenceFormula: '=ROUND(A2, -5)',
        hint: 'Use -5 to round to 100,000s: =ROUND(A2, -5)',
        explanation: '4,876,500 rounds to 4,900,000.'
      }
    ])
  },
  {
    id: 'sum',
    name: 'SUM',
    category: 'math-trig',
    difficulty: 'beginner',
    chapter: 2,
    microsoft365Only: false,
    syntax: '=SUM(number1, [number2], ...)',
    description: 'The workhorse of spreadsheet modeling. Adds all numbers in a range, individual cells, or multiple non-adjacent blocks.',
    parameters: [
      { name: 'number1', required: true, description: 'First number, cell, or range to sum.' },
      { name: 'number2', required: false, description: 'Additional cells or ranges up to 255.' }
    ],
    referenceExamples: [
      { context: 'Daily sales column A2:A100.', formula: '=SUM(A2:A100)', result: '487,250', explanation: 'Grand total revenue for the period.' },
      { context: 'Non-adjacent ranges A2:A10 and C2:C10.', formula: '=SUM(A2:A10, C2:C10)', result: '124,500', explanation: 'Combines two separate columns while skipping column B.' },
      { context: 'Structured table column.', formula: '=SUM(SalesData[Revenue])', result: '94,300', explanation: 'Dynamic table sum that auto-expands.' }
    ],
    realWorldScenarios: [
      'Budget Tracking: Grand total of expense categories.',
      'Inventory Valuation: Aggregate unit values across storage bins.',
      'Project Management: Aggregate committed hours and budget burn.'
    ],
    practiceExamples: createPracticeSet('SUM', [
      {
        title: 'Simple Column Total',
        scenario: 'Sum all monthly revenue values in column B from B2 to B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Month', 'Revenue'], [['Jan', 12000], ['Feb', 15000], ['Mar', 18000], ['Apr', 22000]]),
        targetResult: 67000,
        targetResultDisplay: '67,000',
        referenceFormula: '=SUM(B2:B5)',
        hint: 'Use the SUM function on range B2:B5: =SUM(B2:B5)',
        explanation: '12000 + 15000 + 18000 + 22000 = 67000.'
      },
      {
        title: 'Non-Adjacent Columns',
        scenario: 'Sum North sales in A2:A4 and South sales in C2:C4, skipping Returns in Col B.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['North', 'Returns', 'South'], [[5000, 300, 4200], [6100, 450, 5800], [7300, 200, 6900]]),
        targetResult: 35300,
        targetResultDisplay: '35,300',
        referenceFormula: '=SUM(A2:A4, C2:C4)',
        hint: 'Pass both ranges separated by a comma: =SUM(A2:A4, C2:C4)',
        explanation: '(5000+6100+7300) + (4200+5800+6900) = 18400 + 16900 = 35300.'
      },
      {
        title: 'Quarterly Department Spend',
        scenario: 'Calculate the total Q1 spend by summing cells B2, C2, and D2.',
        dataset: makePracticeDataset(['A', 'B', 'C', 'D'], ['Dept', 'Jan', 'Feb', 'Mar'], [['Ops', 1400, 1650, 1950], ['Marketing', 2000, 2100, 2400]]),
        targetResult: 5000,
        targetResultDisplay: '5,000',
        referenceFormula: '=SUM(B2:D2)',
        hint: 'Sum the row range B2:D2.',
        explanation: '1400 + 1650 + 1950 = 5000.'
      },
      {
        title: 'Net Cash Flow Total',
        scenario: 'Sum the mixed cash flows (deposits and withdrawals) in B2:B6.',
        dataset: makePracticeDataset(['A', 'B'], ['Date', 'CashFlow'], [['01-Jan', 5000], ['02-Jan', -1200], ['03-Jan', 3400], ['04-Jan', -800], ['05-Jan', 2100]]),
        targetResult: 8500,
        targetResultDisplay: '8,500',
        referenceFormula: '=SUM(B2:B6)',
        hint: 'Use =SUM(B2:B6)',
        explanation: '5000 - 1200 + 3400 - 800 + 2100 = 8500.'
      },
      {
        title: 'Multi-Department Payroll',
        scenario: 'Sum the base salary in B2:B4 and bonus in C2:C4.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Name', 'Base', 'Bonus'], [['Alice', 45000, 5000], ['Bob', 52000, 6000], ['Carol', 48000, 4500]]),
        targetResult: 160500,
        targetResultDisplay: '160,500',
        referenceFormula: '=SUM(B2:C4)',
        hint: 'Sum the 2D block B2:C4: =SUM(B2:C4)',
        explanation: 'Total payroll across base and bonus is 160,500.'
      },
      {
        title: 'Hardware Inventory Value',
        scenario: 'Sum the warehouse stock quantities in C2:C5.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['SKU', 'Item', 'Qty'], [['H-10', 'Monitor', 45], ['H-11', 'Keyboard', 120], ['H-12', 'Mouse', 200], ['H-13', 'Cable', 350]]),
        targetResult: 715,
        targetResultDisplay: '715',
        referenceFormula: '=SUM(C2:C5)',
        hint: 'Use =SUM(C2:C5)',
        explanation: '45 + 120 + 200 + 350 = 715.'
      },
      {
        title: 'Project Hours Aggregation',
        scenario: 'Aggregate billable hours in D2:D5.',
        dataset: makePracticeDataset(['A', 'B', 'C', 'D'], ['ID', 'Task', 'Consultant', 'Hours'], [['T1', 'Scoping', 'J.S.', 14.5], ['T2', 'Design', 'M.A.', 28.0], ['T3', 'Build', 'K.L.', 42.5], ['T4', 'QA', 'P.R.', 15.0]]),
        targetResult: 100,
        targetResultDisplay: '100',
        referenceFormula: '=SUM(D2:D5)',
        hint: 'Use =SUM(D2:D5)',
        explanation: '14.5 + 28 + 42.5 + 15 = 100.'
      },
      {
        title: 'Four-Quarter Operating Expenses',
        scenario: 'Sum all 4 quarters across rows 2 through 4 (B2:E4).',
        dataset: makePracticeDataset(['A', 'B', 'C', 'D', 'E'], ['Category', 'Q1', 'Q2', 'Q3', 'Q4'], [['Rent', 3000, 3000, 3000, 3000], ['Utilities', 450, 520, 480, 550], ['Supplies', 200, 350, 180, 270]]),
        targetResult: 15000,
        targetResultDisplay: '15,000',
        referenceFormula: '=SUM(B2:E4)',
        hint: 'Sum the entire block B2:E4.',
        explanation: '12,000 (rent) + 2,000 (utilities) + 1,000 (supplies) = 15,000.'
      },
      {
        title: 'Shipping Freight Weight',
        scenario: 'Find total cargo weight in kg by summing B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Container', 'WeightKg'], [['C-1', 420.5], ['C-2', 880.2], ['C-3', 315.3], ['C-4', 684.0]]),
        targetResult: 2300,
        targetResultDisplay: '2,300',
        referenceFormula: '=SUM(B2:B5)',
        hint: 'Use =SUM(B2:B5)',
        explanation: '420.5 + 880.2 + 315.3 + 684 = 2300 kg.'
      }
    ])
  },
  {
    id: 'sumif',
    name: 'SUMIF',
    category: 'math-trig',
    difficulty: 'beginner',
    chapter: 2,
    microsoft365Only: false,
    syntax: '=SUMIF(range, criteria, [sum_range])',
    description: 'Sums values in a range that meet a single specified condition. The fundamental function for filtered totals.',
    parameters: [
      { name: 'range', required: true, description: 'The cells evaluated against criteria.' },
      { name: 'criteria', required: true, description: 'The condition (e.g., ">500", "North", "*Apple*").' },
      { name: 'sum_range', required: false, description: 'The cells to sum (if omitted, sums range itself).' }
    ],
    referenceExamples: [
      { context: 'Deals above $500 in B2:B100, Revenue in A2:A100.', formula: '=SUMIF(B2:B100, ">500", A2:A100)', result: '142,300', explanation: 'Sums high-value deals.' },
      { context: 'Sum North region only (Region in C2:C100, Sales in A2:A100).', formula: '=SUMIF(C2:C100, "North", A2:A100)', result: '87,400', explanation: 'Regional filtered total.' },
      { context: 'Wildcard product match for "Apple".', formula: '=SUMIF(D2:D100, "*Apple*", A2:A100)', result: '234,750', explanation: 'Matches any product name containing Apple.' }
    ],
    realWorldScenarios: [
      'Sales Reports: Total sales only for a designated region or sales rep.',
      'Expense Tracking: Sum all travel expenses from a general ledger.',
      'Credit Control: Total overdue invoices older than 30 days.'
    ],
    practiceExamples: createPracticeSet('SUMIF', [
      {
        title: 'Sum by Region (North)',
        scenario: 'Calculate total sales for only the "North" region. Regions are in A2:A5, Sales in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Region', 'Sales'], [['North', 5000], ['South', 3200], ['North', 7500], ['East', 4100]]),
        targetResult: 12500,
        targetResultDisplay: '12,500',
        referenceFormula: '=SUMIF(A2:A5, "North", B2:B5)',
        hint: 'Use range A2:A5, criteria "North", and sum_range B2:B5.',
        explanation: 'Row 2 (5000) and Row 4 (7500) match North. 5000 + 7500 = 12500.'
      },
      {
        title: 'High-Value Deals Above $5,000',
        scenario: 'Sum only the transactions in B2:B5 that exceed 5000.',
        dataset: makePracticeDataset(['A', 'B'], ['ID', 'Amount'], [['TX-1', 4200], ['TX-2', 8500], ['TX-3', 2100], ['TX-4', 6300]]),
        targetResult: 14800,
        targetResultDisplay: '14,800',
        referenceFormula: '=SUMIF(B2:B5, ">5000")',
        hint: 'When criteria is on the sum column itself, omit the 3rd argument: =SUMIF(B2:B5, ">5000")',
        explanation: '8500 + 6300 = 14800.'
      },
      {
        title: 'Wildcard Brand Matching',
        scenario: 'Sum revenue for all products in A2:A5 containing "Pro". Product in Col A, Revenue in Col B.',
        dataset: makePracticeDataset(['A', 'B'], ['Product', 'Revenue'], [['Laptop Pro 15', 3000], ['Desk Chair', 400], ['Pro Keyboard', 600], ['Mouse Basic', 150]]),
        targetResult: 3600,
        targetResultDisplay: '3,600',
        referenceFormula: '=SUMIF(A2:A5, "*Pro*", B2:B5)',
        hint: 'Use asterisk wildcards "*Pro*": =SUMIF(A2:A5, "*Pro*", B2:B5)',
        explanation: 'Laptop Pro (3000) and Pro Keyboard (600) sum to 3600.'
      },
      {
        title: 'Exclude Cancelled Orders',
        scenario: 'Sum total revenue in B2:B5 for all deals that are NOT "Cancelled". Status is in A2:A5.',
        dataset: makePracticeDataset(['A', 'B'], ['Status', 'Revenue'], [['Completed', 2400], ['Cancelled', 1500], ['Completed', 3100], ['Pending', 1800]]),
        targetResult: 7300,
        targetResultDisplay: '7,300',
        referenceFormula: '=SUMIF(A2:A5, "<>Cancelled", B2:B5)',
        hint: 'Use the <> operator for not-equal: =SUMIF(A2:A5, "<>Cancelled", B2:B5)',
        explanation: '2400 + 3100 + 1800 = 7300.'
      },
      {
        title: 'Department Travel Expense',
        scenario: 'Total only "Travel" expenses from ledger category in A2:A5 and amount in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Category', 'Amount'], [['Travel', 820], ['Software', 1200], ['Travel', 450], ['Office', 310]]),
        targetResult: 1270,
        targetResultDisplay: '1,270',
        referenceFormula: '=SUMIF(A2:A5, "Travel", B2:B5)',
        hint: 'Use =SUMIF(A2:A5, "Travel", B2:B5)',
        explanation: '820 + 450 = 1270.'
      },
      {
        title: 'Marketing Channel Spend',
        scenario: 'Find total advertising spend for the "Social" channel in A2:A5.',
        dataset: makePracticeDataset(['A', 'B'], ['Channel', 'Spend'], [['Search', 4000], ['Social', 2500], ['Social', 3200], ['Email', 800]]),
        targetResult: 5700,
        targetResultDisplay: '5,700',
        referenceFormula: '=SUMIF(A2:A5, "Social", B2:B5)',
        hint: 'Filter on "Social": =SUMIF(A2:A5, "Social", B2:B5)',
        explanation: '2500 + 3200 = 5700.'
      },
      {
        title: 'Warehouse A Inventory Value',
        scenario: 'Calculate total inventory valuation in C2:C5 located specifically in Warehouse "WH-A" (Col B).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['SKU', 'Location', 'Valuation'], [['SKU-1', 'WH-A', 14000], ['SKU-2', 'WH-B', 22000], ['SKU-3', 'WH-A', 18500], ['SKU-4', 'WH-C', 9000]]),
        targetResult: 32500,
        targetResultDisplay: '32,500',
        referenceFormula: '=SUMIF(B2:B5, "WH-A", C2:C5)',
        hint: 'Match Location in B2:B5 with "WH-A" and sum C2:C5.',
        explanation: '14000 + 18500 = 32500.'
      },
      {
        title: 'Senior Staff Salaries',
        scenario: 'Sum salaries in C2:C5 for employees whose tenure in B2:B5 is at least 5 years (">=5").',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Employee', 'TenureYears', 'Salary'], [['Sarah', 6, 85000], ['Alex', 2, 54000], ['Carlos', 8, 92000], ['Maya', 4, 62000]]),
        targetResult: 177000,
        targetResultDisplay: '177,000',
        referenceFormula: '=SUMIF(B2:B5, ">=5", C2:C5)',
        hint: 'Criteria string is ">=5": =SUMIF(B2:B5, ">=5", C2:C5)',
        explanation: 'Sarah (85k) + Carlos (92k) = 177,000.'
      },
      {
        title: 'Overdue Invoices (>30 Days)',
        scenario: 'Total the amount in C2:C5 for all invoices where DaysOverdue in B2:B5 exceeds 30.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['InvID', 'DaysOverdue', 'Amount'], [['INV-1', 45, 6200], ['INV-2', 12, 1400], ['INV-3', 38, 4800], ['INV-4', 5, 2900]]),
        targetResult: 11000,
        targetResultDisplay: '11,000',
        referenceFormula: '=SUMIF(B2:B5, ">30", C2:C5)',
        hint: 'Criteria is ">30": =SUMIF(B2:B5, ">30", C2:C5)',
        explanation: '6200 + 4800 = 11000.'
      }
    ])
  },
  {
    id: 'sumifs',
    name: 'SUMIFS',
    category: 'math-trig',
    difficulty: 'beginner',
    chapter: 2,
    microsoft365Only: false,
    syntax: '=SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)',
    description: 'Sums values that satisfy multiple conditions simultaneously. Note that sum_range is the FIRST parameter in SUMIFS.',
    parameters: [
      { name: 'sum_range', required: true, description: 'The cells to add up.' },
      { name: 'criteria_range1', required: true, description: 'First range to evaluate.' },
      { name: 'criteria1', required: true, description: 'First condition.' },
      { name: 'criteria_range2', required: false, description: 'Second range to evaluate.' },
      { name: 'criteria2', required: false, description: 'Second condition.' }
    ],
    referenceExamples: [
      { context: 'Revenue in A2:A100, Region North in B, Deal > $1000 in C.', formula: '=SUMIFS(A2:A100, B2:B100, "North", C2:C100, ">1000")', result: '68,500', explanation: 'High-value North deals only.' },
      { context: 'Exclude cancelled deals from reportable pipeline.', formula: '=SUMIFS(A2:A100, B2:B100, "<>Cancelled")', result: '420,000', explanation: 'Excludes dead opportunities.' },
      { context: 'Dynamic criteria referenced from dashboard input cells.', formula: '=SUMIFS(A2:A100, B2:B100, G1, C2:C100, G2)', result: 'Dynamic', explanation: 'Updates live with user selections.' }
    ],
    realWorldScenarios: [
      'Sales Analysis: Product X revenue in Region Y during Q1.',
      'Cost Control: Approved travel expenses exceeding $500.',
      'Inventory: Stock value of Item Z at Warehouse A below reorder point.'
    ],
    practiceExamples: createPracticeSet('SUMIFS', [
      {
        title: 'Region AND Product Match',
        scenario: 'Sum revenue in C2:C5 for deals in Region "North" (Col A) where Product is "Laptop" (Col B).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Region', 'Product', 'Revenue'], [['North', 'Laptop', 4500], ['South', 'Laptop', 3200], ['North', 'Phone', 1200], ['North', 'Laptop', 5500]]),
        targetResult: 10000,
        targetResultDisplay: '10,000',
        referenceFormula: '=SUMIFS(C2:C5, A2:A5, "North", B2:B5, "Laptop")',
        hint: 'Remember sum_range C2:C5 comes first: =SUMIFS(C2:C5, A2:A5, "North", B2:B5, "Laptop")',
        explanation: 'Rows 2 (4500) and 5 (5500) match both criteria. 4500 + 5500 = 10000.'
      },
      {
        title: 'Region AND Value Threshold',
        scenario: 'Sum sales in C2:C5 for "East" region (Col A) where amount in Col C exceeds 3000.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Region', 'Rep', 'Sales'], [['East', 'Mia', 2500], ['East', 'Jack', 4000], ['West', 'Leo', 5000], ['East', 'Sara', 3800]]),
        targetResult: 7800,
        targetResultDisplay: '7,800',
        referenceFormula: '=SUMIFS(C2:C5, A2:A5, "East", C2:C5, ">3000")',
        hint: 'Use criteria ">3000" on range C2:C5.',
        explanation: 'Jack (4000) and Sara (3800) qualify. Total is 7800.'
      },
      {
        title: 'Approved Travel Over $500',
        scenario: 'Sum expense amount in C2:C5 where Category in A2:A5 is "Travel" AND Status in B2:B5 is "Approved".',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Category', 'Status', 'Amount'], [['Travel', 'Approved', 620], ['Travel', 'Pending', 400], ['Meals', 'Approved', 180], ['Travel', 'Approved', 750]]),
        targetResult: 1370,
        targetResultDisplay: '1,370',
        referenceFormula: '=SUMIFS(C2:C5, A2:A5, "Travel", B2:B5, "Approved")',
        hint: 'Pass sum_range C2:C5 first, then Category range, then Status range.',
        explanation: '620 + 750 = 1370.'
      },
      {
        title: 'Q1 Enterprise Closed Deals',
        scenario: 'Sum pipeline in C2:C5 where Segment in A2:A5 is "Enterprise" and Status in B2:B5 is "Won".',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Segment', 'Status', 'Value'], [['Enterprise', 'Won', 25000], ['SMB', 'Won', 8000], ['Enterprise', 'Lost', 15000], ['Enterprise', 'Won', 32000]]),
        targetResult: 57000,
        targetResultDisplay: '57,000',
        referenceFormula: '=SUMIFS(C2:C5, A2:A5, "Enterprise", B2:B5, "Won")',
        hint: 'Use =SUMIFS(C2:C5, A2:A5, "Enterprise", B2:B5, "Won")',
        explanation: '25000 + 32000 = 57000.'
      },
      {
        title: 'Product Line in Warehouse A',
        scenario: 'Sum stock value in D2:D5 for "Furniture" (Col A) located in "WH-A" (Col B).',
        dataset: makePracticeDataset(['A', 'B', 'C', 'D'], ['Category', 'Warehouse', 'Units', 'Value'], [['Furniture', 'WH-A', 50, 5000], ['Electronics', 'WH-A', 100, 12000], ['Furniture', 'WH-B', 80, 8000], ['Furniture', 'WH-A', 30, 3000]]),
        targetResult: 8000,
        targetResultDisplay: '8,000',
        referenceFormula: '=SUMIFS(D2:D5, A2:A5, "Furniture", B2:B5, "WH-A")',
        hint: 'Sum D2:D5 where A is Furniture and B is WH-A.',
        explanation: '5000 + 3000 = 8000.'
      },
      {
        title: 'Marketing Campaign ROI Cohort',
        scenario: 'Sum converted sales in C2:C5 for channel "Google" (Col A) in tier "Paid" (Col B).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Channel', 'Type', 'Sales'], [['Google', 'Paid', 12400], ['Google', 'Organic', 8500], ['Meta', 'Paid', 9200], ['Google', 'Paid', 6100]]),
        targetResult: 18500,
        targetResultDisplay: '18,500',
        referenceFormula: '=SUMIFS(C2:C5, A2:A5, "Google", B2:B5, "Paid")',
        hint: 'Use =SUMIFS(C2:C5, A2:A5, "Google", B2:B5, "Paid")',
        explanation: '12400 + 6100 = 18500.'
      },
      {
        title: 'Active Tech Staff Over 60k',
        scenario: 'Sum salaries in C2:C5 for department "IT" (Col A) with Salary > 60000 in Col C.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Dept', 'Role', 'Salary'], [['IT', 'Dev', 72000], ['HR', 'Generalist', 50000], ['IT', 'Support', 45000], ['IT', 'Architect', 95000]]),
        targetResult: 167000,
        targetResultDisplay: '167,000',
        referenceFormula: '=SUMIFS(C2:C5, A2:A5, "IT", C2:C5, ">60000")',
        hint: 'Check C2:C5 > 60000 and A2:A5 = "IT".',
        explanation: '72000 + 95000 = 167000.'
      },
      {
        title: 'Priority Shipments In-Transit',
        scenario: 'Sum freight cost in C2:C5 for shipments with Priority "High" (Col A) and Status "In-Transit" (Col B).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Priority', 'Status', 'Cost'], [['High', 'In-Transit', 1800], ['Standard', 'In-Transit', 900], ['High', 'Delivered', 2100], ['High', 'In-Transit', 1400]]),
        targetResult: 3200,
        targetResultDisplay: '3,200',
        referenceFormula: '=SUMIFS(C2:C5, A2:A5, "High", B2:B5, "In-Transit")',
        hint: 'Use =SUMIFS(C2:C5, A2:A5, "High", B2:B5, "In-Transit")',
        explanation: '1800 + 1400 = 3200.'
      },
      {
        title: 'Hardware Returns Exclusion',
        scenario: 'Sum orders in C2:C5 where Category in A2:A5 is "Hardware" and Status in B2:B5 is not "Returned" ("<>Returned").',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Category', 'Status', 'Amount'], [['Hardware', 'Delivered', 4200], ['Hardware', 'Returned', 1100], ['Supplies', 'Delivered', 800], ['Hardware', 'Delivered', 3800]]),
        targetResult: 8000,
        targetResultDisplay: '8,000',
        referenceFormula: '=SUMIFS(C2:C5, A2:A5, "Hardware", B2:B5, "<>Returned")',
        hint: 'Combine Category "Hardware" and "<>Returned".',
        explanation: '4200 + 3800 = 8000.'
      }
    ])
  },
  {
    id: 'rand',
    name: 'RAND',
    category: 'math-trig',
    difficulty: 'beginner',
    chapter: 2,
    microsoft365Only: false,
    syntax: '=RAND()',
    description: 'Generates a random decimal number between 0 and 1. Recalculates on every worksheet change (volatile). Ideal for Monte Carlo simulations and sampling.',
    parameters: [],
    referenceExamples: [
      { context: 'Probability for risk model.', formula: '=RAND()', result: '0.6743', explanation: 'Returns uniformly distributed decimal in [0, 1).' },
      { context: 'Random integer 1 to 100.', formula: '=INT(RAND()*100)+1', result: '47', explanation: 'Scales and shifts to integer range.' },
      { context: 'Simulate competitor price between $10 and $50.', formula: '=10+(RAND()*40)', result: '33.47', explanation: 'Generates continuous price in range.' }
    ],
    realWorldScenarios: [
      'Market Research: Assign random numbers to sample customer cohorts.',
      'Risk Analysis: Monte Carlo probability simulations.',
      'Training: Randomize quiz question sequences.'
    ],
    practiceExamples: createPracticeSet('RAND', [
      {
        title: 'Basic Random Probability',
        scenario: 'Generate a random probability decimal between 0 and 1.',
        dataset: makePracticeDataset(['A'], ['Simulation'], [[null]]),
        targetResult: 0.5,
        targetResultDisplay: 'Decimal between 0 and 1',
        referenceFormula: '=RAND()',
        hint: 'Type =RAND() with no arguments.',
        explanation: 'RAND() produces an evenly distributed decimal number.'
      },
      {
        title: 'Scale Random Price',
        scenario: 'Generate a random integer between 1 and 10 using INT(RAND()*10)+1.',
        dataset: makePracticeDataset(['A'], ['DiceRoll'], [[null]]),
        targetResult: 5,
        targetResultDisplay: 'Integer 1-10',
        referenceFormula: '=INT(RAND()*10)+1',
        hint: 'Use =INT(RAND()*10)+1',
        explanation: 'Scales 0-1 into an integer.'
      },
      {
        title: 'Bounded Price Simulation',
        scenario: 'Simulate a price between 20 and 50 using =20+(RAND()*30).',
        dataset: makePracticeDataset(['A'], ['SimulatedPrice'], [[null]]),
        targetResult: 35,
        targetResultDisplay: 'Number between 20 and 50',
        referenceFormula: '=20+(RAND()*30)',
        hint: 'Use =20+(RAND()*30)',
        explanation: 'Shifts floor to 20 with range 30.'
      },
      {
        title: 'Random Discount Rate',
        scenario: 'Generate a random discount between 5% and 25% (=0.05+(RAND()*0.2)).',
        dataset: makePracticeDataset(['A'], ['DiscountRate'], [[null]]),
        targetResult: 0.15,
        targetResultDisplay: 'Decimal between 0.05 and 0.25',
        referenceFormula: '=0.05+(RAND()*0.2)',
        hint: 'Add 0.05 to RAND()*0.2.',
        explanation: 'Creates a percentage in [0.05, 0.25].'
      },
      {
        title: 'Coin Toss 50/50',
        scenario: 'Generate a binary test using =IF(RAND()>0.5, "Heads", "Tails").',
        dataset: makePracticeDataset(['A'], ['CoinFlip'], [[null]]),
        targetResult: 'Heads',
        targetResultDisplay: '"Heads" or "Tails"',
        referenceFormula: '=IF(RAND()>0.5, "Heads", "Tails")',
        hint: 'Use IF with RAND() > 0.5.',
        explanation: 'Simulates a 50/50 probability event.'
      },
      {
        title: 'Customer Sample Weight',
        scenario: 'Assign a random decimal sorting key to customer in A2.',
        dataset: makePracticeDataset(['A', 'B'], ['Customer', 'SortKey'], [['Acme Corp', null]]),
        targetResult: 0.7,
        targetResultDisplay: 'Decimal in [0, 1)',
        referenceFormula: '=RAND()',
        hint: 'Type =RAND()',
        explanation: 'Creates a random sort weight.'
      },
      {
        title: 'Audit Lottery Selector',
        scenario: 'Generate a random number for audit sampling.',
        dataset: makePracticeDataset(['A'], ['AuditTicket'], [[null]]),
        targetResult: 0.42,
        targetResultDisplay: 'Decimal in [0, 1)',
        referenceFormula: '=RAND()',
        hint: 'Use =RAND()',
        explanation: 'Assigns unbiased random seed.'
      },
      {
        title: 'Simulated Daily Demand',
        scenario: 'Simulate daily demand between 100 and 200 units (=100+INT(RAND()*100)).',
        dataset: makePracticeDataset(['A'], ['SimDemand'], [[null]]),
        targetResult: 150,
        targetResultDisplay: 'Integer 100-199',
        referenceFormula: '=100+INT(RAND()*100)',
        hint: 'Use =100+INT(RAND()*100)',
        explanation: 'Generates integer demand estimate.'
      },
      {
        title: 'Random Percentile Threshold',
        scenario: 'Generate a Monte Carlo threshold using =ROUND(RAND(), 2).',
        dataset: makePracticeDataset(['A'], ['Threshold'], [[null]]),
        targetResult: 0.5,
        targetResultDisplay: '2-decimal float in [0, 1]',
        referenceFormula: '=ROUND(RAND(), 2)',
        hint: 'Wrap RAND() in ROUND(..., 2).',
        explanation: 'Rounds random float to two decimals.'
      }
    ])
  }
];
