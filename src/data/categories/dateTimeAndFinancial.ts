import { ExcelFunction } from '../../types/formula';
import { makePracticeDataset, createPracticeSet } from '../practiceFactory';

export const dateTimeFunctions: ExcelFunction[] = [
  {
    id: 'networkdays',
    name: 'NETWORKDAYS',
    category: 'date-time',
    difficulty: 'beginner',
    chapter: 6,
    microsoft365Only: false,
    syntax: '=NETWORKDAYS(start_date, end_date, [holidays])',
    description: 'Calculates the number of whole working days (Monday through Friday) between two dates, automatically excluding weekends and optional custom public holidays.',
    parameters: [
      { name: 'start_date', required: true, description: 'The start date.' },
      { name: 'end_date', required: true, description: 'The end date.' },
      { name: 'holidays', required: false, description: 'Optional list or range of holiday dates to exclude.' }
    ],
    referenceExamples: [
      { context: 'Working days between 1-Apr-2026 and 30-Apr-2026.', formula: '=NETWORKDAYS(A2, B2)', result: '22', explanation: 'Excludes weekend days for accurate project capacity.' },
      { context: 'Working days excluding holidays list in H2:H20.', formula: '=NETWORKDAYS(A2, B2, $H$2:$H$20)', result: '20', explanation: 'Excludes bank and national holidays.' },
      { context: 'SLA breach check > 30 working days.', formula: '=IF(NETWORKDAYS(A2,TODAY(),$H$2:$H$20)-1>30,"OVERDUE","On Track")', result: 'Status', explanation: 'Working-day-aware aging tracker.' }
    ],
    realWorldScenarios: [
      'Project Milestones: Calculate realistic sprint or delivery schedules in working days.',
      'Accounts Payable: Compute invoice aging excluding non-working days for contractual SLAs.',
      'HR/Payroll: Determine billable contractor working days in a pay period.'
    ],
    practiceExamples: createPracticeSet('NETWORKDAYS', [
      {
        title: 'Project Sprint Working Days',
        scenario: 'Calculate working days between Start Date (A2: 2026-04-01) and End Date (B2: 2026-04-30).',
        dataset: makePracticeDataset(['A', 'B'], ['StartDate', 'EndDate'], [['2026-04-01', '2026-04-30']]),
        targetResult: 22,
        targetResultDisplay: '22',
        referenceFormula: '=NETWORKDAYS(A2, B2)',
        hint: 'Use =NETWORKDAYS(A2, B2)',
        explanation: 'April 2026 has 22 weekdays (Monday to Friday).'
      },
      {
        title: 'Working Days with Public Holiday',
        scenario: 'Calculate working days between A2 and B2, excluding holiday date in C2 (2026-04-06).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Start', 'End', 'Holiday'], [['2026-04-01', '2026-04-30', '2026-04-06']]),
        targetResult: 21,
        targetResultDisplay: '21',
        referenceFormula: '=NETWORKDAYS(A2, B2, C2)',
        hint: 'Pass C2 as the third argument: =NETWORKDAYS(A2, B2, C2)',
        explanation: '22 weekdays minus 1 holiday = 21 working days.'
      },
      {
        title: 'Two-Week Sprint Days',
        scenario: 'Count working days in a 14-day calendar window (A2: 2026-05-04 to B2: 2026-05-15).',
        dataset: makePracticeDataset(['A', 'B'], ['SprintStart', 'SprintEnd'], [['2026-05-04', '2026-05-15']]),
        targetResult: 10,
        targetResultDisplay: '10',
        referenceFormula: '=NETWORKDAYS(A2, B2)',
        hint: 'Use =NETWORKDAYS(A2, B2)',
        explanation: 'Two 5-day work weeks equal 10 working days.'
      },
      {
        title: 'Ticket Resolution Elapsed Days',
        scenario: 'Calculate working days taken to resolve support ticket between A2 (2026-06-01) and B2 (2026-06-05).',
        dataset: makePracticeDataset(['A', 'B'], ['Opened', 'Resolved'], [['2026-06-01', '2026-06-05']]),
        targetResult: 5,
        targetResultDisplay: '5',
        referenceFormula: '=NETWORKDAYS(A2, B2)',
        hint: 'Use =NETWORKDAYS(A2, B2)',
        explanation: 'Monday to Friday is 5 full working days.'
      },
      {
        title: 'Invoice SLA Breach Check',
        scenario: 'If working days between A2 and B2 exceeds 10, return "Breach", else "OK".',
        dataset: makePracticeDataset(['A', 'B'], ['Received', 'Paid'], [['2026-04-01', '2026-04-20']]),
        targetResult: 'Breach',
        targetResultDisplay: '"Breach"',
        referenceFormula: '=IF(NETWORKDAYS(A2, B2)>10, "Breach", "OK")',
        hint: 'Wrap NETWORKDAYS > 10 in an IF.',
        explanation: '14 working days > 10, so it breached SLA.'
      },
      {
        title: 'Contractor Payable Days',
        scenario: 'Calculate billable days for contractor between A2 (2026-07-01) and B2 (2026-07-15).',
        dataset: makePracticeDataset(['A', 'B'], ['PeriodStart', 'PeriodEnd'], [['2026-07-01', '2026-07-15']]),
        targetResult: 11,
        targetResultDisplay: '11',
        referenceFormula: '=NETWORKDAYS(A2, B2)',
        hint: 'Use =NETWORKDAYS(A2, B2)',
        explanation: '11 working days.'
      },
      {
        title: 'Audit Review Duration',
        scenario: 'Count working days from A2 (2026-08-03) to B2 (2026-08-07).',
        dataset: makePracticeDataset(['A', 'B'], ['AuditStart', 'AuditEnd'], [['2026-08-03', '2026-08-07']]),
        targetResult: 5,
        targetResultDisplay: '5',
        referenceFormula: '=NETWORKDAYS(A2, B2)',
        hint: 'Use =NETWORKDAYS(A2, B2)',
        explanation: 'Exactly 5 business days.'
      },
      {
        title: 'Quarterly Working Days',
        scenario: 'Find working days for Q1 (A2: 2026-01-01 to B2: 2026-03-31).',
        dataset: makePracticeDataset(['A', 'B'], ['QStart', 'QEnd'], [['2026-01-01', '2026-03-31']]),
        targetResult: 65,
        targetResultDisplay: '65',
        referenceFormula: '=NETWORKDAYS(A2, B2)',
        hint: 'Use =NETWORKDAYS(A2, B2)',
        explanation: '65 weekdays in Q1 2026.'
      },
      {
        title: 'Notice Period Business Days',
        scenario: 'Count business days for 3-week notice period between A2 (2026-09-01) and B2 (2026-09-21).',
        dataset: makePracticeDataset(['A', 'B'], ['NoticeGiven', 'LastDay'], [['2026-09-01', '2026-09-21']]),
        targetResult: 15,
        targetResultDisplay: '15',
        referenceFormula: '=NETWORKDAYS(A2, B2)',
        hint: 'Use =NETWORKDAYS(A2, B2)',
        explanation: '15 working days.'
      }
    ])
  }
];

