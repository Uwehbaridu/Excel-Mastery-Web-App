import { ExcelFunction } from '../../types/formula';
import { makePracticeDataset, createPracticeSet } from '../practiceFactory';

export const lookupFunctions: ExcelFunction[] = [
  {
    id: 'xlookup',
    name: 'XLOOKUP',
    category: 'lookup-reference',
    difficulty: 'intermediate',
    chapter: 7,
    microsoft365Only: true,
    syntax: '=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])',
    description: '★ Microsoft 365: The modern, superior successor to VLOOKUP and INDEX+MATCH. Looks in any direction (left or right), supports built-in error fallbacks, and does not break when columns are inserted.',
    parameters: [
      { name: 'lookup_value', required: true, description: 'The value to search for.' },
      { name: 'lookup_array', required: true, description: 'The range or column to search in.' },
      { name: 'return_array', required: true, description: 'The range or column to return results from.' },
      { name: 'if_not_found', required: false, description: 'Fallback text or value if no match is found.' },
      { name: 'match_mode', required: false, description: '0 = exact (default), -1 = exact or next smaller, 1 = exact or next larger, 2 = wildcard.' }
    ],
    referenceExamples: [
      { context: 'Customer ID in G2, lookup in A2:A1000, return Name in B2:B1000.', formula: '=XLOOKUP(G2, A2:A1000, B2:B1000, "Not Found")', result: 'Customer Name', explanation: 'Native error handling without IFERROR wrapper.' },
      { context: 'Look left: Match product name in C2:C1000, return supplier in A2:A1000.', formula: '=XLOOKUP(G2, C2:C1000, A2:A1000)', result: 'Supplier Code', explanation: 'Works leftward seamlessly.' },
      { context: 'Return entire 5-column row for a matched customer.', formula: '=XLOOKUP(G2, A2:A1000, B2:F1000)', result: '5-column spill', explanation: 'Multi-column return array.' }
    ],
    realWorldScenarios: [
      'Master Data: Pull customer details, phone, and account status in one clean formula.',
      'Price Lookups: Flexible price retrieval that survives column additions.',
      'Tiered Pricing: Search tiered commission or tax brackets in either direction.'
    ],
    practiceExamples: createPracticeSet('XLOOKUP', [
      {
        title: 'Basic Exact Match Lookup',
        scenario: 'Find the Customer Name for ID "C-102". Search in IDs (A2:A4) and return from Names (B2:B4).',
        dataset: makePracticeDataset(['A', 'B'], ['ID', 'Name'], [['C-101', 'Acme Corp'], ['C-102', 'Global Logistics'], ['C-103', 'Apex Design']]),
        targetResult: 'Global Logistics',
        targetResultDisplay: '"Global Logistics"',
        referenceFormula: '=XLOOKUP("C-102", A2:A4, B2:B4)',
        hint: 'Use =XLOOKUP("C-102", A2:A4, B2:B4)',
        explanation: 'Finds "C-102" in row 3 and returns "Global Logistics".'
      },
      {
        title: 'Look Left (Supplier by SKU)',
        scenario: 'Look up the Supplier Code in Col A for SKU "SKU-B" located in Col B.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Supplier', 'SKU', 'Price'], [['SUP-X', 'SKU-A', 50], ['SUP-Y', 'SKU-B', 80], ['SUP-Z', 'SKU-C', 120]]),
        targetResult: 'SUP-Y',
        targetResultDisplay: '"SUP-Y"',
        referenceFormula: '=XLOOKUP("SKU-B", B2:B4, A2:A4)',
        hint: 'XLOOKUP looks left: =XLOOKUP("SKU-B", B2:B4, A2:A4)',
        explanation: 'Retrieves column A based on column B match.'
      },
      {
        title: 'Built-in "Not Found" Fallback',
        scenario: 'Lookup ID "C-999" in A2:A4, returning "Not Found" if missing.',
        dataset: makePracticeDataset(['A', 'B'], ['ID', 'Name'], [['C-101', 'Acme'], ['C-102', 'Global'], ['C-103', 'Apex']]),
        targetResult: 'Not Found',
        targetResultDisplay: '"Not Found"',
        referenceFormula: '=XLOOKUP("C-999", A2:A4, B2:B4, "Not Found")',
        hint: 'Pass "Not Found" as the 4th argument: =XLOOKUP("C-999", A2:A4, B2:B4, "Not Found")',
        explanation: 'Avoids #N/A error gracefully.'
      },
      {
        title: 'Approximate Tier Bracket Match',
        scenario: 'Find commission rate in B2:B5 for sales of 42000 in brackets A2:A5 using match_mode -1.',
        dataset: makePracticeDataset(['A', 'B'], ['MinSales', 'Rate'], [[0, 0.05], [10000, 0.08], [25000, 0.12], [50000, 0.15]]),
        targetResult: 0.12,
        targetResultDisplay: '0.12 (12%)',
        referenceFormula: '=XLOOKUP(42000, A2:A5, B2:B5, , -1)',
        hint: 'Use -1 for match_mode: =XLOOKUP(42000, A2:A5, B2:B5, , -1)',
        explanation: '42,000 matches the 25,000 bracket (next smaller).'
      },
      {
        title: 'Product Price Check',
        scenario: 'Find price in C2:C5 for product "Monitor" (Col B).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['SKU', 'Item', 'Price'], [['P1', 'Keyboard', 45], ['P2', 'Monitor', 280], ['P3', 'Mouse', 25]]),
        targetResult: 280,
        targetResultDisplay: '280',
        referenceFormula: '=XLOOKUP("Monitor", B2:B4, C2:C4)',
        hint: 'Use =XLOOKUP("Monitor", B2:B4, C2:C4)',
        explanation: 'Returns 280.'
      },
      {
        title: 'Employee Department Lookup',
        scenario: 'Find department in B2:B5 for employee "Zoe" in A2:A5.',
        dataset: makePracticeDataset(['A', 'B'], ['Name', 'Dept'], [['Liam', 'Sales'], ['Zoe', 'Engineering'], ['Noah', 'Finance']]),
        targetResult: 'Engineering',
        targetResultDisplay: '"Engineering"',
        referenceFormula: '=XLOOKUP("Zoe", A2:A4, B2:B4)',
        hint: 'Lookup "Zoe".',
        explanation: 'Returns "Engineering".'
      },
      {
        title: 'Wildcard Product Search',
        scenario: 'Find the SKU for item matching "*Desk*" in B2:B4 using match_mode 2.',
        dataset: makePracticeDataset(['A', 'B'], ['SKU', 'Name'], [['FUR-10', 'Office Chair'], ['FUR-20', 'Standing Desk Pro'], ['FUR-30', 'File Cabinet']]),
        targetResult: 'FUR-20',
        targetResultDisplay: '"FUR-20"',
        referenceFormula: '=XLOOKUP("*Desk*", B2:B4, A2:A4, "None", 2)',
        hint: 'Use match_mode 2 for wildcards: =XLOOKUP("*Desk*", B2:B4, A2:A4, "None", 2)',
        explanation: 'Matches "Standing Desk Pro" and returns "FUR-20".'
      },
      {
        title: 'Currency Rate Lookup',
        scenario: 'Find EUR exchange rate in B2:B5 for currency "EUR" in A2:A5.',
        dataset: makePracticeDataset(['A', 'B'], ['Currency', 'RateToUSD'], [['GBP', 1.28], ['EUR', 1.08], ['JPY', 0.0065]]),
        targetResult: 1.08,
        targetResultDisplay: '1.08',
        referenceFormula: '=XLOOKUP("EUR", A2:A4, B2:B4)',
        hint: 'Lookup "EUR".',
        explanation: 'Returns 1.08.'
      },
      {
        title: 'Tax Rate by Zip Code',
        scenario: 'Find sales tax in B2:B5 for Zip "90210" in A2:A5.',
        dataset: makePracticeDataset(['A', 'B'], ['Zip', 'TaxRate'], [['10001', 0.08875], ['90210', 0.095], ['60601', 0.1025]]),
        targetResult: 0.095,
        targetResultDisplay: '0.095',
        referenceFormula: '=XLOOKUP("90210", A2:A4, B2:B4)',
        hint: 'Lookup "90210".',
        explanation: 'Returns 0.095.'
      }
    ])
  },
  {
    id: 'vlookup',
    name: 'VLOOKUP',
    category: 'lookup-reference',
    difficulty: 'intermediate',
    chapter: 7,
    microsoft365Only: false,
    syntax: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    description: 'Searches for a value in the first column of a table array and returns a value in the same row from an indexed column.',
    parameters: [
      { name: 'lookup_value', required: true, description: 'Value to search for.' },
      { name: 'table_array', required: true, description: 'Table range containing lookup and return columns.' },
      { name: 'col_index_num', required: true, description: 'Column number (1-based from left of range).' },
      { name: 'range_lookup', required: false, description: 'FALSE for exact match, TRUE for approximate.' }
    ],
    referenceExamples: [
      { context: 'Price lookup for SKU in G2.', formula: '=VLOOKUP(G2, A2:C100, 3, FALSE)', result: 'Unit Price', explanation: 'Exact match from 3rd column.' },
      { context: 'Safe lookup with IFERROR.', formula: '=IFERROR(VLOOKUP(G2, A2:C100, 3, FALSE), "Not Found")', result: 'Message', explanation: 'Wraps #N/A cleanly.' }
    ],
    realWorldScenarios: [
      'Point of Sale: Look up retail prices by scanning SKU barcode.',
      'Staff Directory: Pull manager name by employee ID.',
      'Legacy Workbooks: Maintain financial models built in older Excel versions.'
    ],
    practiceExamples: createPracticeSet('VLOOKUP', [
      {
        title: 'Exact Match Price Lookup',
        scenario: 'Find price for SKU "P02" in table A2:C4 (SKU in Col 1, Price in Col 3).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['SKU', 'Description', 'Price'], [['P01', 'Keyboard', 45], ['P02', 'Monitor', 280], ['P03', 'Mouse', 25]]),
        targetResult: 280,
        targetResultDisplay: '280',
        referenceFormula: '=VLOOKUP("P02", A2:C4, 3, FALSE)',
        hint: 'Use =VLOOKUP("P02", A2:C4, 3, FALSE)',
        explanation: 'Finds P02 in Col 1, returns 3rd column value 280.'
      },
      {
        title: 'Employee Role Retrieval',
        scenario: 'Find Role for employee "EMP-20" in A2:C4 (Col 2).',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['EmpID', 'Role', 'Office'], [['EMP-10', 'Developer', 'NY'], ['EMP-20', 'Architect', 'SF'], ['EMP-30', 'Analyst', 'London']]),
        targetResult: 'Architect',
        targetResultDisplay: '"Architect"',
        referenceFormula: '=VLOOKUP("EMP-20", A2:C4, 2, FALSE)',
        hint: 'Use column index 2: =VLOOKUP("EMP-20", A2:C4, 2, FALSE)',
        explanation: 'Returns "Architect".'
      },
      {
        title: 'Tax Bracket Approximate Match',
        scenario: 'Find tax rate for income 45000 in sorted table A2:B5 using TRUE for approximate match.',
        dataset: makePracticeDataset(['A', 'B'], ['Threshold', 'Rate'], [[0, 0.10], [30000, 0.20], [75000, 0.30], [150000, 0.40]]),
        targetResult: 0.2,
        targetResultDisplay: '0.20 (20%)',
        referenceFormula: '=VLOOKUP(45000, A2:B5, 2, TRUE)',
        hint: 'Use TRUE for approximate match: =VLOOKUP(45000, A2:B5, 2, TRUE)',
        explanation: '45,000 falls in 30,000 threshold (20%).'
      },
      {
        title: 'Safe Lookup with IFERROR',
        scenario: 'Lookup "P99" in A2:C4, returning "Not Found" if missing.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['SKU', 'Item', 'Price'], [['P01', 'Chair', 120], ['P02', 'Desk', 350]]),
        targetResult: 'Not Found',
        targetResultDisplay: '"Not Found"',
        referenceFormula: '=IFERROR(VLOOKUP("P99", A2:C3, 3, FALSE), "Not Found")',
        hint: 'Wrap VLOOKUP in IFERROR.',
        explanation: 'Returns "Not Found" on #N/A.'
      },
      {
        title: 'Discount Percentage by Code',
        scenario: 'Find discount rate in Col 2 for promo code "SUMMER" in A2:B4.',
        dataset: makePracticeDataset(['A', 'B'], ['Code', 'Discount'], [['WELCOME', 0.10], ['SUMMER', 0.20], ['VIP', 0.25]]),
        targetResult: 0.2,
        targetResultDisplay: '0.20',
        referenceFormula: '=VLOOKUP("SUMMER", A2:B4, 2, FALSE)',
        hint: 'Use =VLOOKUP("SUMMER", A2:B4, 2, FALSE)',
        explanation: 'Returns 0.20.'
      },
      {
        title: 'Customer City by Account',
        scenario: 'Lookup City in Col 3 for Account "ACC-10" in A2:C4.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Acc', 'Name', 'City'], [['ACC-05', 'BioLabs', 'Boston'], ['ACC-10', 'FinCorp', 'Chicago'], ['ACC-15', 'EduTech', 'Austin']]),
        targetResult: 'Chicago',
        targetResultDisplay: '"Chicago"',
        referenceFormula: '=VLOOKUP("ACC-10", A2:C4, 3, FALSE)',
        hint: 'Col index is 3: =VLOOKUP("ACC-10", A2:C4, 3, FALSE)',
        explanation: 'Returns "Chicago".'
      },
      {
        title: 'Shipping Cost by Zone',
        scenario: 'Find fee in Col 2 for Zone "Zone-3" in A2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['Zone', 'Fee'], [['Zone-1', 5], ['Zone-2', 12], ['Zone-3', 25], ['Zone-4', 40]]),
        targetResult: 25,
        targetResultDisplay: '25',
        referenceFormula: '=VLOOKUP("Zone-3", A2:B5, 2, FALSE)',
        hint: 'Lookup "Zone-3".',
        explanation: 'Returns 25.'
      },
      {
        title: 'Inventory Location Bin',
        scenario: 'Find storage aisle in Col 2 for Part "PT-44" in A2:B4.',
        dataset: makePracticeDataset(['A', 'B'], ['Part', 'Aisle'], [['PT-12', 'A-04'], ['PT-44', 'C-12'], ['PT-99', 'F-08']]),
        targetResult: 'C-12',
        targetResultDisplay: '"C-12"',
        referenceFormula: '=VLOOKUP("PT-44", A2:B4, 2, FALSE)',
        hint: 'Lookup "PT-44".',
        explanation: 'Returns "C-12".'
      },
      {
        title: 'Grade Boundary Approximate Lookup',
        scenario: 'Find grade letter in Col 2 for test score 82 in sorted scale A2:B5.',
        dataset: makePracticeDataset(['A', 'B'], ['MinScore', 'Grade'], [[0, 'F'], [60, 'D'], [70, 'C'], [80, 'B'], [90, 'A']]),
        targetResult: 'B',
        targetResultDisplay: '"B"',
        referenceFormula: '=VLOOKUP(82, A2:B6, 2, TRUE)',
        hint: 'Use TRUE for approximate match: =VLOOKUP(82, A2:B6, 2, TRUE)',
        explanation: '82 falls into >=80 ("B").'
      }
    ])
  }
];

