import { ExcelFunction } from '../../types/formula';
import { makePracticeDataset, createPracticeSet } from '../practiceFactory';

export const textFunctions: ExcelFunction[] = [
  {
    id: 'clean',
    name: 'CLEAN',
    category: 'text',
    difficulty: 'beginner',
    chapter: 5,
    microsoft365Only: false,
    syntax: '=CLEAN(text)',
    description: 'Removes all non-printable ASCII characters (codes 0 to 31) such as line breaks, tabs, and hidden control codes imported from legacy systems or web scrapes.',
    parameters: [{ name: 'text', required: true, description: 'Text string or cell containing non-printable characters.' }],
    referenceExamples: [
      { context: 'Customer notes with hidden line-breaks (ASCII 10).', formula: '=CLEAN(A2)', result: 'Printable text', explanation: 'Strips control characters that break VLOOKUP.' },
      { context: 'Two-step cleanup pipeline.', formula: '=TRIM(CLEAN(A2))', result: 'Clean & trimmed', explanation: 'Strips control characters then collapses spaces.' }
    ],
    realWorldScenarios: [
      'CRM Import: Clean customer notes pasted from web forms with invisible breaks.',
      'PDF Conversion: Remove stray control formatting codes between words.',
      'ERP Exports: Sanitize tab-separated database dumps.'
    ],
    practiceExamples: createPracticeSet('CLEAN', [
      {
        title: 'Strip Control Characters',
        scenario: 'Clean the imported customer name in cell A2 to remove hidden control codes.',
        dataset: makePracticeDataset(['A'], ['RawImport'], [["John\tDoe"], ["Acme\x0cInc"]]),
        targetResult: 'JohnDoe',
        targetResultDisplay: '"JohnDoe"',
        referenceFormula: '=CLEAN(A2)',
        hint: 'Use =CLEAN(A2)',
        explanation: 'CLEAN strips the hidden tab character.'
      },
      {
        title: 'Remove Line Breaks',
        scenario: 'Remove line feed character in A2 from multi-line address text.',
        dataset: makePracticeDataset(['A'], ['Address'], [["12 Main St\nLagos"]]),
        targetResult: '12 Main StLagos',
        targetResultDisplay: '"12 Main StLagos"',
        referenceFormula: '=CLEAN(A2)',
        hint: 'Use =CLEAN(A2)',
        explanation: 'Strips ASCII 10 line break.'
      },
      {
        title: 'Combine CLEAN and TRIM',
        scenario: 'Remove hidden characters and trim excess spaces from A2: "  Data Edge\t  ".',
        dataset: makePracticeDataset(['A'], ['RawText'], [["  Data Edge\t  "]]),
        targetResult: 'Data Edge',
        targetResultDisplay: '"Data Edge"',
        referenceFormula: '=TRIM(CLEAN(A2))',
        hint: 'Wrap CLEAN inside TRIM: =TRIM(CLEAN(A2))',
        explanation: 'CLEAN removes the tab, and TRIM removes the surrounding spaces.'
      },
      {
        title: 'Sanitize Supplier Name',
        scenario: 'Clean supplier name in A2 with hidden control codes.',
        dataset: makePracticeDataset(['A'], ['Supplier'], [["Apex\x01Logistics"]]),
        targetResult: 'ApexLogistics',
        targetResultDisplay: '"ApexLogistics"',
        referenceFormula: '=CLEAN(A2)',
        hint: 'Use =CLEAN(A2)',
        explanation: 'Removes ASCII 1 start of heading.'
      },
      {
        title: 'Prepare SKU for Lookup',
        scenario: 'Clean product SKU in A2 before running an XLOOKUP.',
        dataset: makePracticeDataset(['A'], ['SKU'], [["SKU-\t900"]]),
        targetResult: 'SKU-900',
        targetResultDisplay: '"SKU-900"',
        referenceFormula: '=CLEAN(A2)',
        hint: 'Use =CLEAN(A2)',
        explanation: 'Ensures lookup key matches clean reference table.'
      },
      {
        title: 'Sanitize Scraped Web Price',
        scenario: 'Clean price tag text in A2 containing non-printable character.',
        dataset: makePracticeDataset(['A'], ['PriceText'], [["$150\x07"]]),
        targetResult: '$150',
        targetResultDisplay: '"$150"',
        referenceFormula: '=CLEAN(A2)',
        hint: 'Use =CLEAN(A2)',
        explanation: 'Strips bell control char.'
      },
      {
        title: 'Clean Survey Response',
        scenario: 'Clean free-text feedback in A2.',
        dataset: makePracticeDataset(['A'], ['Feedback'], [["Great service!\x0bFast delivery."]]),
        targetResult: 'Great service!Fast delivery.',
        targetResultDisplay: '"Great service!Fast delivery."',
        referenceFormula: '=CLEAN(A2)',
        hint: 'Use =CLEAN(A2)',
        explanation: 'Strips vertical tab.'
      },
      {
        title: 'Full Clean and Title Case',
        scenario: 'Clean and format name in A2 into proper title case (=PROPER(TRIM(CLEAN(A2)))).',
        dataset: makePracticeDataset(['A'], ['RawName'], [["  mary\tjane  "]]),
        targetResult: 'Mary Jane',
        targetResultDisplay: '"Mary Jane"',
        referenceFormula: '=PROPER(TRIM(CLEAN(A2)))',
        hint: 'Chain PROPER(TRIM(CLEAN(A2))).',
        explanation: 'Cleans, trims, and capitalizes to "Mary Jane".'
      },
      {
        title: 'Database Export Cleanup',
        scenario: 'Clean account identifier in A2.',
        dataset: makePracticeDataset(['A'], ['Account'], [["ACC\x1f440"]]),
        targetResult: 'ACC440',
        targetResultDisplay: '"ACC440"',
        referenceFormula: '=CLEAN(A2)',
        hint: 'Use =CLEAN(A2)',
        explanation: 'Removes unit separator ASCII 31.'
      }
    ])
  },
  {
    id: 'trim',
    name: 'TRIM',
    category: 'text',
    difficulty: 'beginner',
    chapter: 5,
    microsoft365Only: false,
    syntax: '=TRIM(text)',
    description: 'Removes leading, trailing, and repeated spaces from text, leaving only single spaces between words. Resolves 80% of mysterious VLOOKUP/#N/A errors.',
    parameters: [{ name: 'text', required: true, description: 'Text from which to remove spaces.' }],
    referenceExamples: [
      { context: 'Name with rogue spaces: " John Doe ".', formula: '=TRIM(A2)', result: 'John Doe', explanation: 'Fixes invisible spaces so lookups succeed.' },
      { context: 'Double spaces between words: "Sales  Manager".', formula: '=TRIM(A2)', result: 'Sales Manager', explanation: 'Collapses internal multi-spaces to single space.' },
      { context: 'Data validation check: does cell need trimming?', formula: '=TRIM(A2)=A2', result: 'TRUE or FALSE', explanation: 'Returns FALSE if extra spaces existed.' }
    ],
    realWorldScenarios: [
      'Email List Building: Remove trailing spaces that cause bouncebacks.',
      'Address Validation: Standardize street addresses for mailing labels.',
      'Product Master: Prevent duplicate SKUs caused by accidental trailing spaces.'
    ],
    practiceExamples: createPracticeSet('TRIM', [
      {
        title: 'Strip Outer Spaces',
        scenario: 'Trim the leading and trailing spaces from customer name in A2 (" John Doe ").',
        dataset: makePracticeDataset(['A'], ['RawName'], [[" John Doe "], ["  Acme Corp "]]),
        targetResult: 'John Doe',
        targetResultDisplay: '"John Doe"',
        referenceFormula: '=TRIM(A2)',
        hint: 'Use =TRIM(A2)',
        explanation: 'Removes spaces from beginning and end.'
      },
      {
        title: 'Collapse Double Spaces',
        scenario: 'Fix job title in A2 ("Sales  Manager") having duplicate internal spaces.',
        dataset: makePracticeDataset(['A'], ['JobTitle'], [["Sales  Manager"], ["Data   Analyst"]]),
        targetResult: 'Sales Manager',
        targetResultDisplay: '"Sales Manager"',
        referenceFormula: '=TRIM(A2)',
        hint: 'Use =TRIM(A2)',
        explanation: 'Collapses double space to single space.'
      },
      {
        title: 'Check If Cell Needs Trimming',
        scenario: 'Check if A2 is already clean using logical comparison =TRIM(A2)=A2.',
        dataset: makePracticeDataset(['A'], ['Input'], [["CleanText"], [" MessyText "]]),
        targetResult: true,
        targetResultDisplay: 'TRUE',
        referenceFormula: '=TRIM(A2)=A2',
        hint: 'Compare TRIM(A2)=A2',
        explanation: 'Returns TRUE because "CleanText" had no extra spaces.'
      },
      {
        title: 'Trim Before Email Generation',
        scenario: 'Trim first name in A2 (" Jane ") and lower-case it.',
        dataset: makePracticeDataset(['A'], ['FirstName'], [[" Jane "]]),
        targetResult: 'jane',
        targetResultDisplay: '"jane"',
        referenceFormula: '=LOWER(TRIM(A2))',
        hint: 'Combine LOWER and TRIM: =LOWER(TRIM(A2))',
        explanation: 'Returns clean lowercase "jane".'
      },
      {
        title: 'Clean Mailing Street Address',
        scenario: 'Trim redundant spaces in address A2 (" 12   Main   Street ").',
        dataset: makePracticeDataset(['A'], ['Street'], [[" 12   Main   Street "]]),
        targetResult: '12 Main Street',
        targetResultDisplay: '"12 Main Street"',
        referenceFormula: '=TRIM(A2)',
        hint: 'Use =TRIM(A2)',
        explanation: 'Reduces to standard single spaces.'
      },
      {
        title: 'Sanitize Product Category',
        scenario: 'Trim category name in A2 (" Furniture  ").',
        dataset: makePracticeDataset(['A'], ['Category'], [[" Furniture  "]]),
        targetResult: 'Furniture',
        targetResultDisplay: '"Furniture"',
        referenceFormula: '=TRIM(A2)',
        hint: 'Use =TRIM(A2)',
        explanation: 'Leaves clean string "Furniture".'
      },
      {
        title: 'Clean Currency Code',
        scenario: 'Trim currency ISO code in A2 (" USD ").',
        dataset: makePracticeDataset(['A'], ['Currency'], [[" USD "]]),
        targetResult: 'USD',
        targetResultDisplay: '"USD"',
        referenceFormula: '=TRIM(A2)',
        hint: 'Use =TRIM(A2)',
        explanation: 'Returns "USD".'
      },
      {
        title: 'Match Against Reference Table',
        scenario: 'Check if trimmed value of A2 (" SKU-100 ") matches clean code "SKU-100".',
        dataset: makePracticeDataset(['A'], ['EnteredSKU'], [[" SKU-100 "]]),
        targetResult: true,
        targetResultDisplay: 'TRUE',
        referenceFormula: '=TRIM(A2)="SKU-100"',
        hint: 'Compare TRIM(A2)="SKU-100"',
        explanation: 'Trimmed string matches target.'
      },
      {
        title: 'Sanitize Phone Number Text',
        scenario: 'Trim space padding around phone number in A2.',
        dataset: makePracticeDataset(['A'], ['Phone'], [["  +1-555-0199  "]]),
        targetResult: '+1-555-0199',
        targetResultDisplay: '"+1-555-0199"',
        referenceFormula: '=TRIM(A2)',
        hint: 'Use =TRIM(A2)',
        explanation: 'Removes outer space padding.'
      }
    ])
  },
  {
    id: 'textafter',
    name: 'TEXTAFTER',
    category: 'text',
    difficulty: 'advanced',
    chapter: 5,
    microsoft365Only: true,
    syntax: '=TEXTAFTER(text, delimiter, [instance_num], [match_mode], [match_end], [if_not_found])',
    description: '★ Microsoft 365: Returns everything after a specified delimiter. The modern replacement for MID+FIND, supporting negative instance numbers to search from the end.',
    parameters: [
      { name: 'text', required: true, description: 'Text string to search in.' },
      { name: 'delimiter', required: true, description: 'Text marker after which to extract.' },
      { name: 'instance_num', required: false, description: 'Which occurrence (-1 for last occurrence).' }
    ],
    referenceExamples: [
      { context: 'Extract email domain from jane.smith@company.com.', formula: '=TEXTAFTER(A2, "@")', result: 'company.com', explanation: 'Extracts all text after the @ sign.' },
      { context: 'Extract file extension after last dot.', formula: '=TEXTAFTER(B2, ".", -1)', result: 'xlsx', explanation: 'Negative instance searches from end.' },
      { context: 'Safe extraction with fallback.', formula: '=TEXTAFTER(A2, "@", 1, 0, 0, "No domain")', result: 'No domain', explanation: 'Handles missing delimiter gracefully.' }
    ],
    realWorldScenarios: [
      'Email Analysis: Extract domain names to rank customer companies.',
      'File Management: Extract extension after last dot to route files.',
      'URL Query Strings: Extract parameters after "?" in tracking URLs.'
    ],
    practiceExamples: createPracticeSet('TEXTAFTER', [
      {
        title: 'Extract Email Domain',
        scenario: 'Extract the domain name from the email address in cell A2 ("jane.smith@company.com").',
        dataset: makePracticeDataset(['A'], ['Email'], [['jane.smith@company.com'], ['alex@startup.io']]),
        targetResult: 'company.com',
        targetResultDisplay: '"company.com"',
        referenceFormula: '=TEXTAFTER(A2, "@")',
        hint: 'Use =TEXTAFTER(A2, "@")',
        explanation: 'Returns everything following the "@" symbol.'
      },
      {
        title: 'Extract File Extension',
        scenario: 'Extract the extension after the last dot in filename A2 ("Report.v2.xlsx").',
        dataset: makePracticeDataset(['A'], ['Filename'], [['Report.v2.xlsx'], ['Summary.pdf']]),
        targetResult: 'xlsx',
        targetResultDisplay: '"xlsx"',
        referenceFormula: '=TEXTAFTER(A2, ".", -1)',
        hint: 'Use -1 for instance_num to find the last dot: =TEXTAFTER(A2, ".", -1)',
        explanation: 'Searches from the right and returns "xlsx".'
      },
      {
        title: 'Extract Last Name After Space',
        scenario: 'Extract the last name after the space from A2 ("Ada Lovelace").',
        dataset: makePracticeDataset(['A'], ['FullName'], [['Ada Lovelace'], ['Alan Turing']]),
        targetResult: 'Lovelace',
        targetResultDisplay: '"Lovelace"',
        referenceFormula: '=TEXTAFTER(A2, " ")',
        hint: 'Use " " as delimiter: =TEXTAFTER(A2, " ")',
        explanation: 'Extracts everything after the first space.'
      },
      {
        title: 'Extract URL Path After Domain',
        scenario: 'Extract the path after "https://store.com/" in A2 ("https://store.com/products/44").',
        dataset: makePracticeDataset(['A'], ['URL'], [['https://store.com/products/44']]),
        targetResult: 'products/44',
        targetResultDisplay: '"products/44"',
        referenceFormula: '=TEXTAFTER(A2, "https://store.com/")',
        hint: 'Use the domain URL as the delimiter.',
        explanation: 'Returns "products/44".'
      },
      {
        title: 'Extract Invoice Number After Prefix',
        scenario: 'Extract the numeric ID following the prefix "INV-" in A2 ("INV-2026-99").',
        dataset: makePracticeDataset(['A'], ['Invoice'], [['INV-2026-99']]),
        targetResult: '2026-99',
        targetResultDisplay: '"2026-99"',
        referenceFormula: '=TEXTAFTER(A2, "INV-")',
        hint: 'Use "INV-" as delimiter.',
        explanation: 'Returns "2026-99".'
      },
      {
        title: 'Extract Second Parameter After Semicolon',
        scenario: 'Extract value after second comma in A2 ("Red,Green,Blue") using instance 2.',
        dataset: makePracticeDataset(['A'], ['Colors'], [['Red,Green,Blue']]),
        targetResult: 'Blue',
        targetResultDisplay: '"Blue"',
        referenceFormula: '=TEXTAFTER(A2, ",", 2)',
        hint: 'Pass 2 as the third argument: =TEXTAFTER(A2, ",", 2)',
        explanation: 'Returns "Blue".'
      },
      {
        title: 'Safe Extraction with Fallback',
        scenario: 'Extract after "@" in A2 ("Plain Name"), returning "None" if delimiter is missing.',
        dataset: makePracticeDataset(['A'], ['Contact'], [['Plain Name']]),
        targetResult: 'None',
        targetResultDisplay: '"None"',
        referenceFormula: '=TEXTAFTER(A2, "@", 1, 0, 0, "None")',
        hint: 'Use 6th parameter for if_not_found: =TEXTAFTER(A2, "@", 1, 0, 0, "None")',
        explanation: 'Returns "None" instead of #N/A.'
      },
      {
        title: 'Extract Currency Amount After Symbol',
        scenario: 'Extract the numeric string after "$" in A2 ("Total: $1,450.00").',
        dataset: makePracticeDataset(['A'], ['Summary'], [['Total: $1,450.00']]),
        targetResult: '1,450.00',
        targetResultDisplay: '"1,450.00"',
        referenceFormula: '=TEXTAFTER(A2, "$")',
        hint: 'Use "$" as delimiter.',
        explanation: 'Returns "1,450.00".'
      },
      {
        title: 'Extract City After Comma and Space',
        scenario: 'Extract city from address string in A2 ("10 Downing St, London").',
        dataset: makePracticeDataset(['A'], ['Address'], [['10 Downing St, London']]),
        targetResult: 'London',
        targetResultDisplay: '"London"',
        referenceFormula: '=TEXTAFTER(A2, ", ")',
        hint: 'Use ", " as delimiter.',
        explanation: 'Returns "London".'
      }
    ])
  },
  {
    id: 'textbefore',
    name: 'TEXTBEFORE',
    category: 'text',
    difficulty: 'advanced',
    chapter: 5,
    microsoft365Only: true,
    syntax: '=TEXTBEFORE(text, delimiter, [instance_num], [match_mode], [match_end], [if_not_found])',
    description: '★ Microsoft 365: Returns everything before a specified delimiter. The elegant counterpart to TEXTAFTER for parsing usernames, prefixes, and directory paths.',
    parameters: [
      { name: 'text', required: true, description: 'Text string to search in.' },
      { name: 'delimiter', required: true, description: 'Delimiter marker.' },
      { name: 'instance_num', required: false, description: 'Which occurrence.' }
    ],
    referenceExamples: [
      { context: 'Extract username before @ from jane.smith@company.com.', formula: '=TEXTBEFORE(A2, "@")', result: 'jane.smith', explanation: 'Extracts username directly.' },
      { context: 'Get filename without extension from Q1_Report.xlsx.', formula: '=TEXTBEFORE(B2, ".", -1)', result: 'Q1_Report', explanation: 'Pulls name before final dot.' },
      { context: 'Extract product family before size suffix.', formula: '=TEXTBEFORE(A2, " - ")', result: 'Ergonomic Chair', explanation: 'Groups by base product.' }
    ],
    realWorldScenarios: [
      'Account Provisioning: Extract usernames from employee emails in one pass.',
      'Directory Parsing: Extract parent folder path from full file paths.',
      'Product Catalogs: Strip color and size variant suffixes.'
    ],
    practiceExamples: createPracticeSet('TEXTBEFORE', [
      {
        title: 'Extract Username Before @',
        scenario: 'Extract the username before "@" from email in A2 ("jane.smith@company.com").',
        dataset: makePracticeDataset(['A'], ['Email'], [['jane.smith@company.com']]),
        targetResult: 'jane.smith',
        targetResultDisplay: '"jane.smith"',
        referenceFormula: '=TEXTBEFORE(A2, "@")',
        hint: 'Use =TEXTBEFORE(A2, "@")',
        explanation: 'Returns "jane.smith".'
      },
      {
        title: 'Extract Filename Without Extension',
        scenario: 'Extract the base filename before the last dot in A2 ("Q1_Report.Final.xlsx").',
        dataset: makePracticeDataset(['A'], ['File'], [['Q1_Report.Final.xlsx']]),
        targetResult: 'Q1_Report.Final',
        targetResultDisplay: '"Q1_Report.Final"',
        referenceFormula: '=TEXTBEFORE(A2, ".", -1)',
        hint: 'Use -1 for last occurrence: =TEXTBEFORE(A2, ".", -1)',
        explanation: 'Pulls everything before the final dot.'
      },
      {
        title: 'Extract First Name',
        scenario: 'Extract the first name before the space in A2 ("Grace Hopper").',
        dataset: makePracticeDataset(['A'], ['FullName'], [['Grace Hopper']]),
        targetResult: 'Grace',
        targetResultDisplay: '"Grace"',
        referenceFormula: '=TEXTBEFORE(A2, " ")',
        hint: 'Use " " as delimiter.',
        explanation: 'Returns "Grace".'
      },
      {
        title: 'Extract Product Family',
        scenario: 'Extract the base product before " - " in A2 ("Ergonomic Chair - Large - Blue").',
        dataset: makePracticeDataset(['A'], ['Item'], [['Ergonomic Chair - Large - Blue']]),
        targetResult: 'Ergonomic Chair',
        targetResultDisplay: '"Ergonomic Chair"',
        referenceFormula: '=TEXTBEFORE(A2, " - ")',
        hint: 'Use " - " as delimiter.',
        explanation: 'Returns "Ergonomic Chair".'
      },
      {
        title: 'Extract Department Prefix',
        scenario: 'Extract department code before "-" in employee ID A2 ("FIN-00921").',
        dataset: makePracticeDataset(['A'], ['EmpID'], [['FIN-00921']]),
        targetResult: 'FIN',
        targetResultDisplay: '"FIN"',
        referenceFormula: '=TEXTBEFORE(A2, "-")',
        hint: 'Use "-" as delimiter.',
        explanation: 'Returns "FIN".'
      },
      {
        title: 'Extract Host Protocol',
        scenario: 'Extract protocol before "://" from URL in A2 ("https://example.com").',
        dataset: makePracticeDataset(['A'], ['URL'], [['https://example.com']]),
        targetResult: 'https',
        targetResultDisplay: '"https"',
        referenceFormula: '=TEXTBEFORE(A2, "://")',
        hint: 'Use "://" as delimiter.',
        explanation: 'Returns "https".'
      },
      {
        title: 'Extract Area Code',
        scenario: 'Extract area code before first hyphen in A2 ("080-234-5678").',
        dataset: makePracticeDataset(['A'], ['Phone'], [['080-234-5678']]),
        targetResult: '080',
        targetResultDisplay: '"080"',
        referenceFormula: '=TEXTBEFORE(A2, "-")',
        hint: 'Use =TEXTBEFORE(A2, "-")',
        explanation: 'Returns "080".'
      },
      {
        title: 'Extract Date Prefix from File',
        scenario: 'Extract date prefix before "_" in A2 ("2026-04-15_Financials.pdf").',
        dataset: makePracticeDataset(['A'], ['DocName'], [['2026-04-15_Financials.pdf']]),
        targetResult: '2026-04-15',
        targetResultDisplay: '"2026-04-15"',
        referenceFormula: '=TEXTBEFORE(A2, "_")',
        hint: 'Use "_" as delimiter.',
        explanation: 'Returns "2026-04-15".'
      },
      {
        title: 'Safe Extraction with Fallback',
        scenario: 'Extract text before "#" in A2 ("RegularText"), returning A2 if "#" not found.',
        dataset: makePracticeDataset(['A'], ['Tag'], [['RegularText']]),
        targetResult: 'RegularText',
        targetResultDisplay: '"RegularText"',
        referenceFormula: '=TEXTBEFORE(A2, "#", 1, 0, 0, A2)',
        hint: 'Supply A2 as the 6th argument (if_not_found).',
        explanation: 'Returns original text when delimiter is absent.'
      }
    ])
  }
];
