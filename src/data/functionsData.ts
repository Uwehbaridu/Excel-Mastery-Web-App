import { ExcelFunction } from '../types/formula';
import { mathTrigFunctions } from './categories/mathTrig';
import { logicalFunctions } from './categories/logical';
import { statisticalFunctions } from './categories/statistical';
import { textFunctions } from './categories/text';
import { dateTimeFunctions, financialFunctions } from './categories/dateTimeAndFinancial';
import { lookupFunctions, dynamicArrayFunctions, summaryAiFunctions } from './categories/lookupAndArrays';
import { makePracticeDataset, createPracticeSet } from './practiceFactory';

// Additional functions from the book to ensure 100% full coverage of Chapters 1-12
const additionalBookFunctions: ExcelFunction[] = [
  {
    id: 'date',
    name: 'DATE',
    category: 'date-time',
    difficulty: 'beginner',
    chapter: 6,
    microsoft365Only: false,
    syntax: '=DATE(year, month, day)',
    description: 'Creates a valid Excel date serial number from separate year, month, and day integers. Handles month and day overflow automatically.',
    parameters: [
      { name: 'year', required: true, description: 'Four digit year (e.g. 2026).' },
      { name: 'month', required: true, description: 'Month number 1 to 12.' },
      { name: 'day', required: true, description: 'Day of month 1 to 31 (0 = last day of prior month).' }
    ],
    referenceExamples: [
      { context: 'Fixed contract start date.', formula: '=DATE(2026, 4, 15)', result: '15-Apr-2026', explanation: 'Creates unambiguous locale-proof date.' },
      { context: 'Calculate last day of month using day 0.', formula: '=DATE(2026, 5, 0)', result: '30-Apr-2026', explanation: 'Rolls back to last day of April.' }
    ],
    realWorldScenarios: [
      'Contract Expiry: Roll start date forward by N months.',
      'Financial Models: Build 36-month timeline headers.',
      'Schedules: Construct monthly date bounds.'
    ],
    practiceExamples: createPracticeSet('DATE', [
      {
        title: 'Construct Calendar Date',
        scenario: 'Build date from Year A2 (2026), Month B2 (4), and Day C2 (15).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Year', 'Month', 'Day'], [[2026, 4, 15]]),
        targetResult: '2026-04-15',
        targetResultDisplay: '15-Apr-2026',
        referenceFormula: '=DATE(A2, B2, C2)',
        hint: 'Use =DATE(A2, B2, C2)',
        explanation: 'Assembles valid Excel date value.'
      },
      {
        title: 'Last Day of Month (Day 0 Trick)',
        scenario: 'Find the last day of April 2026 by using Month 5 and Day 0 in DATE.',
        dataset: makePracticeDataset(['A', 'B'], ['Year', 'NextMonth'], [[2026, 5]]),
        targetResult: '2026-04-30',
        targetResultDisplay: '30-Apr-2026',
        referenceFormula: '=DATE(A2, B2, 0)',
        hint: 'Use 0 for day: =DATE(A2, B2, 0)',
        explanation: 'Day 0 gets the last day of preceding month (April 30).'
      },
      {
        title: 'Add 6 Months to Start Date',
        scenario: 'Add 6 months to start date components in A2 (Year 2026) and B2 (Month 4), Day in C2 (1).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Year', 'Month', 'Day'], [[2026, 4, 1]]),
        targetResult: '2026-10-01',
        targetResultDisplay: '01-Oct-2026',
        referenceFormula: '=DATE(A2, B2+6, C2)',
        hint: 'Add 6 to the month argument.',
        explanation: 'Produces 1 October 2026.'
      },
      {
        title: 'New Year Day',
        scenario: 'Construct date for 1 Jan 2026.',
        dataset: makePracticeDataset(['A'], ['Year'], [[2026]]),
        targetResult: '2026-01-01',
        targetResultDisplay: '01-Jan-2026',
        referenceFormula: '=DATE(A2, 1, 1)',
        hint: 'Use =DATE(A2, 1, 1)',
        explanation: 'First day of 2026.'
      },
      {
        title: 'Quarter End Date',
        scenario: 'Find Q1 end date (March 31, 2026).',
        dataset: makePracticeDataset(['A'], ['Year'], [[2026]]),
        targetResult: '2026-03-31',
        targetResultDisplay: '31-Mar-2026',
        referenceFormula: '=DATE(A2, 3, 31)',
        hint: 'Month 3, Day 31.',
        explanation: 'End of Q1.'
      },
      {
        title: 'Leap Year Check',
        scenario: 'Construct last day of Feb in leap year 2028 (=DATE(2028, 3, 0)).',
        dataset: makePracticeDataset(['A'], ['Year'], [[2028]]),
        targetResult: '2028-02-29',
        targetResultDisplay: '29-Feb-2028',
        referenceFormula: '=DATE(A2, 3, 0)',
        hint: 'Use month 3, day 0.',
        explanation: 'Correctly outputs 29-Feb-2028.'
      },
      {
        title: 'Mid-Year Review Date',
        scenario: 'Construct 30 June 2026.',
        dataset: makePracticeDataset(['A'], ['Year'], [[2026]]),
        targetResult: '2026-06-30',
        targetResultDisplay: '30-Jun-2026',
        referenceFormula: '=DATE(A2, 6, 30)',
        hint: 'Month 6, Day 30.',
        explanation: 'Half year close.'
      },
      {
        title: 'Fiscal Year End',
        scenario: 'Construct 31 Dec 2026.',
        dataset: makePracticeDataset(['A'], ['Year'], [[2026]]),
        targetResult: '2026-12-31',
        targetResultDisplay: '31-Dec-2026',
        referenceFormula: '=DATE(A2, 12, 31)',
        hint: 'Month 12, Day 31.',
        explanation: 'Annual close date.'
      },
      {
        title: 'Roll Month 13 into Next Year',
        scenario: 'Enter Month 13 in Year 2026 (DATE(2026, 13, 15)) to see automatic roll-over to Jan 2027.',
        dataset: makePracticeDataset(['A'], ['Year'], [[2026]]),
        targetResult: '2027-01-15',
        targetResultDisplay: '15-Jan-2027',
        referenceFormula: '=DATE(A2, 13, 15)',
        hint: 'Pass 13 as month.',
        explanation: 'Month 13 automatically becomes January of 2027.'
      }
    ])
  },
  {
    id: 'pivotby',
    name: 'PIVOTBY',
    category: 'summary-grouping-ai',
    difficulty: 'advanced',
    chapter: 11,
    microsoft365Only: true,
    syntax: '=PIVOTBY(row_fields, col_fields, values, function, [field_headers], [row_total_depth], [col_total_depth], [sort_order], [filter_array])',
    description: '★ Microsoft 365 (2025): Generates a complete 2D PivotTable crosstab directly inside a formula. Rows represent one dimension, columns represent another, and cells show aggregated metrics.',
    parameters: [
      { name: 'row_fields', required: true, description: 'Column values for row labels.' },
      { name: 'col_fields', required: true, description: 'Column values for column headers.' },
      { name: 'values', required: true, description: 'Metrics column to aggregate.' },
      { name: 'function', required: true, description: '1=SUM, 2=AVERAGE, 3=COUNT, etc.' }
    ],
    referenceExamples: [
      { context: 'Region rows, Product columns, Sales values.', formula: '=PIVOTBY(Table1[Region], Table1[Product], Table1[Sales], 1)', result: '2D matrix', explanation: 'Live 2D cross-tabulation without pivot object.' },
      { context: 'Headers and Grand totals.', formula: '=PIVOTBY(TEXT(Table1[Date],"mmm-yyyy"), Table1[Segment], Table1[Profit], 1, 3, 1, 1)', result: 'Formatted crosstab', explanation: 'Publication-ready finance pack.' }
    ],
    realWorldScenarios: [
      'Executive Crosstabs: Revenue by region across product lines.',
      'Cost Centers: Monthly expenses by department and account category.',
      'Retail Stores: Product volume sold per store location.'
    ],
    practiceExamples: createPracticeSet('PIVOTBY', [
      {
        title: 'Sales by Region and Product',
        scenario: 'Create a 2D crosstab of Sales in C2:C5 with Region in A2:A5 (rows) and Product in B2:B5 (cols) using SUM (1).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Region', 'Product', 'Sales'], [['North', 'Laptop', 5000], ['South', 'Laptop', 3000], ['North', 'Phone', 2000], ['South', 'Phone', 1500]]),
        targetResult: [['North', 7000], ['South', 4500]],
        targetResultDisplay: 'North: 7,000 | South: 4,500',
        referenceFormula: '=PIVOTBY(A2:A5, B2:B5, C2:C5, 1)',
        hint: 'Use =PIVOTBY(A2:A5, B2:B5, C2:C5, 1)',
        explanation: 'Generates dynamic 2D summary matrix.'
      },
      {
        title: 'Deal Count by Region and Status',
        scenario: 'Crosstab order counts with Region A2:A5 as rows, Status B2:B5 as cols, and Deal C2:C5 using COUNT (3).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Region', 'Status', 'DealID'], [['East', 'Won', 1], ['West', 'Won', 2], ['East', 'Lost', 3], ['East', 'Won', 4]]),
        targetResult: [['East', 3], ['West', 1]],
        targetResultDisplay: 'East: 3 | West: 1',
        referenceFormula: '=PIVOTBY(A2:A5, B2:B5, C2:C5, 3)',
        hint: 'Use function code 3 for COUNT.',
        explanation: 'Cross-tabulates win/loss counts.'
      },
      {
        title: 'Average Deal Size Matrix',
        scenario: 'Compute average sales using code 2 (AVERAGE) with Region A2:A5 as rows and Product B2:B5 as cols.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Region', 'Product', 'Amount'], [['North', 'Desk', 400], ['South', 'Desk', 300], ['North', 'Desk', 600], ['South', 'Desk', 500]]),
        targetResult: [['North', 500], ['South', 400]],
        targetResultDisplay: 'North: 500 | South: 400',
        referenceFormula: '=PIVOTBY(A2:A5, B2:B5, C2:C5, 2)',
        hint: 'Use 2 for AVERAGE.',
        explanation: 'Averages sales per region.'
      },
      {
        title: 'Department Expense Matrix',
        scenario: 'Sum expenses in C2:C5 by Dept A2:A5 and Category B2:B5.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Dept', 'Cat', 'Cost'], [['IT', 'H/W', 2000], ['HR', 'Travel', 800], ['IT', 'S/W', 1500], ['HR', 'Training', 1200]]),
        targetResult: [['IT', 3500], ['HR', 2000]],
        targetResultDisplay: 'IT: 3,500 | HR: 2,000',
        referenceFormula: '=PIVOTBY(A2:A5, B2:B5, C2:C5, 1)',
        hint: 'Use =PIVOTBY(A2:A5, B2:B5, C2:C5, 1)',
        explanation: 'Crosstabulates cost by department.'
      },
      {
        title: 'Store Units Sold Crosstab',
        scenario: 'Sum units sold in C2:C5 with Store in A2:A5 and Brand in B2:B5.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Store', 'Brand', 'Units'], [['Store-1', 'Brand-A', 50], ['Store-2', 'Brand-A', 40], ['Store-1', 'Brand-B', 80], ['Store-2', 'Brand-B', 60]]),
        targetResult: [['Store-1', 130], ['Store-2', 100]],
        targetResultDisplay: 'Store-1: 130 | Store-2: 100',
        referenceFormula: '=PIVOTBY(A2:A5, B2:B5, C2:C5, 1)',
        hint: 'Use code 1 for SUM.',
        explanation: 'Store inventory breakdown.'
      },
      {
        title: 'Max Deal Matrix',
        scenario: 'Find peak deal using code 6 (MAX) by Region in A2:A5 and Rep in B2:B5.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Region', 'Rep', 'Sale'], [['North', 'Alex', 4000], ['North', 'Sam', 8000], ['South', 'Lisa', 3500], ['South', 'Tom', 6200]]),
        targetResult: [['North', 8000], ['South', 6200]],
        targetResultDisplay: 'North: 8,000 | South: 6,200',
        referenceFormula: '=PIVOTBY(A2:A5, B2:B5, C2:C5, 6)',
        hint: 'Use 6 for MAX.',
        explanation: 'Peak deals per territory.'
      },
      {
        title: 'Shipping Volume by Carrier',
        scenario: 'Count packages by Carrier A2:A5 and Speed B2:B5 using code 3.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Carrier', 'Speed', 'PkgID'], [['FedEx', 'NextDay', 10], ['UPS', 'Ground', 20], ['FedEx', 'Ground', 30], ['UPS', 'NextDay', 40]]),
        targetResult: [['FedEx', 2], ['UPS', 2]],
        targetResultDisplay: 'FedEx: 2 | UPS: 2',
        referenceFormula: '=PIVOTBY(A2:A5, B2:B5, C2:C5, 3)',
        hint: 'Use 3 for COUNT.',
        explanation: 'Package volume by carrier.'
      },
      {
        title: 'Ad Channel Leads by Segment',
        scenario: 'Sum leads in C2:C5 by Channel A2:A5 and Segment B2:B5.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Channel', 'Segment', 'Leads'], [['Google', 'B2B', 150], ['Meta', 'B2C', 300], ['Google', 'B2C', 200], ['Meta', 'B2B', 80]]),
        targetResult: [['Google', 350], ['Meta', 380]],
        targetResultDisplay: 'Google: 350 | Meta: 380',
        referenceFormula: '=PIVOTBY(A2:A5, B2:B5, C2:C5, 1)',
        hint: 'Use =PIVOTBY(A2:A5, B2:B5, C2:C5, 1)',
        explanation: 'Leads per advertising channel.'
      },
      {
        title: 'Defect Minima Across Shifts',
        scenario: 'Find minimum defect count using code 5 (MIN) by Line in A2:A5 and Shift in B2:B5.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Line', 'Shift', 'Defects'], [['Line-1', 'Morning', 3], ['Line-2', 'Night', 1], ['Line-1', 'Night', 2], ['Line-2', 'Morning', 4]]),
        targetResult: [['Line-1', 2], ['Line-2', 1]],
        targetResultDisplay: 'Line-1: 2 | Line-2: 1',
        referenceFormula: '=PIVOTBY(A2:A5, B2:B5, C2:C5, 5)',
        hint: 'Use 5 for MIN.',
        explanation: 'Best quality run.'
      }
    ])
  },
  {
    id: 'percentof',
    name: 'PERCENTOF',
    category: 'summary-grouping-ai',
    difficulty: 'advanced',
    chapter: 11,
    microsoft365Only: true,
    syntax: '=PERCENTOF(data_subset, data_all)',
    description: '★ Microsoft 365 (2025): Calculates what proportion a subset represents of a larger total. Self-documenting companion to GROUPBY and PIVOTBY.',
    parameters: [
      { name: 'data_subset', required: true, description: 'Values or cells for the numerator.' },
      { name: 'data_all', required: true, description: 'The full population or range for the denominator.' }
    ],
    referenceExamples: [
      { context: 'What percentage of total revenue comes from North (B2 vs B2:B1000)?', formula: '=PERCENTOF(B2, SUM(B2:B1000))', result: '32%', explanation: 'Regional share of total.' },
      { context: 'Embedded in GROUPBY for share of total.', formula: '=GROUPBY(Table1[Region], Table1[Sales], LAMBDA(x, HSTACK(SUM(x), PERCENTOF(x, Table1[Sales]))))', result: 'Amount & % Share', explanation: 'Calculates both metric and proportion.' }
    ],
    realWorldScenarios: [
      'Sales Contribution: Identify product lines driving disproportionate revenue.',
      'Budget Utilization: Percentage of department budget consumed.',
      'Market Share: Brand volume versus overall category size.'
    ],
    practiceExamples: createPracticeSet('PERCENTOF', [
      {
        title: 'Regional Revenue Share',
        scenario: 'Calculate North region share (A2: 2500) of total revenue (A2:A5: sum is 10000).',
        dataset: makePracticeDataset(['A'], ['Sales'], [[2500], [3500], [2000], [2000]]),
        targetResult: 0.25,
        targetResultDisplay: '0.25 (25%)',
        referenceFormula: '=PERCENTOF(A2, A2:A5)',
        hint: 'Use =PERCENTOF(A2, A2:A5)',
        explanation: '2500 / 10000 = 0.25 (25%).'
      },
      {
        title: 'Top Product Contribution',
        scenario: 'Find share of top product revenue (A2: 6000) against entire catalog (A2:A4: 6000, 3000, 1000).',
        dataset: makePracticeDataset(['A'], ['Revenue'], [[6000], [3000], [1000]]),
        targetResult: 0.6,
        targetResultDisplay: '0.60 (60%)',
        referenceFormula: '=PERCENTOF(A2, A2:A4)',
        hint: 'Use =PERCENTOF(A2, A2:A4)',
        explanation: '6000 / 10000 = 0.60.'
      },
      {
        title: 'Department Headcount Proportion',
        scenario: 'Find Engineering headcount share (A2: 40) out of total company staff in A2:A4 (40, 35, 25).',
        dataset: makePracticeDataset(['A'], ['Headcount'], [[40], [35], [25]]),
        targetResult: 0.4,
        targetResultDisplay: '0.40 (40%)',
        referenceFormula: '=PERCENTOF(A2, A2:A4)',
        hint: 'Use =PERCENTOF(A2, A2:A4)',
        explanation: '40 / 100 = 40%.'
      },
      {
        title: 'Operating Cost Share',
        scenario: 'Calculate Rent expense share in A2 (3000) of total expenses in A2:A4 (3000, 1500, 500).',
        dataset: makePracticeDataset(['A'], ['Expense'], [[3000], [1500], [500]]),
        targetResult: 0.6,
        targetResultDisplay: '0.60 (60%)',
        referenceFormula: '=PERCENTOF(A2, A2:A4)',
        hint: 'Use =PERCENTOF(A2, A2:A4)',
        explanation: '3000 / 5000 = 0.60.'
      },
      {
        title: 'Web Traffic Channel Proportion',
        scenario: 'Find Organic traffic share in A2 (5000) out of all traffic in A2:A4 (5000, 3000, 2000).',
        dataset: makePracticeDataset(['A'], ['Sessions'], [[5000], [3000], [2000]]),
        targetResult: 0.5,
        targetResultDisplay: '0.50 (50%)',
        referenceFormula: '=PERCENTOF(A2, A2:A4)',
        hint: 'Use =PERCENTOF(A2, A2:A4)',
        explanation: '5000 / 10000 = 50%.'
      },
      {
        title: 'Survey Top Box Score',
        scenario: 'Find 5-star ratings share in A2 (75) out of total responses in A2:A3 (75, 25).',
        dataset: makePracticeDataset(['A'], ['Responses'], [[75], [25]]),
        targetResult: 0.75,
        targetResultDisplay: '0.75 (75%)',
        referenceFormula: '=PERCENTOF(A2, A2:A3)',
        hint: 'Use =PERCENTOF(A2, A2:A3)',
        explanation: '75 / 100 = 75%.'
      },
      {
        title: 'Inventory Clearance Share',
        scenario: 'Find clearance stock share in A2 (200) out of total stock in A2:A4 (200, 500, 300).',
        dataset: makePracticeDataset(['A'], ['Stock'], [[200], [500], [300]]),
        targetResult: 0.2,
        targetResultDisplay: '0.20 (20%)',
        referenceFormula: '=PERCENTOF(A2, A2:A4)',
        hint: 'Use =PERCENTOF(A2, A2:A4)',
        explanation: '200 / 1000 = 20%.'
      },
      {
        title: 'Q1 Profit Share of Annual',
        scenario: 'Find Q1 profit in A2 (25000) of annual total in A2:A5 (25k, 30k, 20k, 25k).',
        dataset: makePracticeDataset(['A'], ['Profit'], [[25000], [30000], [20000], [25000]]),
        targetResult: 0.25,
        targetResultDisplay: '0.25 (25%)',
        referenceFormula: '=PERCENTOF(A2, A2:A5)',
        hint: 'Use =PERCENTOF(A2, A2:A5)',
        explanation: '25k / 100k = 25%.'
      },
      {
        title: 'Server Cloud Spend Proportion',
        scenario: 'Find Database instance cost share in A2 (1200) of total cloud bill in A2:A3 (1200, 2800).',
        dataset: makePracticeDataset(['A'], ['Bill'], [[1200], [2800]]),
        targetResult: 0.3,
        targetResultDisplay: '0.30 (30%)',
        referenceFormula: '=PERCENTOF(A2, A2:A3)',
        hint: 'Use =PERCENTOF(A2, A2:A3)',
        explanation: '1200 / 4000 = 30%.'
      }
    ])
  }
];

export const allExcelFunctions: ExcelFunction[] = [
  ...mathTrigFunctions,
  ...statisticalFunctions,
  ...logicalFunctions,
  ...textFunctions,
  ...dateTimeFunctions,
  ...financialFunctions,
  ...lookupFunctions,
  ...dynamicArrayFunctions,
  ...summaryAiFunctions,
  ...additionalBookFunctions,
];