export const dynamicArrayFunctions: ExcelFunction[] = [
  {
    id: 'filter',
    name: 'FILTER',
    category: 'dynamic-arrays',
    difficulty: 'advanced',
    chapter: 9,
    microsoft365Only: true,
    syntax: '=FILTER(array, include, [if_empty])',
    description: '★ Microsoft 365: Returns only the rows or columns from an array meeting one or more conditions. Dynamic replacement for manual AutoFilter.',
    parameters: [
      { name: 'array', required: true, description: 'Range or array to filter.' },
      { name: 'include', required: true, description: 'Boolean condition matching array height.' },
      { name: 'if_empty', required: false, description: 'Fallback value if no matches found.' }
    ],
    referenceExamples: [
      { context: 'Filter North sales rows.', formula: '=FILTER(A2:F1000, B2:B1000="North", "No North sales")', result: 'Spill table', explanation: 'Extracts matching rows dynamically.' },
      { context: 'Two conditions (North AND Revenue > 10,000).', formula: '=FILTER(A2:F1000, (B2:B1000="North") * (F2:F1000>10000), "No matches")', result: 'High-value North deals', explanation: 'Multiplies Boolean arrays for AND.' },
      { context: 'Filter overdue invoices with live TODAY() condition.', formula: '=FILTER(A2:F1000, TODAY()-D2:D1000>60, "No overdue")', result: 'Overdue list', explanation: 'Updates every morning.' }
    ],
    realWorldScenarios: [
      'Interactive Dashboards: Filter transactions dynamically based on dropdown selections.',
      'Inventory Alerts: Extract all SKUs below safety stock buffer.',
      'Credit Control: Live feed of invoices past 60-day aging window.'
    ],
    practiceExamples: createPracticeSet('FILTER', [
      {
        title: 'Filter North Region Sales',
        scenario: 'Extract all rows in A2:C5 where Region in Col A equals "North".',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Region', 'Rep', 'Sales'], [['North', 'Mia', 5000], ['South', 'Leo', 3200], ['North', 'Sam', 7500], ['East', 'Ada', 4100]]),
        targetResult: [['North', 'Mia', 5000], ['North', 'Sam', 7500]],
        targetResultDisplay: '2 rows (Mia 5000, Sam 7500)',
        referenceFormula: '=FILTER(A2:C5, A2:A5="North")',
        hint: 'Use =FILTER(A2:C5, A2:A5="North")',
        explanation: 'Returns rows matching North.'
      },
      {
        title: 'Filter Deals Above $5,000',
        scenario: 'Extract records in A2:B5 where Value in Col B > 5000.',
        dataset: makePracticeDataset(['A', 'B'], ['Client', 'Value'], [['Alpha', 4200], ['Beta', 8900], ['Gamma', 6100], ['Delta', 3500]]),
        targetResult: [['Beta', 8900], ['Gamma', 6100]],
        targetResultDisplay: '2 rows (Beta 8900, Gamma 6100)',
        referenceFormula: '=FILTER(A2:B5, B2:B5>5000)',
        hint: 'Use =FILTER(A2:B5, B2:B5>5000)',
        explanation: 'Filters to high-value transactions.'
      },
      {
        title: 'Filter with Fallback Message',
        scenario: 'Filter A2:B4 where Region is "West", returning "No West sales" if empty.',
        dataset: makePracticeDataset(['A', 'B'], ['Region', 'Sales'], [['North', 4000], ['South', 3000]]),
        targetResult: 'No West sales',
        targetResultDisplay: '"No West sales"',
        referenceFormula: '=FILTER(A2:B3, A2:A3="West", "No West sales")',
        hint: 'Pass "No West sales" as the 3rd argument.',
        explanation: 'Returns fallback when condition is never met.'
      },
      {
        title: 'Filter Active Status Only',
        scenario: 'Filter customer names in A2:A5 where Status in B2:B5 is "Active".',
        dataset: makePracticeDataset(['A', 'B'], ['Customer', 'Status'], [['Acme', 'Active'], ['Beta', 'Paused'], ['Apex', 'Active'], ['Zeta', 'Cancelled']]),
        targetResult: ['Acme', 'Apex'],
        targetResultDisplay: 'Acme, Apex',
        referenceFormula: '=FILTER(A2:A5, B2:B5="Active")',
        hint: 'Filter A2:A5 on B2:B5="Active".',
        explanation: 'Returns only active customer names.'
      },
      {
        title: 'Multi-Condition (AND) Filter',
        scenario: 'Filter rows where Category in A2:A5 is "Tech" AND Spend in B2:B5 > 1000.',
        dataset: makePracticeDataset(['A', 'B'], ['Category', 'Spend'], [['Tech', 1500], ['Tech', 800], ['Office', 2000], ['Tech', 3200]]),
        targetResult: [['Tech', 1500], ['Tech', 3200]],
        targetResultDisplay: '2 rows (1500, 3200)',
        referenceFormula: '=FILTER(A2:B5, (A2:A5="Tech")*(B2:B5>1000))',
        hint: 'Multiply conditions with *: =FILTER(A2:B5, (A2:A5="Tech")*(B2:B5>1000))',
        explanation: 'Multiplication acts as logical AND.'
      },
      {
        title: 'Low Stock Urgent Items',
        scenario: 'Filter SKU in A2:A5 where Stock in B2:B5 < 15.',
        dataset: makePracticeDataset(['A', 'B'], ['SKU', 'Stock'], [['SKU-1', 40], ['SKU-2', 8], ['SKU-3', 25], ['SKU-4', 5]]),
        targetResult: ['SKU-2', 'SKU-4'],
        targetResultDisplay: 'SKU-2, SKU-4',
        referenceFormula: '=FILTER(A2:A5, B2:B5<15)',
        hint: 'Condition is B2:B5 < 15.',
        explanation: 'Identifies inventory needing immediate replenishment.'
      },
      {
        title: 'Unpaid Overdue Invoices',
        scenario: 'Filter Invoices in A2:A5 where Status in B2:B5 is "Unpaid".',
        dataset: makePracticeDataset(['A', 'B'], ['Invoice', 'Status'], [['INV-01', 'Paid'], ['INV-02', 'Unpaid'], ['INV-03', 'Unpaid'], ['INV-04', 'Paid']]),
        targetResult: ['INV-02', 'INV-03'],
        targetResultDisplay: 'INV-02, INV-03',
        referenceFormula: '=FILTER(A2:A5, B2:B5="Unpaid")',
        hint: 'Filter A2:A5 on "Unpaid".',
        explanation: 'Returns unpaid invoice list.'
      },
      {
        title: 'Filter High-Scoring Students',
        scenario: 'Filter student names in A2:A5 with Score in B2:B5 >= 80.',
        dataset: makePracticeDataset(['A', 'B'], ['Student', 'Score'], [['Liam', 72], ['Emma', 88], ['Noah', 94], ['Zoe', 65]]),
        targetResult: ['Emma', 'Noah'],
        targetResultDisplay: 'Emma, Noah',
        referenceFormula: '=FILTER(A2:A5, B2:B5>=80)',
        hint: 'Filter on B2:B5 >= 80.',
        explanation: 'Returns top performers.'
      },
      {
        title: 'Filter Out Zero Sales',
        scenario: 'Filter products in A2:B5 where Units sold in B2:B5 > 0.',
        dataset: makePracticeDataset(['A', 'B'], ['Item', 'Units'], [['A', 10], ['B', 0], ['C', 25], ['D', 0]]),
        targetResult: [['A', 10], ['C', 25]],
        targetResultDisplay: 'A (10), C (25)',
        referenceFormula: '=FILTER(A2:B5, B2:B5>0)',
        hint: 'Condition is B2:B5 > 0.',
        explanation: 'Omits zero-unit items.'
      }
    ])
  },
  {
    id: 'unique',
    name: 'UNIQUE',
    category: 'dynamic-arrays',
    difficulty: 'advanced',
    chapter: 9,
    microsoft365Only: true,
    syntax: '=UNIQUE(array, [by_col], [exactly_once])',
    description: '★ Microsoft 365: Extracts distinct values from a range or array, automatically eliminating duplicate entries. Non-destructive and updates live when source records change.',
    parameters: [
      { name: 'array', required: true, description: 'Range or array to deduplicate.' },
      { name: 'by_col', required: false, description: 'FALSE = unique rows (default), TRUE = unique columns.' },
      { name: 'exactly_once', required: false, description: 'FALSE = distinct values, TRUE = only values appearing exactly once.' }
    ],
    referenceExamples: [
      { context: 'Extract unique region list for dropdown.', formula: '=UNIQUE(B2:B1000)', result: 'North, South, East, West', explanation: 'Creates live deduplicated list.' },
      { context: 'Find order IDs appearing exactly once.', formula: '=UNIQUE(A2:A1000, , TRUE)', result: 'Single-entry IDs', explanation: 'Data quality check.' },
      { context: 'Sorted unique product names.', formula: '=SORT(UNIQUE(C2:C1000))', result: 'Alphabetized unique list', explanation: 'Clean axis labels.' }
    ],
    realWorldScenarios: [
      'Dropdown Validation: Feed data-validation lists with self-maintaining category entries.',
      'Customer Retention: Deduplicate customer IDs to calculate true active monthly buyers.',
      'Summary Tables: Produce row headers for custom GROUPBY or SUMIFS summaries.'
    ],
    practiceExamples: createPracticeSet('UNIQUE', [
      {
        title: 'Deduplicate Region List',
        scenario: 'Extract unique regions from column A (A2:A6).',
        dataset: makePracticeDataset(['A'], ['Region'], [['North'], ['South'], ['North'], ['East'], ['South']]),
        targetResult: ['North', 'South', 'East'],
        targetResultDisplay: 'North, South, East',
        referenceFormula: '=UNIQUE(A2:A6)',
        hint: 'Use =UNIQUE(A2:A6)',
        explanation: 'Removes duplicate "North" and "South" entries.'
      },
      {
        title: 'Sorted Unique List',
        scenario: 'Extract and alphabetize unique product categories in A2:A6.',
        dataset: makePracticeDataset(['A'], ['Category'], [['Tech'], ['Books'], ['Tech'], ['Art'], ['Books']]),
        targetResult: ['Art', 'Books', 'Tech'],
        targetResultDisplay: 'Art, Books, Tech',
        referenceFormula: '=SORT(UNIQUE(A2:A6))',
        hint: 'Wrap UNIQUE in SORT: =SORT(UNIQUE(A2:A6))',
        explanation: 'Deduplicates then sorts A to Z.'
      },
      {
        title: 'Find Values Appearing Exactly Once',
        scenario: 'Find Order IDs in A2:A6 that appear exactly once (set 3rd argument to TRUE).',
        dataset: makePracticeDataset(['A'], ['OrderID'], [['ORD-1'], ['ORD-2'], ['ORD-1'], ['ORD-3'], ['ORD-2']]),
        targetResult: ['ORD-3'],
        targetResultDisplay: 'ORD-3',
        referenceFormula: '=UNIQUE(A2:A6, , TRUE)',
        hint: 'Use =UNIQUE(A2:A6, , TRUE)',
        explanation: 'ORD-1 and ORD-2 appear twice; only ORD-3 is unique.'
      },
      {
        title: 'Unique Department Roster',
        scenario: 'Extract distinct departments from B2:B6.',
        dataset: makePracticeDataset(['A', 'B'], ['Name', 'Dept'], [['Liam', 'Sales'], ['Emma', 'Engineering'], ['Noah', 'Sales'], ['Olivia', 'Marketing'], ['Lucas', 'Sales']]),
        targetResult: ['Sales', 'Engineering', 'Marketing'],
        targetResultDisplay: 'Sales, Engineering, Marketing',
        referenceFormula: '=UNIQUE(B2:B6)',
        hint: 'Call UNIQUE on B2:B6.',
        explanation: 'Returns 3 unique departments.'
      },
      {
        title: 'Unique Customer Accounts',
        scenario: 'Get distinct customer names from A2:A6.',
        dataset: makePracticeDataset(['A'], ['Client'], [['Acme Corp'], ['Global Ind'], ['Acme Corp'], ['Apex Ltd'], ['Apex Ltd']]),
        targetResult: ['Acme Corp', 'Global Ind', 'Apex Ltd'],
        targetResultDisplay: 'Acme Corp, Global Ind, Apex Ltd',
        referenceFormula: '=UNIQUE(A2:A6)',
        hint: 'Use =UNIQUE(A2:A6)',
        explanation: 'Returns 3 distinct clients.'
      },
      {
        title: 'Count Unique Products',
        scenario: 'Count how many distinct products exist in A2:A6 using COUNTA(UNIQUE(A2:A6)).',
        dataset: makePracticeDataset(['A'], ['Item'], [['Monitor'], ['Keyboard'], ['Monitor'], ['Mouse'], ['Keyboard']]),
        targetResult: 3,
        targetResultDisplay: '3',
        referenceFormula: '=COUNTA(UNIQUE(A2:A6))',
        hint: 'Wrap UNIQUE inside COUNTA.',
        explanation: 'Monitor, Keyboard, Mouse = 3 distinct items.'
      },
      {
        title: 'Unique Status Codes',
        scenario: 'List all unique transaction status codes from A2:A6.',
        dataset: makePracticeDataset(['A'], ['Status'], [['Pending'], ['Approved'], ['Approved'], ['Rejected'], ['Pending']]),
        targetResult: ['Pending', 'Approved', 'Rejected'],
        targetResultDisplay: 'Pending, Approved, Rejected',
        referenceFormula: '=UNIQUE(A2:A6)',
        hint: 'Use =UNIQUE(A2:A6)',
        explanation: 'Returns 3 unique statuses.'
      },
      {
        title: 'Unique Currency Pairs',
        scenario: 'Extract distinct FX pairs from A2:A6.',
        dataset: makePracticeDataset(['A'], ['Pair'], [['EUR/USD'], ['GBP/USD'], ['EUR/USD'], ['USD/JPY'], ['GBP/USD']]),
        targetResult: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
        targetResultDisplay: 'EUR/USD, GBP/USD, USD/JPY',
        referenceFormula: '=UNIQUE(A2:A6)',
        hint: 'Use =UNIQUE(A2:A6)',
        explanation: '3 currency pairs.'
      },
      {
        title: 'Unique Suppliers in Region',
        scenario: 'Extract distinct supplier names from A2:A6.',
        dataset: makePracticeDataset(['A'], ['Supplier'], [['Alpha'], ['Beta'], ['Beta'], ['Gamma'], ['Alpha']]),
        targetResult: ['Alpha', 'Beta', 'Gamma'],
        targetResultDisplay: 'Alpha, Beta, Gamma',
        referenceFormula: '=UNIQUE(A2:A6)',
        hint: 'Use =UNIQUE(A2:A6)',
        explanation: '3 distinct suppliers.'
      }
    ])
  }
];

