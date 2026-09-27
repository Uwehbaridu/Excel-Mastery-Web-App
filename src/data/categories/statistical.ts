import { ExcelFunction } from '../../types/formula';
import { makePracticeDataset, createPracticeSet } from '../practiceFactory';

export const statisticalFunctions: ExcelFunction[] = [
  {
    id: 'average',
    name: 'AVERAGE',
    category: 'statistical',
    difficulty: 'beginner',
    chapter: 3,
    microsoft365Only: false,
    syntax: '=AVERAGE(number1, [number2], ...)',
    description: 'Calculates the arithmetic mean of numbers in a range. Ignores text and empty cells, but includes zero values.',
    parameters: [
      { name: 'number1', required: true, description: 'First number or range.' },
      { name: 'number2', required: false, description: 'Additional numbers or ranges.' }
    ],
    referenceExamples: [
      { context: 'Monthly sales B2:B13.', formula: '=AVERAGE(B2:B13)', result: '34,250', explanation: 'Mean monthly performance baseline.' },
      { context: 'Conditional average using FILTER.', formula: '=AVERAGE(FILTER(B2:B100, C2:C100="North"))', result: '7,840', explanation: 'Average transaction value in North.' },
      { context: 'Exam scores in two papers B2:B13 and D2:D13.', formula: '=AVERAGE(B2:B13, D2:D13)', result: '68.4', explanation: 'Combined cohort performance.' }
    ],
    realWorldScenarios: [
      'Sales Targets: Establish baseline run rate to set next quarter growth goals.',
      'Healthcare: Average patient wait times against SLA standards.',
      'Manufacturing: Mean daily production output for capacity planning.'
    ],
    practiceExamples: createPracticeSet('AVERAGE', [
      {
        title: 'Monthly Sales Average',
        scenario: 'Find the average monthly sales across cells B2 to B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Month', 'Sales'], [['Jan', 32000], ['Feb', 35000], ['Mar', 41000], ['Apr', 28000]]),
        targetResult: 34000,
        targetResultDisplay: '34,000',
        referenceFormula: '=AVERAGE(B2:B5)',
        hint: 'Use =AVERAGE(B2:B5)',
        explanation: '(32k + 35k + 41k + 28k) / 4 = 34,000.'
      },
      {
        title: 'Customer Satisfaction Score',
        scenario: 'Calculate the average rating across customer feedback in B2:B6.',
        dataset: makePracticeDataset(['A', 'B'], ['Ticket', 'Rating'], [['T-1', 4.5], ['T-2', 5.0], ['T-3', 3.5], ['T-4', 4.0], ['T-5', 5.0]]),
        targetResult: 4.4,
        targetResultDisplay: '4.4',
        referenceFormula: '=AVERAGE(B2:B6)',
        hint: 'Average range B2:B6.',
        explanation: 'Average satisfaction rating is 4.4 / 5.0.'
      },
      {
        title: 'Dual-Exam Average',
        scenario: 'Calculate average across both Midterm (B2:B4) and Final (C2:C4).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Student', 'Midterm', 'Final'], [['Zack', 70, 80], ['Faye', 85, 95], ['Cole', 60, 90]]),
        targetResult: 80,
        targetResultDisplay: '80',
        referenceFormula: '=AVERAGE(B2:C4)',
        hint: 'Pass the block B2:C4 into AVERAGE.',
        explanation: 'Sum of all 6 scores (480) divided by 6 is 80.'
      },
      {
        title: 'Warehouse Picking Time',
        scenario: 'Find the average seconds to pick orders in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Order', 'Secs'], [['Ord-1', 42], ['Ord-2', 55], ['Ord-3', 38], ['Ord-4', 65]]),
        targetResult: 50,
        targetResultDisplay: '50',
        referenceFormula: '=AVERAGE(B2:B5)',
        hint: 'Use =AVERAGE(B2:B5)',
        explanation: '(42+55+38+65)/4 = 50 seconds.'
      },
      {
        title: 'Average Deal Size',
        scenario: 'Calculate the mean contract value in C2:C5.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Client', 'Tier', 'Value'], [['Alpha', 'Ent', 12000], ['Beta', 'Mid', 6000], ['Gamma', 'Ent', 18000], ['Delta', 'Mid', 8000]]),
        targetResult: 11000,
        targetResultDisplay: '11,000',
        referenceFormula: '=AVERAGE(C2:C5)',
        hint: 'Use =AVERAGE(C2:C5)',
        explanation: 'Mean deal size is 11,000.'
      },
      {
        title: 'Weekly Electric Usage',
        scenario: 'Compute average daily kWh consumed across B2:B8.',
        dataset: makePracticeDataset(['A', 'B'], ['Day', 'kWh'], [['Mon', 120], ['Tue', 135], ['Wed', 140], ['Thu', 130], ['Fri', 125], ['Sat', 90], ['Sun', 100]]),
        targetResult: 120,
        targetResultDisplay: '120',
        referenceFormula: '=AVERAGE(B2:B8)',
        hint: 'Use =AVERAGE(B2:B8)',
        explanation: 'Weekly mean is 120 kWh/day.'
      },
      {
        title: 'Sensor Temperature Baseline',
        scenario: 'Find baseline temp from sensor readings in B2:B6.',
        dataset: makePracticeDataset(['A', 'B'], ['Time', 'Temp'], [['08:00', 21.2], ['10:00', 22.8], ['12:00', 25.0], ['14:00', 24.6], ['16:00', 21.4]]),
        targetResult: 23,
        targetResultDisplay: '23',
        referenceFormula: '=AVERAGE(B2:B6)',
        hint: 'Use =AVERAGE(B2:B6)',
        explanation: 'Average temperature is 23.0°C.'
      },
      {
        title: 'Call Center Talk Time',
        scenario: 'Calculate average agent handling time in minutes from B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Agent', 'Mins'], [['Sarah', 4.2], ['Dan', 5.8], ['Rita', 3.6], ['Tom', 6.4]]),
        targetResult: 5,
        targetResultDisplay: '5.0',
        referenceFormula: '=AVERAGE(B2:B5)',
        hint: 'Use =AVERAGE(B2:B5)',
        explanation: 'Mean handle time is 5 minutes.'
      },
      {
        title: 'Quarterly Unit Sales',
        scenario: 'Find average quarterly units sold in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Quarter', 'Units'], [['Q1', 450], ['Q2', 550], ['Q3', 600], ['Q4', 800]]),
        targetResult: 600,
        targetResultDisplay: '600',
        referenceFormula: '=AVERAGE(B2:B5)',
        hint: 'Use =AVERAGE(B2:B5)',
        explanation: 'Average quarterly volume is 600 units.'
      }
    ])
  },
  {
    id: 'averageif',
    name: 'AVERAGEIF',
    category: 'statistical',
    difficulty: 'intermediate',
    chapter: 3,
    microsoft365Only: false,
    syntax: '=AVERAGEIF(range, criteria, [average_range])',
    description: 'Calculates the average of cells that meet a single condition. Perfect for regional or segmented performance tracking.',
    parameters: [
      { name: 'range', required: true, description: 'Cells tested against the condition.' },
      { name: 'criteria', required: true, description: 'The condition (e.g., "North", ">5000").' },
      { name: 'average_range', required: false, description: 'Cells to average (omitted if same as range).' }
    ],
    referenceExamples: [
      { context: 'Average sales for North region: Region in C2:C100, Sales in B2:B100.', formula: '=AVERAGEIF(C2:C100, "North", B2:B100)', result: '7,840', explanation: 'Regional mean transaction value.' },
      { context: 'Average values above $5,000 threshold.', formula: '=AVERAGEIF(B2:B100, ">5000")', result: '11,300', explanation: 'Averages only high-value deals.' },
      { context: 'Wildcard match for Laptop SKUs.', formula: '=AVERAGEIF(D2:D100, "*Laptop*", B2:B100)', result: '1,250', explanation: 'Product line average.' }
    ],
    realWorldScenarios: [
      'Regional Performance: Compare average transaction sizes across sales territories.',
      'HR Analytics: Average department salaries to identify pay disparity.',
      'Retail: Average shopping basket size on weekend versus weekday shifts.'
    ],
    practiceExamples: createPracticeSet('AVERAGEIF', [
      {
        title: 'North Region Sales Average',
        scenario: 'Find average sales in B2:B5 for rows where Region in A2:A5 is "North".',
        dataset: makePracticeDataset(['A', 'B'], ['Region', 'Sales'], [['North', 8000], ['South', 4000], ['North', 10000], ['East', 6000]]),
        targetResult: 9000,
        targetResultDisplay: '9,000',
        referenceFormula: '=AVERAGEIF(A2:A5, "North", B2:B5)',
        hint: 'Use =AVERAGEIF(A2:A5, "North", B2:B5)',
        explanation: 'Row 2 (8000) and Row 4 (10000) average to 9000.'
      },
      {
        title: 'High-Value Deals Average',
        scenario: 'Find the average of transactions in A2:A5 that exceed 5000.',
        dataset: makePracticeDataset(['A'], ['DealSize'], [[4200], [8000], [2100], [12000]]),
        targetResult: 10000,
        targetResultDisplay: '10,000',
        referenceFormula: '=AVERAGEIF(A2:A5, ">5000")',
        hint: 'Omit the third argument: =AVERAGEIF(A2:A5, ">5000")',
        explanation: '(8000 + 12000) / 2 = 10,000.'
      },
      {
        title: 'Wildcard SKU Line Average',
        scenario: 'Average prices in B2:B5 for items in A2:A5 containing "Pro".',
        dataset: makePracticeDataset(['A', 'B'], ['Item', 'Price'], [['Pro Tablet', 600], ['Basic Phone', 200], ['Pro Laptop', 1200], ['Desk Mat', 50]]),
        targetResult: 900,
        targetResultDisplay: '900',
        referenceFormula: '=AVERAGEIF(A2:A5, "*Pro*", B2:B5)',
        hint: 'Use "*Pro*" as criteria.',
        explanation: '(600 + 1200) / 2 = 900.'
      },
      {
        title: 'Department Salary Benchmark',
        scenario: 'Calculate average salary in B2:B5 for employees in "IT" department (Col A).',
        dataset: makePracticeDataset(['A', 'B'], ['Dept', 'Salary'], [['IT', 75000], ['HR', 60000], ['IT', 85000], ['Finance', 70000]]),
        targetResult: 80000,
        targetResultDisplay: '80,000',
        referenceFormula: '=AVERAGEIF(A2:A5, "IT", B2:B5)',
        hint: 'Use =AVERAGEIF(A2:A5, "IT", B2:B5)',
        explanation: '(75k + 85k) / 2 = 80,000.'
      },
      {
        title: 'Non-Zero Defect Average',
        scenario: 'Average defect counts in A2:A5 excluding zero-defect runs (">0").',
        dataset: makePracticeDataset(['A'], ['Defects'], [[0], [4], [0], [6]]),
        targetResult: 5,
        targetResultDisplay: '5',
        referenceFormula: '=AVERAGEIF(A2:A5, ">0")',
        hint: 'Condition is ">0": =AVERAGEIF(A2:A5, ">0")',
        explanation: '(4 + 6) / 2 = 5.'
      },
      {
        title: 'Exclude Cancelled Orders',
        scenario: 'Average order value in B2:B5 for orders with status not equal to "Cancelled" ("<>Cancelled").',
        dataset: makePracticeDataset(['A', 'B'], ['Status', 'Value'], [['Complete', 120], ['Cancelled', 50], ['Complete', 180]]),
        targetResult: 150,
        targetResultDisplay: '150',
        referenceFormula: '=AVERAGEIF(A2:A4, "<>Cancelled", B2:B4)',
        hint: 'Use "<>Cancelled" as criteria.',
        explanation: '(120 + 180) / 2 = 150.'
      },
      {
        title: 'Senior Rep Performance',
        scenario: 'Average revenue in C2:C5 for reps with Level in B2:B5 equal to "Senior".',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Rep', 'Level', 'Rev'], [['Mia', 'Senior', 50000], ['Sam', 'Junior', 25000], ['Ron', 'Senior', 60000]]),
        targetResult: 55000,
        targetResultDisplay: '55,000',
        referenceFormula: '=AVERAGEIF(B2:B4, "Senior", C2:C4)',
        hint: 'Filter on "Senior".',
        explanation: '(50k + 60k) / 2 = 55,000.'
      },
      {
        title: 'Weekend Spend Basket',
        scenario: 'Average spend in B2:B5 on "Sat" days (Col A).',
        dataset: makePracticeDataset(['A', 'B'], ['Day', 'Spend'], [['Sat', 95], ['Mon', 35], ['Sat', 105], ['Wed', 40]]),
        targetResult: 100,
        targetResultDisplay: '100',
        referenceFormula: '=AVERAGEIF(A2:A5, "Sat", B2:B5)',
        hint: 'Filter on "Sat".',
        explanation: '(95 + 105) / 2 = 100.'
      },
      {
        title: 'Positive Net Cash Flows',
        scenario: 'Average only positive cash inflows in A2:A5 (">0").',
        dataset: makePracticeDataset(['A'], ['CashMovement'], [[-300], [500], [-100], [700]]),
        targetResult: 600,
        targetResultDisplay: '600',
        referenceFormula: '=AVERAGEIF(A2:A5, ">0")',
        hint: 'Condition is ">0".',
        explanation: '(500 + 700) / 2 = 600.'
      }
    ])
  },
  {
    id: 'count',
    name: 'COUNT',
    category: 'statistical',
    difficulty: 'beginner',
    chapter: 3,
    microsoft365Only: false,
    syntax: '=COUNT(value1, [value2], ...)',
    description: 'Counts how many cells in a range contain numbers. Ignores text, blanks, and errors. Crucial for measuring data completeness.',
    parameters: [{ name: 'value1', required: true, description: 'First cell or range.' }],
    referenceExamples: [
      { context: 'Count numeric sales entries in B2:B100.', formula: '=COUNT(B2:B100)', result: '83', explanation: 'Tallies valid numeric transactions.' },
      { context: 'Compare COUNTA to COUNT to find text contaminants.', formula: '=COUNTA(B2:B100) - COUNT(B2:B100)', result: '5', explanation: 'Identifies non-numeric entries.' }
    ],
    realWorldScenarios: [
      'Inventory: Count SKUs with populated numeric stock counts.',
      'Surveys: Valid sample size (N) calculation.',
      'Finance: Invoices with valid recorded payment amounts.'
    ],
    practiceExamples: createPracticeSet('COUNT', [
      {
        title: 'Count Numeric Records',
        scenario: 'Count how many cells in A2:A5 contain numeric values.',
        dataset: makePracticeDataset(['A'], ['Data'], [[105], ['N/A'], [240], [null]]),
        targetResult: 2,
        targetResultDisplay: '2',
        referenceFormula: '=COUNT(A2:A5)',
        hint: 'Use =COUNT(A2:A5)',
        explanation: 'Only 105 and 240 are numbers, so count is 2.'
      },
      {
        title: 'Completed Test Scores',
        scenario: 'Count how many students have a numeric test score in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Student', 'Score'], [['Liam', 85], ['Emma', null], ['Noah', 92], ['Olivia', 'Absent']]),
        targetResult: 2,
        targetResultDisplay: '2',
        referenceFormula: '=COUNT(B2:B5)',
        hint: 'Use =COUNT(B2:B5)',
        explanation: 'Blanks and "Absent" text are ignored.'
      },
      {
        title: 'Multi-Column Numeric Count',
        scenario: 'Count total numeric entries across B2:C4.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['ID', 'Col1', 'Col2'], [['1', 10, 'TBD'], ['2', null, 30], ['3', 40, 50]]),
        targetResult: 4,
        targetResultDisplay: '4',
        referenceFormula: '=COUNT(B2:C4)',
        hint: 'Pass range B2:C4 into COUNT.',
        explanation: 'There are 4 numbers (10, 30, 40, 50).'
      },
      {
        title: 'Invoice Payment Count',
        scenario: 'Count paid invoices in B2:B5 (where payment amount is entered).',
        dataset: makePracticeDataset(['A', 'B'], ['InvID', 'PaidAmount'], [['INV-01', 500], ['INV-02', null], ['INV-03', 1200], ['INV-04', 350]]),
        targetResult: 3,
        targetResultDisplay: '3',
        referenceFormula: '=COUNT(B2:B5)',
        hint: 'Use =COUNT(B2:B5)',
        explanation: '3 invoices have recorded numbers.'
      },
      {
        title: 'Quality Sensor Log',
        scenario: 'Count valid numeric sensor logs in B2:B6.',
        dataset: makePracticeDataset(['A', 'B'], ['Sensor', 'Value'], [['S1', 24.5], ['S2', 'ERR'], ['S3', 25.1], ['S4', null], ['S5', 24.8]]),
        targetResult: 3,
        targetResultDisplay: '3',
        referenceFormula: '=COUNT(B2:B6)',
        hint: 'Call COUNT on B2:B6.',
        explanation: '3 numeric readings.'
      },
      {
        title: 'Product Weight Check',
        scenario: 'Count packages weighed in A2:A5.',
        dataset: makePracticeDataset(['A'], ['WeightKg'], [[1.2], [null], [3.4], [2.8]]),
        targetResult: 3,
        targetResultDisplay: '3',
        referenceFormula: '=COUNT(A2:A5)',
        hint: 'Use =COUNT(A2:A5)',
        explanation: '3 cells contain numbers.'
      },
      {
        title: 'Survey Response N',
        scenario: 'Count total completed numeric rating responses in B2:B6.',
        dataset: makePracticeDataset(['A', 'B'], ['User', 'Rating'], [['U1', 5], ['U2', 4], ['U3', 'Skipped'], ['U4', 5], ['U5', null]]),
        targetResult: 3,
        targetResultDisplay: '3',
        referenceFormula: '=COUNT(B2:B6)',
        hint: 'Use =COUNT(B2:B6)',
        explanation: '3 respondents gave numeric ratings.'
      },
      {
        title: 'Delivery Times Logged',
        scenario: 'Count recorded transit hours in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Shipment', 'TransitHours'], [['SH-1', 48], ['SH-2', 'In Progress'], ['SH-3', 72], ['SH-4', 36]]),
        targetResult: 3,
        targetResultDisplay: '3',
        referenceFormula: '=COUNT(B2:B5)',
        hint: 'Use =COUNT(B2:B5)',
        explanation: '3 shipments have transit numbers.'
      },
      {
        title: 'Employee Age Completeness',
        scenario: 'Count populated employee ages in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Name', 'Age'], [['John', 34], ['Lisa', null], ['Mark', 42], ['Chloe', 29]]),
        targetResult: 3,
        targetResultDisplay: '3',
        referenceFormula: '=COUNT(B2:B5)',
        hint: 'Use =COUNT(B2:B5)',
        explanation: '3 populated age entries.'
      }
    ])
  },
  {
    id: 'counta',
    name: 'COUNTA',
    category: 'statistical',
    difficulty: 'beginner',
    chapter: 3,
    microsoft365Only: false,
    syntax: '=COUNTA(value1, [value2], ...)',
    description: 'Counts all non-empty cells (numbers, text, booleans, error codes). The standard function to count total populated records in a dataset.',
    parameters: [{ name: 'value1', required: true, description: 'First cell or range.' }],
    referenceExamples: [
      { context: 'Customer records populated in A2:A100.', formula: '=COUNTA(A2:A100)', result: '94', explanation: 'Checks populated count against source export.' },
      { context: 'Dynamic dashboard counter.', formula: '="Total orders: "&COUNTA(SalesData[OrderID])', result: 'Total orders: 312', explanation: 'Creates live KPI card.' }
    ],
    realWorldScenarios: [
      'CRM Database: Count total active account records.',
      'Project Milestones: Count completed tasks with filled completion dates.',
      'HR: Track timesheet submission volume.'
    ],
    practiceExamples: createPracticeSet('COUNTA', [
      {
        title: 'Count Total Populated Cells',
        scenario: 'Count all non-empty cells in A2:A5 (including text and numbers).',
        dataset: makePracticeDataset(['A'], ['Entries'], [['Active'], [100], [null], ['Pending']]),
        targetResult: 3,
        targetResultDisplay: '3',
        referenceFormula: '=COUNTA(A2:A5)',
        hint: 'Use =COUNTA(A2:A5)',
        explanation: 'Only the null cell is empty; 3 cells have values.'
      },
      {
        title: 'Roster Headcount',
        scenario: 'Count total enrolled student names in A2:A6.',
        dataset: makePracticeDataset(['A'], ['Name'], [['Alice'], ['Bob'], [null], ['David'], ['Elena']]),
        targetResult: 4,
        targetResultDisplay: '4',
        referenceFormula: '=COUNTA(A2:A6)',
        hint: 'Use =COUNTA(A2:A6)',
        explanation: '4 populated name records.'
      },
      {
        title: 'Checklist Task Count',
        scenario: 'Count filled tasks in A2:A5.',
        dataset: makePracticeDataset(['A'], ['Task'], [['Design UI'], ['Write Docs'], ['Deploy API'], [null]]),
        targetResult: 3,
        targetResultDisplay: '3',
        referenceFormula: '=COUNTA(A2:A5)',
        hint: 'Use =COUNTA(A2:A5)',
        explanation: '3 tasks are recorded.'
      },
      {
        title: 'Find Contaminated Text Cells',
        scenario: 'Find text contaminant count by subtracting COUNT(A2:A5) from COUNTA(A2:A5).',
        dataset: makePracticeDataset(['A'], ['MixedData'], [[100], ['Error'], [250], ['Pending']]),
        targetResult: 2,
        targetResultDisplay: '2',
        referenceFormula: '=COUNTA(A2:A5)-COUNT(A2:A5)',
        hint: 'Subtract COUNT from COUNTA: =COUNTA(A2:A5)-COUNT(A2:A5)',
        explanation: '4 non-empty minus 2 numbers = 2 text contaminants.'
      },
      {
        title: 'Timesheet Submissions',
        scenario: 'Count how many employees submitted timesheets in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Staff', 'Submitted'], [['Tom', 'Yes'], ['Ana', 'Yes'], ['Ben', null], ['Zoe', 'Yes']]),
        targetResult: 3,
        targetResultDisplay: '3',
        referenceFormula: '=COUNTA(B2:B5)',
        hint: 'Use =COUNTA(B2:B5)',
        explanation: '3 employees submitted.'
      },
      {
        title: 'Supplier Catalog SKUs',
        scenario: 'Count total listed SKUs in A2:A5.',
        dataset: makePracticeDataset(['A'], ['SKU'], [['SKU-A'], ['SKU-B'], ['SKU-C'], [null]]),
        targetResult: 3,
        targetResultDisplay: '3',
        referenceFormula: '=COUNTA(A2:A5)',
        hint: 'Use =COUNTA(A2:A5)',
        explanation: '3 valid SKU records.'
      },
      {
        title: 'Customer Email List Size',
        scenario: 'Count filled email addresses in B2:B6.',
        dataset: makePracticeDataset(['A', 'B'], ['Customer', 'Email'], [['Acme', 'info@acme.com'], ['Beta', null], ['Gamma', 'hi@gamma.io'], ['Delta', null], ['Epsilon', 'team@eps.com']]),
        targetResult: 3,
        targetResultDisplay: '3',
        referenceFormula: '=COUNTA(B2:B6)',
        hint: 'Use =COUNTA(B2:B6)',
        explanation: '3 non-empty emails.'
      },
      {
        title: 'Asset Serial Numbers',
        scenario: 'Count registered asset tags in A2:A5.',
        dataset: makePracticeDataset(['A'], ['AssetTag'], [['TAG-101'], ['TAG-102'], ['TAG-103'], ['TAG-104']]),
        targetResult: 4,
        targetResultDisplay: '4',
        referenceFormula: '=COUNTA(A2:A5)',
        hint: 'Use =COUNTA(A2:A5)',
        explanation: 'All 4 cells populated.'
      },
      {
        title: 'Meeting Attendance Roster',
        scenario: 'Count attendees logged in A2:A5.',
        dataset: makePracticeDataset(['A'], ['Attendee'], [['Dr. Lee'], ['Prof. Diaz'], [null], ['Eng. Obi']]),
        targetResult: 3,
        targetResultDisplay: '3',
        referenceFormula: '=COUNTA(A2:A5)',
        hint: 'Use =COUNTA(A2:A5)',
        explanation: '3 present attendees.'
      }
    ])
  },
  {
    id: 'countif',
    name: 'COUNTIF',
    category: 'statistical',
    difficulty: 'beginner',
    chapter: 3,
    microsoft365Only: false,
    syntax: '=COUNTIF(range, criteria)',
    description: 'Counts cells in a range that meet a single condition. Ideal for volume counts by territory, status, or threshold.',
    parameters: [
      { name: 'range', required: true, description: 'The cells to evaluate.' },
      { name: 'criteria', required: true, description: 'Condition to match.' }
    ],
    referenceExamples: [
      { context: 'Count major deals > $10,000.', formula: '=COUNTIF(B2:B100, ">10000")', result: '17', explanation: 'Counts high-value wins.' },
      { context: 'Count North region deals.', formula: '=COUNTIF(C2:C100, "North")', result: '34', explanation: 'Volume count by region.' },
      { context: 'Count #N/A lookup errors.', formula: '=COUNTIF(A2:A100, "#N/A")', result: '8', explanation: 'Data quality failure audit.' }
    ],
    realWorldScenarios: [
      'Customer Service: Count complaints received this month.',
      'Sales Management: Count deals closed above quota.',
      'HR: Count employees currently on leave.'
    ],
    practiceExamples: createPracticeSet('COUNTIF', [
      {
        title: 'Count North Deals',
        scenario: 'Count how many rows in A2:A5 have the Region "North".',
        dataset: makePracticeDataset(['A', 'B'], ['Region', 'Sales'], [['North', 5000], ['South', 3000], ['North', 7000], ['North', 4500]]),
        targetResult: 3,
        targetResultDisplay: '3',
        referenceFormula: '=COUNTIF(A2:A5, "North")',
        hint: 'Use =COUNTIF(A2:A5, "North")',
        explanation: '3 rows have "North".'
      },
      {
        title: 'Count Overdue Deals (>5000)',
        scenario: 'Count how many deals in B2:B5 exceed 5000.',
        dataset: makePracticeDataset(['A', 'B'], ['ID', 'Value'], [['D-1', 4500], ['D-2', 6200], ['D-3', 8100], ['D-4', 3000]]),
        targetResult: 2,
        targetResultDisplay: '2',
        referenceFormula: '=COUNTIF(B2:B5, ">5000")',
        hint: 'Use criteria ">5000": =COUNTIF(B2:B5, ">5000")',
        explanation: '6200 and 8100 exceed 5000.'
      },
      {
        title: 'Count "Completed" Tasks',
        scenario: 'Count how many tasks in B2:B5 have Status "Completed".',
        dataset: makePracticeDataset(['A', 'B'], ['Task', 'Status'], [['Wireframes', 'Completed'], ['Backend', 'In Progress'], ['Database', 'Completed'], ['QA', 'Pending']]),
        targetResult: 2,
        targetResultDisplay: '2',
        referenceFormula: '=COUNTIF(B2:B5, "Completed")',
        hint: 'Use =COUNTIF(B2:B5, "Completed")',
        explanation: '2 tasks completed.'
      },
      {
        title: 'Count Wildcard Product Matches',
        scenario: 'Count items in A2:A5 that contain "Phone".',
        dataset: makePracticeDataset(['A'], ['Product'], [['Phone Case'], ['Laptop Stand'], ['Phone Charger'], ['Wireless Mouse']]),
        targetResult: 2,
        targetResultDisplay: '2',
        referenceFormula: '=COUNTIF(A2:A5, "*Phone*")',
        hint: 'Use asterisk wildcards: "*Phone*".',
        explanation: '2 items match.'
      },
      {
        title: 'Count Non-Zero Days',
        scenario: 'Count active trading days where sales in A2:A5 > 0.',
        dataset: makePracticeDataset(['A'], ['DailySales'], [[0], [1450], [0], [2100]]),
        targetResult: 2,
        targetResultDisplay: '2',
        referenceFormula: '=COUNTIF(A2:A5, ">0")',
        hint: 'Use =COUNTIF(A2:A5, ">0")',
        explanation: '2 days had sales > 0.'
      },
      {
        title: 'Count Inactive Accounts',
        scenario: 'Count accounts in B2:B5 with Status "Inactive".',
        dataset: makePracticeDataset(['A', 'B'], ['Account', 'Status'], [['Acc-1', 'Active'], ['Acc-2', 'Inactive'], ['Acc-3', 'Inactive'], ['Acc-4', 'Active']]),
        targetResult: 2,
        targetResultDisplay: '2',
        referenceFormula: '=COUNTIF(B2:B5, "Inactive")',
        hint: 'Match "Inactive".',
        explanation: '2 accounts are inactive.'
      },
      {
        title: 'Count High Priority Tickets',
        scenario: 'Count tickets in B2:B5 with Priority "Urgent".',
        dataset: makePracticeDataset(['A', 'B'], ['Ticket', 'Priority'], [['T1', 'Low'], ['T2', 'Urgent'], ['T3', 'Urgent'], ['T4', 'Medium']]),
        targetResult: 2,
        targetResultDisplay: '2',
        referenceFormula: '=COUNTIF(B2:B5, "Urgent")',
        hint: 'Use =COUNTIF(B2:B5, "Urgent")',
        explanation: '2 urgent tickets.'
      },
      {
        title: 'Count Failing Scores (<50)',
        scenario: 'Count how many exam scores in A2:A5 are below 50.',
        dataset: makePracticeDataset(['A'], ['Grade'], [[75], [42], [88], [35]]),
        targetResult: 2,
        targetResultDisplay: '2',
        referenceFormula: '=COUNTIF(A2:A5, "<50")',
        hint: 'Condition is "<50".',
        explanation: '42 and 35 are below 50.'
      },
      {
        title: 'Count Employees in London',
        scenario: 'Count how many staff members in B2:B5 are based in "London".',
        dataset: makePracticeDataset(['A', 'B'], ['Name', 'Office'], [['Sarah', 'London'], ['Alex', 'Paris'], ['Dan', 'London'], ['Chloe', 'Berlin']]),
        targetResult: 2,
        targetResultDisplay: '2',
        referenceFormula: '=COUNTIF(B2:B5, "London")',
        hint: 'Use =COUNTIF(B2:B5, "London")',
        explanation: '2 staff in London.'
      }
    ])
  },
  {
    id: 'max',
    name: 'MAX',
    category: 'statistical',
    difficulty: 'beginner',
    chapter: 3,
    microsoft365Only: false,
    syntax: '=MAX(number1, [number2], ...)',
    description: 'Returns the largest value in a set of numbers. Essential for finding record performance ceilings, peak load, and upper bounds.',
    parameters: [{ name: 'number1', required: true, description: 'First number or range.' }],
    referenceExamples: [
      { context: 'Highest sales figure of quarter B2:B100.', formula: '=MAX(B2:B100)', result: '48,300', explanation: 'Benchmark best sales day.' },
      { context: 'Filtered region max.', formula: '=MAX(FILTER(B2:B100, C2:C100="North"))', result: '32,000', explanation: 'North regional peak deal.' }
    ],
    realWorldScenarios: [
      'Sales: Identify trophy deal of the quarter.',
      'Production: Highest daily factory output recorded.',
      'Finance: Largest single expense in a budget.'
    ],
    practiceExamples: createPracticeSet('MAX', [
      {
        title: 'Highest Sales Record',
        scenario: 'Find the highest sales figure in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Rep', 'Sales'], [['Liam', 4200], ['Emma', 8900], ['Noah', 7100], ['Olivia', 6400]]),
        targetResult: 8900,
        targetResultDisplay: '8,900',
        referenceFormula: '=MAX(B2:B5)',
        hint: 'Use =MAX(B2:B5)',
        explanation: '8900 is the largest value in the column.'
      },
      {
        title: 'Peak Server Temperature',
        scenario: 'Find the peak recorded temperature in A2:A5.',
        dataset: makePracticeDataset(['A'], ['TempC'], [[68.2], [74.5], [82.1], [71.0]]),
        targetResult: 82.1,
        targetResultDisplay: '82.1',
        referenceFormula: '=MAX(A2:A5)',
        hint: 'Use =MAX(A2:A5)',
        explanation: '82.1°C is the highest temp.'
      },
      {
        title: 'Top Exam Score',
        scenario: 'Identify the top score across Midterm (B2:B4) and Final (C2:C4).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Name', 'Midterm', 'Final'], [['Zoe', 88, 94], ['Leo', 91, 85], ['Sam', 79, 98]]),
        targetResult: 98,
        targetResultDisplay: '98',
        referenceFormula: '=MAX(B2:C4)',
        hint: 'Pass block B2:C4 into MAX.',
        explanation: '98 is the highest score.'
      },
      {
        title: 'Highest Bonus Paid',
        scenario: 'Find maximum bonus amount in C2:C5.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Emp', 'Dept', 'Bonus'], [['E1', 'Sales', 5000], ['E2', 'Sales', 8500], ['E3', 'Tech', 4000], ['E4', 'Tech', 6200]]),
        targetResult: 8500,
        targetResultDisplay: '8,500',
        referenceFormula: '=MAX(C2:C5)',
        hint: 'Use =MAX(C2:C5)',
        explanation: '8500 is highest.'
      },
      {
        title: 'Peak Daily Website Visitors',
        scenario: 'Find the peak traffic day in B2:B6.',
        dataset: makePracticeDataset(['A', 'B'], ['Day', 'Visitors'], [['Mon', 14200], ['Tue', 18500], ['Wed', 16100], ['Thu', 22400], ['Fri', 19800]]),
        targetResult: 22400,
        targetResultDisplay: '22,400',
        referenceFormula: '=MAX(B2:B6)',
        hint: 'Use =MAX(B2:B6)',
        explanation: 'Thursday had 22,400 visitors.'
      },
      {
        title: 'Fastest Sprint Speed',
        scenario: 'Find top speed recorded in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Runner', 'SpeedKmH'], [['R1', 31.2], ['R2', 34.8], ['R3', 32.5], ['R4', 33.1]]),
        targetResult: 34.8,
        targetResultDisplay: '34.8',
        referenceFormula: '=MAX(B2:B5)',
        hint: 'Use =MAX(B2:B5)',
        explanation: '34.8 km/h.'
      },
      {
        title: 'Largest Invoiced Amount',
        scenario: 'Find largest invoice in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Invoice', 'Total'], [['INV-01', 1450], ['INV-02', 4800], ['INV-03', 2900], ['INV-04', 3750]]),
        targetResult: 4800,
        targetResultDisplay: '4,800',
        referenceFormula: '=MAX(B2:B5)',
        hint: 'Use =MAX(B2:B5)',
        explanation: 'INV-02 at 4,800.'
      },
      {
        title: 'Max Inventory Reorder Delay',
        scenario: 'Find maximum lead time days in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Supplier', 'LeadDays'], [['S-A', 5], ['S-B', 14], ['S-C', 8], ['S-D', 21]]),
        targetResult: 21,
        targetResultDisplay: '21',
        referenceFormula: '=MAX(B2:B5)',
        hint: 'Use =MAX(B2:B5)',
        explanation: '21 days.'
      },
      {
        title: 'Highest Operating Margin',
        scenario: 'Find highest margin percentage in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Quarter', 'Margin'], [['Q1', 0.18], ['Q2', 0.24], ['Q3', 0.21], ['Q4', 0.29]]),
        targetResult: 0.29,
        targetResultDisplay: '0.29',
        referenceFormula: '=MAX(B2:B5)',
        hint: 'Use =MAX(B2:B5)',
        explanation: 'Q4 margin of 0.29.'
      }
    ])
  },
  {
    id: 'min',
    name: 'MIN',
    category: 'statistical',
    difficulty: 'beginner',
    chapter: 3,
    microsoft365Only: false,
    syntax: '=MIN(number1, [number2], ...)',
    description: 'Returns the smallest value in a set of numbers. Used to find floor values, worst-case performance, or minimum stock thresholds.',
    parameters: [{ name: 'number1', required: true, description: 'First number or range.' }],
    referenceExamples: [
      { context: 'Lowest sales day of quarter B2:B100.', formula: '=MIN(B2:B100)', result: '4,200', explanation: 'Worst-case performance day.' },
      { context: 'Ignore zeros with MINIFS.', formula: '=MINIFS(B2:B100, B2:B100, ">0")', result: '4,200', explanation: 'Finds lowest non-zero trading day.' }
    ],
    realWorldScenarios: [
      'Inventory: Identify SKU closest to stockout.',
      'HR: Minimum satisfaction score to catch disengaged teams.',
      'Finance: Smallest monthly cash flow buffer.'
    ],
    practiceExamples: createPracticeSet('MIN', [
      {
        title: 'Lowest Sales Day',
        scenario: 'Find the lowest sales figure in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Day', 'Sales'], [['Mon', 4200], ['Tue', 3100], ['Wed', 5400], ['Thu', 2800]]),
        targetResult: 2800,
        targetResultDisplay: '2,800',
        referenceFormula: '=MIN(B2:B5)',
        hint: 'Use =MIN(B2:B5)',
        explanation: '2800 is the smallest value in the column.'
      },
      {
        title: 'Lowest Stock Level',
        scenario: 'Find the minimum unit stock in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['SKU', 'Units'], [['A10', 45], ['A11', 12], ['A12', 88], ['A13', 24]]),
        targetResult: 12,
        targetResultDisplay: '12',
        referenceFormula: '=MIN(B2:B5)',
        hint: 'Use =MIN(B2:B5)',
        explanation: '12 units is closest to zero.'
      },
      {
        title: 'Minimum Defect Rate',
        scenario: 'Find the best (lowest) defect rate achieved in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Batch', 'Defects'], [['B-1', 0.04], ['B-2', 0.01], ['B-3', 0.03], ['B-4', 0.02]]),
        targetResult: 0.01,
        targetResultDisplay: '0.01',
        referenceFormula: '=MIN(B2:B5)',
        hint: 'Use =MIN(B2:B5)',
        explanation: '0.01 is the minimum.'
      },
      {
        title: 'Fastest Response Time',
        scenario: 'Find fastest support resolution time in minutes from B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Ticket', 'Mins'], [['T-1', 45], ['T-2', 18], ['T-3', 62], ['T-4', 25]]),
        targetResult: 18,
        targetResultDisplay: '18',
        referenceFormula: '=MIN(B2:B5)',
        hint: 'Use =MIN(B2:B5)',
        explanation: '18 minutes is fastest.'
      },
      {
        title: 'Lowest Supplier Quote',
        scenario: 'Find the lowest bid price among suppliers in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Vendor', 'Quote'], [['Vendor A', 14500], ['Vendor B', 13800], ['Vendor C', 15200], ['Vendor D', 14100]]),
        targetResult: 13800,
        targetResultDisplay: '13,800',
        referenceFormula: '=MIN(B2:B5)',
        hint: 'Use =MIN(B2:B5)',
        explanation: '13,800 is the cheapest quote.'
      },
      {
        title: 'Shortest Delivery Days',
        scenario: 'Find fastest shipping option in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Courier', 'Days'], [['Ground', 5], ['Air Express', 1], ['Freight', 7], ['Standard', 3]]),
        targetResult: 1,
        targetResultDisplay: '1',
        referenceFormula: '=MIN(B2:B5)',
        hint: 'Use =MIN(B2:B5)',
        explanation: '1 day.'
      },
      {
        title: 'Minimum Customer Score',
        scenario: 'Find the lowest score in A2:A5 to investigate dissatisfaction.',
        dataset: makePracticeDataset(['A'], ['NPS'], [[8], [3], [9], [6]]),
        targetResult: 3,
        targetResultDisplay: '3',
        referenceFormula: '=MIN(A2:A5)',
        hint: 'Use =MIN(A2:A5)',
        explanation: '3 is lowest.'
      },
      {
        title: 'Coldest Server Room Temp',
        scenario: 'Find lowest temperature in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Hour', 'Temp'], [['02:00', 16.4], ['06:00', 15.2], ['12:00', 21.0], ['18:00', 18.5]]),
        targetResult: 15.2,
        targetResultDisplay: '15.2',
        referenceFormula: '=MIN(B2:B5)',
        hint: 'Use =MIN(B2:B5)',
        explanation: '15.2°C.'
      },
      {
        title: 'Floor Price in Product Catalog',
        scenario: 'Find the entry-level price in B2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Item', 'Price'], [['Model X', 299], ['Model S', 149], ['Model Pro', 499], ['Accessory', 29]]),
        targetResult: 29,
        targetResultDisplay: '29',
        referenceFormula: '=MIN(B2:B5)',
        hint: 'Use =MIN(B2:B5)',
        explanation: '$29 is lowest.'
      }
    ])
  }
];