export const financialFunctions: ExcelFunction[] = [
  {
    id: 'pmt',
    name: 'PMT',
    category: 'financial',
    difficulty: 'intermediate',
    chapter: 8,
    microsoft365Only: false,
    syntax: '=PMT(rate, nper, pv, [fv], [type])',
    description: 'Calculates the constant periodic payment required to amortize a loan or reach an investment goal. Note sign convention: loan amounts (pv) are positive, periodic payments are returned as negative outflows.',
    parameters: [
      { name: 'rate', required: true, description: 'Interest rate per period (divide annual rate by 12 for monthly).' },
      { name: 'nper', required: true, description: 'Total number of payment periods.' },
      { name: 'pv', required: true, description: 'Present value (loan principal).' },
      { name: 'fv', required: false, description: 'Future value (default 0).' },
      { name: 'type', required: false, description: '0 = end of period (default), 1 = beginning of period.' }
    ],
    referenceExamples: [
      { context: '30-year $300k mortgage at 6% annual rate.', formula: '=PMT(0.06/12, 360, 300000)', result: '-$1,798.65', explanation: 'Monthly outflow needed to pay off loan.' },
      { context: '5-year $25k car loan at 4.5%.', formula: '=PMT(0.045/12, 60, 25000)', result: '-$466.08', explanation: 'Monthly car payment.' },
      { context: 'Dynamic loan table with SEQUENCE.', formula: '=PMT(0.06/12, SEQUENCE(10)*12*10, 300000)', result: 'Array spill', explanation: 'Sensitivity analysis across terms.' }
    ],
    realWorldScenarios: [
      'Mortgage Planning: Calculate monthly home loan payments to assess 28% DTI affordability.',
      'Equipment Leasing: Determine monthly debt service for capital machinery purchases.',
      'Auto Loans: Compare 36-month vs 60-month financing structures.'
    ],
    practiceExamples: createPracticeSet('PMT', [
      {
        title: 'Monthly Car Loan Payment',
        scenario: 'Calculate monthly payment for a $25,000 loan at 4.5% annual interest over 5 years (60 months).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Principal', 'AnnualRate', 'Months'], [[25000, 0.045, 60]]),
        targetResult: -466.08,
        targetResultDisplay: '-$466.08',
        referenceFormula: '=ROUND(PMT(B2/12, C2, A2), 2)',
        hint: 'Use =ROUND(PMT(B2/12, C2, A2), 2) or =PMT(0.045/12, 60, 25000)',
        explanation: 'Monthly rate is 0.045/12, nper is 60, pv is 25000. Result is -$466.08.'
      },
      {
        title: '30-Year Mortgage Payment',
        scenario: 'Calculate monthly payment for a $300,000 mortgage at 6.0% annual interest over 360 months.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['LoanAmount', 'AnnualRate', 'Periods'], [[300000, 0.06, 360]]),
        targetResult: -1798.65,
        targetResultDisplay: '-$1,798.65',
        referenceFormula: '=ROUND(PMT(B2/12, C2, A2), 2)',
        hint: 'Divide annual rate by 12: =PMT(B2/12, C2, A2)',
        explanation: 'Monthly debt service is -$1,798.65.'
      },
      {
        title: 'Equipment Lease Monthly Fee',
        scenario: 'Find monthly payment for $50,000 machine lease at 5% annual interest over 36 months.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Cost', 'Rate', 'Months'], [[50000, 0.05, 36]]),
        targetResult: -1498.54,
        targetResultDisplay: '-$1,498.54',
        referenceFormula: '=ROUND(PMT(B2/12, C2, A2), 2)',
        hint: 'Use =ROUND(PMT(B2/12, C2, A2), 2)',
        explanation: 'Monthly payment is -$1,498.54.'
      },
      {
        title: '3-Year Car Loan Comparison',
        scenario: 'Find monthly payment for $25,000 car at 4.5% over 3 years (36 months).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Amount', 'Rate', 'Months'], [[25000, 0.045, 36]]),
        targetResult: -743.95,
        targetResultDisplay: '-$743.95',
        referenceFormula: '=ROUND(PMT(B2/12, C2, A2), 2)',
        hint: 'Use =ROUND(PMT(B2/12, C2, A2), 2)',
        explanation: 'Higher monthly payment of -$743.95 saves interest overall.'
      },
      {
        title: 'Annual Bond Coupon Payment',
        scenario: 'Calculate annual debt payment for $100,000 loan at 8% annual interest over 10 annual periods.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Principal', 'AnnualRate', 'Years'], [[100000, 0.08, 10]]),
        targetResult: -14902.95,
        targetResultDisplay: '-$14,902.95',
        referenceFormula: '=ROUND(PMT(B2, C2, A2), 2)',
        hint: 'Since periods are annual, do not divide rate by 12: =ROUND(PMT(B2, C2, A2), 2)',
        explanation: 'Annual payment is -$14,902.95.'
      },
      {
        title: 'Target Savings Monthly Deposit',
        scenario: 'Find monthly savings needed to reach future $500,000 in 300 months at 7% return (pv=0, fv=500000).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['GoalFV', 'AnnualRate', 'Months'], [[500000, 0.07, 300]]),
        targetResult: -522.81,
        targetResultDisplay: '-$522.81',
        referenceFormula: '=ROUND(PMT(B2/12, C2, 0, A2), 2)',
        hint: 'Use 0 for pv and A2 for fv: =ROUND(PMT(B2/12, C2, 0, A2), 2)',
        explanation: 'Must save -$522.81 each month.'
      },
      {
        title: 'Small Business Working Capital Loan',
        scenario: 'Calculate monthly repayment for $15,000 loan at 9% over 24 months.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Loan', 'Rate', 'Term'], [[15000, 0.09, 24]]),
        targetResult: -685.25,
        targetResultDisplay: '-$685.25',
        referenceFormula: '=ROUND(PMT(B2/12, C2, A2), 2)',
        hint: 'Use =ROUND(PMT(B2/12, C2, A2), 2)',
        explanation: 'Payment is -$685.25.'
      },
      {
        title: '15-Year Fixed Mortgage',
        scenario: 'Calculate monthly payment for $200,000 loan at 5.5% over 180 months.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Principal', 'Rate', 'Months'], [[200000, 0.055, 180]]),
        targetResult: -1634.17,
        targetResultDisplay: '-$1,634.17',
        referenceFormula: '=ROUND(PMT(B2/12, C2, A2), 2)',
        hint: 'Divide rate by 12: =ROUND(PMT(B2/12, C2, A2), 2)',
        explanation: 'Payment is -$1,634.17.'
      },
      {
        title: 'Commercial Real Estate Loan',
        scenario: 'Calculate monthly debt service for $1,000,000 mortgage at 7% over 240 months.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Loan', 'Rate', 'Months'], [[1000000, 0.07, 240]]),
        targetResult: -7752.99,
        targetResultDisplay: '-$7,752.99',
        referenceFormula: '=ROUND(PMT(B2/12, C2, A2), 2)',
        hint: 'Use =ROUND(PMT(B2/12, C2, A2), 2)',
        explanation: 'Monthly debt service is -$7,752.99.'
      }
    ])
  }
];