export const summaryAiFunctions: ExcelFunction[] = [
  {
    id: 'groupby',
    name: 'GROUPBY',
    category: 'summary-grouping-ai',
    difficulty: 'advanced',
    chapter: 11,
    microsoft365Only: true,
    syntax: '=GROUPBY(row_fields, values, function, [field_headers], [total_depth], [sort_order], [filter_array])',
    description: '★ Microsoft 365 (2025): Creates a live grouped summary table directly inside a formula. Equivalent to a one-dimensional PivotTable by rows with automatic dynamic updating.',
    parameters: [
      { name: 'row_fields', required: true, description: 'Column to group by (row labels).' },
      { name: 'values', required: true, description: 'Column to aggregate.' },
      { name: 'function', required: true, description: 'Aggregation function: 1=SUM, 2=AVERAGE, 3=COUNT, 4=COUNTA, 5=MIN, 6=MAX.' }
    ],
    referenceExamples: [
      { context: 'Total sales by region: Region in Table1[Region], Sales in Table1[Sales].', formula: '=GROUPBY(Table1[Region], Table1[Sales], 1)', result: 'Grouped table', explanation: 'Instant 2-column pivot summary.' },
      { context: 'Average deal size sorted largest first.', formula: '=GROUPBY(Table1[Product], Table1[Sales], 2, 1, 0, -1)', result: 'Ranked averages', explanation: 'Calculates mean and sorts descending.' },
      { context: 'Filter before grouping for 2026 rows only.', formula: '=GROUPBY(Table1[Region], Table1[Sales], 1, 1, 0, 1, YEAR(Table1[Date])=2026)', result: 'Filtered summary', explanation: 'Built-in pre-filtering.' }
    ],
    realWorldScenarios: [
      'Executive Dashboards: Live revenue summary by business unit that needs zero refresh.',
      'Inventory Analysis: Group stock value by warehouse location.',
      'Marketing ROI: Group spend and attributed pipeline by acquisition channel.'
    ],
    practiceExamples: createPracticeSet('GROUPBY', [
      {
        title: 'Total Sales by Region (SUM)',
        scenario: 'Create a grouped summary of total sales in B2:B5 by Region in A2:A5 using function code 1 (SUM).',
        dataset: makePracticeDataset(['A', 'B'], ['Region', 'Sales'], [['North', 4000], ['South', 3000], ['North', 6000], ['South', 5000]]),
        targetResult: [['North', 10000], ['South', 8000]],
        targetResultDisplay: 'North: 10,000 | South: 8,000',
        referenceFormula: '=GROUPBY(A2:A5, B2:B5, 1)',
        hint: 'Use =GROUPBY(A2:A5, B2:B5, 1) where 1 means SUM.',
        explanation: 'Groups regions and sums sales (North=10,000, South=8,000).'
      },
      {
        title: 'Average Deal Size by Category',
        scenario: 'Group by Category in A2:A5 and compute average Sales in B2:B5 using code 2 (AVERAGE).',
        dataset: makePracticeDataset(['A', 'B'], ['Category', 'Sales'], [['Tech', 8000], ['Office', 2000], ['Tech', 12000], ['Office', 4000]]),
        targetResult: [['Tech', 10000], ['Office', 3000]],
        targetResultDisplay: 'Tech: 10,000 | Office: 3,000',
        referenceFormula: '=GROUPBY(A2:A5, B2:B5, 2)',
        hint: 'Use 2 for AVERAGE: =GROUPBY(A2:A5, B2:B5, 2)',
        explanation: 'Tech average = 10,000; Office average = 3,000.'
      },
      {
        title: 'Order Count by Region',
        scenario: 'Group by Region in A2:A5 and count orders using function code 3 (COUNT).',
        dataset: makePracticeDataset(['A', 'B'], ['Region', 'OrderID'], [['East', 101], ['West', 102], ['East', 103], ['East', 104]]),
        targetResult: [['East', 3], ['West', 1]],
        targetResultDisplay: 'East: 3 | West: 1',
        referenceFormula: '=GROUPBY(A2:A5, B2:B5, 3)',
        hint: 'Use 3 for COUNT.',
        explanation: 'East has 3 orders, West has 1.'
      },
      {
        title: 'Max Sale by Rep',
        scenario: 'Group by Rep in A2:A5 and find peak deal using code 6 (MAX).',
        dataset: makePracticeDataset(['A', 'B'], ['Rep', 'Deal'], [['Mia', 5000], ['Sam', 3000], ['Mia', 9000], ['Sam', 4500]]),
        targetResult: [['Mia', 9000], ['Sam', 4500]],
        targetResultDisplay: 'Mia: 9,000 | Sam: 4,500',
        referenceFormula: '=GROUPBY(A2:A5, B2:B5, 6)',
        hint: 'Use 6 for MAX.',
        explanation: 'Mia max=9000, Sam max=4500.'
      },
      {
        title: 'Total Spend by Department',
        scenario: 'Sum expenses in B2:B5 grouped by Department in A2:A5.',
        dataset: makePracticeDataset(['A', 'B'], ['Dept', 'Expense'], [['IT', 1200], ['HR', 400], ['IT', 1800], ['HR', 600]]),
        targetResult: [['IT', 3000], ['HR', 1000]],
        targetResultDisplay: 'IT: 3,000 | HR: 1,000',
        referenceFormula: '=GROUPBY(A2:A5, B2:B5, 1)',
        hint: 'Use =GROUPBY(A2:A5, B2:B5, 1)',
        explanation: 'IT=3000, HR=1000.'
      },
      {
        title: 'Inventory Units by Warehouse',
        scenario: 'Sum inventory units in B2:B5 grouped by Warehouse in A2:A5.',
        dataset: makePracticeDataset(['A', 'B'], ['Warehouse', 'Units'], [['WH-1', 500], ['WH-2', 300], ['WH-1', 450], ['WH-2', 200]]),
        targetResult: [['WH-1', 950], ['WH-2', 500]],
        targetResultDisplay: 'WH-1: 950 | WH-2: 500',
        referenceFormula: '=GROUPBY(A2:A5, B2:B5, 1)',
        hint: 'Use =GROUPBY(A2:A5, B2:B5, 1)',
        explanation: 'WH-1=950, WH-2=500.'
      },
      {
        title: 'Total Ad Spend by Channel',
        scenario: 'Sum spend in B2:B5 grouped by marketing channel in A2:A5.',
        dataset: makePracticeDataset(['A', 'B'], ['Channel', 'Spend'], [['Social', 2500], ['Search', 4000], ['Social', 3500], ['Search', 2000]]),
        targetResult: [['Social', 6000], ['Search', 6000]],
        targetResultDisplay: 'Social: 6,000 | Search: 6,000',
        referenceFormula: '=GROUPBY(A2:A5, B2:B5, 1)',
        hint: 'Use =GROUPBY(A2:A5, B2:B5, 1)',
        explanation: 'Both channels totaled 6,000.'
      },
      {
        title: 'Minimum Defect by Machine',
        scenario: 'Find minimum defect count using code 5 (MIN) for machine in A2:A5.',
        dataset: makePracticeDataset(['A', 'B'], ['Machine', 'Defects'], [['M-A', 4], ['M-B', 1], ['M-A', 2], ['M-B', 3]]),
        targetResult: [['M-A', 2], ['M-B', 1]],
        targetResultDisplay: 'M-A: 2 | M-B: 1',
        referenceFormula: '=GROUPBY(A2:A5, B2:B5, 5)',
        hint: 'Use 5 for MIN.',
        explanation: 'M-A min=2, M-B min=1.'
      },
      {
        title: 'Revenue by Product Family',
        scenario: 'Group sales in B2:B5 by Product in A2:A5.',
        dataset: makePracticeDataset(['A', 'B'], ['Product', 'Revenue'], [['Laptop', 4500], ['Tablet', 1200], ['Laptop', 3500], ['Tablet', 800]]),
        targetResult: [['Laptop', 8000], ['Tablet', 2000]],
        targetResultDisplay: 'Laptop: 8,000 | Tablet: 2,000',
        referenceFormula: '=GROUPBY(A2:A5, B2:B5, 1)',
        hint: 'Use =GROUPBY(A2:A5, B2:B5, 1)',
        explanation: 'Laptop=8,000, Tablet=2,000.'
      }
    ])
  }
];
