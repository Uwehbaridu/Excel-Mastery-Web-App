import { ExcelFunction } from '../../types/formula';
import { makePracticeDataset, createPracticeSet } from '../practiceFactory';

export const logicalFunctions: ExcelFunction[] = [
  {
    id: 'and',
    name: 'AND',
    category: 'logical',
    difficulty: 'beginner',
    chapter: 4,
    microsoft365Only: false,
    syntax: '=AND(logical1, [logical2], ...)',
    description: 'Checks whether all conditions in a list are TRUE. Returns TRUE only if every single argument evaluates to TRUE; otherwise returns FALSE.',
    parameters: [
      { name: 'logical1', required: true, description: 'First condition to test.' },
      { name: 'logical2', required: false, description: 'Up to 255 conditions to test.' }
    ],
    referenceExamples: [
      { context: 'Sales > 5000 AND Region = "North".', formula: '=AND(B2>5000, C2="North")', result: 'TRUE or FALSE', explanation: 'Evaluates if both conditions are met.' },
      { context: 'Nested inside IF for bonus.', formula: '=IF(AND(B2>5000, C2="North"), "High Performer", "Standard")', result: 'Classification', explanation: 'Classifies sales reps.' },
      { context: 'Data validation range check.', formula: '=AND(A2>=0, A2<=100)', result: 'TRUE or FALSE', explanation: 'Ensures score is bounded 0 to 100.' }
    ],
    realWorldScenarios: [
      'Sales Commission: Pay bonus only if target met AND customer is Enterprise AND deal closed in Q1.',
      'HR Onboarding: Employee fully onboarded only when training done AND background check passed.',
      'Credit Approval: Loan approved only if credit score > 700 AND income > $60,000.'
    ],
    practiceExamples: createPracticeSet('AND', [
      {
        title: 'Two-Condition Bonus Check',
        scenario: 'Check if Sales in A2 exceeds 5000 AND Region in B2 is "North".',
        dataset: makePracticeDataset(['A', 'B'], ['Sales', 'Region'], [[6200, 'North'], [4500, 'North'], [7100, 'South']]),
        targetResult: true,
        targetResultDisplay: 'TRUE',
        referenceFormula: '=AND(A2>5000, B2="North")',
        hint: 'Use =AND(A2>5000, B2="North")',
        explanation: 'Both 6200 > 5000 and "North" = "North" are true, returning TRUE.'
      },
      {
        title: 'Sales and Returns Criteria',
        scenario: 'Verify whether Sales A2 > 5000 AND Returns B2 < 100.',
        dataset: makePracticeDataset(['A', 'B'], ['Sales', 'Returns'], [[6000, 45], [4800, 20]]),
        targetResult: true,
        targetResultDisplay: 'TRUE',
        referenceFormula: '=AND(A2>5000, B2<100)',
        hint: 'Check both conditions inside =AND(...)',
        explanation: 'Both conditions pass.'
      },
      {
        title: 'Score Range Boundary',
        scenario: 'Check if exam score in A2 is between 0 and 100 (inclusive).',
        dataset: makePracticeDataset(['A'], ['Score'], [[88], [105]]),
        targetResult: true,
        targetResultDisplay: 'TRUE',
        referenceFormula: '=AND(A2>=0, A2<=100)',
        hint: 'Use =AND(A2>=0, A2<=100)',
        explanation: '88 is >= 0 and <= 100.'
      },
      {
        title: 'Bonus Classification with IF',
        scenario: 'If Sales in A2 > 5000 AND Region in B2 is "North", return "High Performer", else "Standard".',
        dataset: makePracticeDataset(['A', 'B'], ['Sales', 'Region'], [[7000, 'North'], [3000, 'North']]),
        targetResult: 'High Performer',
        targetResultDisplay: '"High Performer"',
        referenceFormula: '=IF(AND(A2>5000, B2="North"), "High Performer", "Standard")',
        hint: 'Nest the AND function as the first argument of IF.',
        explanation: 'Qualifies for High Performer label.'
      },
      {
        title: 'Loan Approval Triple Check',
        scenario: 'Approve credit: Score A2 > 700 AND Income B2 > 60000 AND DTI C2 < 0.35.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['CreditScore', 'Income', 'DTI'], [[740, 75000, 0.28]]),
        targetResult: true,
        targetResultDisplay: 'TRUE',
        referenceFormula: '=AND(A2>700, B2>60000, C2<0.35)',
        hint: 'Pass all three conditions into AND.',
        explanation: 'All three underwriting criteria are satisfied.'
      },
      {
        title: 'Inventory Reorder Condition',
        scenario: 'Check if Stock in A2 < 20 AND OnOrder in B2 is 0.',
        dataset: makePracticeDataset(['A', 'B'], ['Stock', 'OnOrder'], [[14, 0], [25, 50]]),
        targetResult: true,
        targetResultDisplay: 'TRUE',
        referenceFormula: '=AND(A2<20, B2=0)',
        hint: 'Use =AND(A2<20, B2=0)',
        explanation: 'Stock is low and no purchase orders are active.'
      },
      {
        title: 'Project Milestone Completion',
        scenario: 'Check if Phase1 (A2) is "Done" AND Phase2 (B2) is "Done" AND BudgetRemaining (C2) > 0.',
        dataset: makePracticeDataset(['A', 'B', 'C'], ['Phase1', 'Phase2', 'BudgetLeft'], [['Done', 'Done', 5000]]),
        targetResult: true,
        targetResultDisplay: 'TRUE',
        referenceFormula: '=AND(A2="Done", B2="Done", C2>0)',
        hint: 'Test A2="Done", B2="Done", C2>0 inside AND.',
        explanation: 'All milestones completed under budget.'
      },
      {
        title: 'Employee Onboarding Gate',
        scenario: 'Check if Training in A2 is "Complete" AND Equipment in B2 is "Issued".',
        dataset: makePracticeDataset(['A', 'B'], ['Training', 'Equipment'], [['Complete', 'Issued']]),
        targetResult: true,
        targetResultDisplay: 'TRUE',
        referenceFormula: '=AND(A2="Complete", B2="Issued")',
        hint: 'Use =AND(A2="Complete", B2="Issued")',
        explanation: 'Both onboarding milestones verified.'
      },
      {
        title: 'Strict Quality Tolerance Gate',
        scenario: 'Part passes if Length A2 >= 49.5 AND Length A2 <= 50.5 AND Defects B2 == 0.',
        dataset: makePracticeDataset(['A', 'B'], ['LengthMm', 'Defects'], [[50.1, 0]]),
        targetResult: true,
        targetResultDisplay: 'TRUE',
        referenceFormula: '=AND(A2>=49.5, A2<=50.5, B2=0)',
        hint: 'Use =AND(A2>=49.5, A2<=50.5, B2=0)',
        explanation: 'Within tolerance band with zero defects.'
      }
    ])
  },
  {
    id: 'if',
    name: 'IF',
    category: 'logical',
    difficulty: 'beginner',
    chapter: 4,
    microsoft365Only: false,
    syntax: '=IF(logical_test, value_if_true, [value_if_false])',
    description: 'The foundation of decision-making in Excel. Evaluates a condition and returns one value if TRUE and another if FALSE.',
    parameters: [
      { name: 'logical_test', required: true, description: 'Expression resolving to TRUE or FALSE.' },
      { name: 'value_if_true', required: true, description: 'Result when condition is TRUE.' },
      { name: 'value_if_false', required: false, description: 'Result when condition is FALSE (default FALSE).' }
    ],
    referenceExamples: [
      { context: 'Sales target check B2>10000.', formula: '=IF(B2>10000, "Above Target", "Below Target")', result: 'Classification', explanation: 'Basic binary classification.' },
      { context: 'Overdue check against TODAY().', formula: '=IF(E2<TODAY(), "Overdue", "Upcoming")', result: 'Live Status', explanation: 'Recalculates every morning.' },
      { context: 'Combined with AND.', formula: '=IF(AND(B2>5000, C2="North"), "Priority", "Normal")', result: 'Tag', explanation: 'Multi-condition decision.' }
    ],
    realWorldScenarios: [
      'Appraisals: Flag employees as "Exceeds Expectations" or "Needs Improvement".',
      'Inventory: Display "Reorder Now" when current stock drops below safety buffer.',
      'Student Grading: Automatically assign Pass or Fail based on cutoff.'
    ],
    practiceExamples: createPracticeSet('IF', [
      {
        title: 'Target Performance Check',
        scenario: 'Evaluate sales performance in cell D2: if Sales in B2 ($12,500) exceeds Target in C2 ($10,000), output "Above Target", otherwise "Below Target".',
        dataset: makePracticeDataset(['A', 'B', 'C', 'D'], ['Rep', 'Sales', 'Target', 'Status (fx)'], [['Liam', 12500, 10000, null], ['Emma', 8400, 10000, null]], 'Output in D2', 'D2'),
        targetCell: 'D2',
        targetResult: 'Above Target',
        targetResultDisplay: '"Above Target"',
        referenceFormula: '=IF(B2>C2, "Above Target", "Below Target")',
        hint: 'Compare B2 > C2: =IF(B2>C2, "Above Target", "Below Target")',
        explanation: '12500 is greater than 10000, so "Above Target" is returned.'
      },
      {
        title: 'Pass or Fail Grading',
        scenario: 'In cell D2, if Student Score in B2 (68) is greater than or equal to Pass Mark in C2 (50), output "Pass", else "Fail".',
        dataset: makePracticeDataset(['A', 'B', 'C', 'D'], ['Student', 'Score', 'PassMark', 'Result (fx)'], [['Emma', 68, 50, null], ['Noah', 42, 50, null]], 'Output in D2', 'D2'),
        targetCell: 'D2',
        targetResult: 'Pass',
        targetResultDisplay: '"Pass"',
        referenceFormula: '=IF(B2>=C2, "Pass", "Fail")',
        hint: 'Use condition B2>=C2 or B2>=50: =IF(B2>=C2, "Pass", "Fail")',
        explanation: '68 is >= 50, which returns "Pass".'
      },
      {
        title: 'Low Stock Reorder Trigger',
        scenario: 'In cell D2, if Current Stock in B2 (12) is less than Reorder Buffer in C2 (20), output "Reorder Now", else "OK".',
        dataset: makePracticeDataset(['A', 'B', 'C', 'D'], ['SKU', 'Stock', 'MinBuffer', 'Alert (fx)'], [['SKU-101', 12, 20, null], ['SKU-102', 45, 20, null]], 'Output in D2', 'D2'),
        targetCell: 'D2',
        targetResult: 'Reorder Now',
        targetResultDisplay: '"Reorder Now"',
        referenceFormula: '=IF(B2<C2, "Reorder Now", "OK")',
        hint: 'Check if B2 < C2: =IF(B2<C2, "Reorder Now", "OK")',
        explanation: 'Current stock 12 is lower than minimum buffer 20.'
      },
      {
        title: 'Budget Variance Alert',
        scenario: 'In cell D2, if Actual spend in C2 ($5,600) exceeds Budget in B2 ($5,000), return "Over Budget", else "Under Budget".',
        dataset: makePracticeDataset(['A', 'B', 'C', 'D'], ['Dept', 'Budget', 'Actual', 'Variance (fx)'], [['Ops', 5000, 5600, null], ['Sales', 8000, 7200, null]], 'Output in D2', 'D2'),
        targetCell: 'D2',
        targetResult: 'Over Budget',
        targetResultDisplay: '"Over Budget"',
        referenceFormula: '=IF(C2>B2, "Over Budget", "Under Budget")',
        hint: 'Compare C2 > B2: =IF(C2>B2, "Over Budget", "Under Budget")',
        explanation: 'Actual 5600 exceeds Budget 5000.'
      },
      {
        title: 'Tiered Commission Multiplier',
        scenario: 'In cell D2, if Sales in B2 ($60,000) > 50000, calculate 10% commission (B2*0.1), else 5% (B2*0.05).',
        dataset: makePracticeDataset(['A', 'B', 'C', 'D'], ['Rep', 'Sales', 'Target', 'Commission (fx)'], [['Sarah', 60000, 50000, null], ['Alex', 35000, 50000, null]], 'Output in D2', 'D2'),
        targetCell: 'D2',
        targetResult: 6000,
        targetResultDisplay: '6,000',
        referenceFormula: '=IF(B2>50000, B2*0.1, B2*0.05)',
        hint: 'Use =IF(B2>50000, B2*0.1, B2*0.05)',
        explanation: '60000 qualifies for 10% rate (6,000).'
      },
      {
        title: 'Zero Division Guard',
        scenario: 'In cell D2, calculate Revenue per Unit (B2 / C2), but if Units in C2 is 0, safely return 0.',
        dataset: makePracticeDataset(['A', 'B', 'C', 'D'], ['Product', 'Revenue', 'Units', 'UnitRev (fx)'], [['New Launch', 1500, 0, null], ['Established', 6000, 20, null]], 'Output in D2', 'D2'),
        targetCell: 'D2',
        targetResult: 0,
        targetResultDisplay: '0',
        referenceFormula: '=IF(C2=0, 0, B2/C2)',
        hint: 'Test C2=0: =IF(C2=0, 0, B2/C2)',
        explanation: 'Prevents #DIV/0! error.'
      },
      {
        title: 'Weekend Surcharge',
        scenario: 'In cell D2, if DayType in B2 is "Weekend", add 20% surcharge to BaseFee in C2 (C2*1.2), else charge standard C2.',
        dataset: makePracticeDataset(['A', 'B', 'C', 'D'], ['Date', 'DayType', 'BaseFee', 'FinalFee (fx)'], [['11-Apr', 'Weekend', 100, null], ['13-Apr', 'Weekday', 100, null]], 'Output in D2', 'D2'),
        targetCell: 'D2',
        targetResult: 120,
        targetResultDisplay: '120',
        referenceFormula: '=IF(B2="Weekend", C2*1.2, C2)',
        hint: 'Use =IF(B2="Weekend", C2*1.2, C2)',
        explanation: 'Weekend fee is 120.'
      },
      {
        title: 'Senior Citizen Discount',
        scenario: 'In cell D2, if Customer Age in B2 >= 65, apply 15% discount to Fare in C2 (C2*0.85), else charge standard C2.',
        dataset: makePracticeDataset(['A', 'B', 'C', 'D'], ['Passenger', 'Age', 'Fare', 'Discounted (fx)'], [['Robert', 68, 50, null], ['Chloe', 24, 50, null]], 'Output in D2', 'D2'),
        targetCell: 'D2',
        targetResult: 42.5,
        targetResultDisplay: '42.50',
        referenceFormula: '=IF(B2>=65, C2*0.85, C2)',
        hint: 'Use =IF(B2>=65, C2*0.85, C2)',
        explanation: 'Senior passenger receives discounted fare 42.50.'
      },
      {
        title: 'Free Shipping Threshold',
        scenario: 'In cell D2, if Cart Total in B2 ($85) is >= 75 (Threshold in C2), shipping is 0, else shipping is 10.',
        dataset: makePracticeDataset(['A', 'B', 'C', 'D'], ['Order', 'CartTotal', 'FreeThreshold', 'Shipping (fx)'], [['ORD-1', 85, 75, null], ['ORD-2', 45, 75, null]], 'Output in D2', 'D2'),
        targetCell: 'D2',
        targetResult: 0,
        targetResultDisplay: '0',
        referenceFormula: '=IF(B2>=C2, 0, 10)',
        hint: 'Use =IF(B2>=C2, 0, 10)',
        explanation: 'Cart exceeds 75, so shipping is $0.'
      }
    ])
  },
  {
    id: 'ifs',
    name: 'IFS',
    category: 'logical',
    difficulty: 'beginner',
    chapter: 4,
    microsoft365Only: false,
    syntax: '=IFS(logical_test1, value_if_true1, [logical_test2, value_if_true2], ...)',
    description: 'Modern replacement for deep nested IFs. Evaluates conditions in sequence and returns the result for the first TRUE condition encountered.',
    parameters: [
      { name: 'logical_test1', required: true, description: 'First condition.' },
      { name: 'value_if_true1', required: true, description: 'Result if first condition is TRUE.' },
      { name: 'logical_test2', required: false, description: 'Subsequent conditions and values.' }
    ],
    referenceExamples: [
      { context: 'Grade assignment: B2>=90,"A", B2>=80,"B", B2>=70,"C", TRUE,"F".', formula: '=IFS(B2>=90,"A", B2>=80,"B", B2>=70,"C", TRUE,"F")', result: 'Letter Grade', explanation: 'Stops at first true condition.' },
      { context: 'Sales tier: >50k "Platinum", >20k "Gold", >10k "Silver", TRUE "Standard".', formula: '=IFS(B2>50000,"Platinum", B2>20000,"Gold", B2>10000,"Silver", TRUE,"Standard")', result: 'Tier', explanation: 'Classifies tiers without nested parentheses.' }
    ],
    realWorldScenarios: [
      'Bonus Schemes: Multi-tier commission thresholds.',
      'Customer Segmentation: VIP, Loyal, or Standard tier routing.',
      'Project Status: "On Track", "At Risk", or "Delayed".'
    ],
    practiceExamples: createPracticeSet('IFS', [
      {
        title: 'Letter Grade Assignment',
        scenario: 'Assign grade for score in A2: >=90 "A", >=80 "B", >=70 "C", otherwise "F".',
        dataset: makePracticeDataset(['A'], ['Score'], [[85], [92], [64]]),
        targetResult: 'B',
        targetResultDisplay: '"B"',
        referenceFormula: '=IFS(A2>=90,"A", A2>=80,"B", A2>=70,"C", TRUE,"F")',
        hint: 'Use TRUE as the catch-all final condition.',
        explanation: '85 meets >= 80, returning "B".'
      },
      {
        title: 'Customer Loyalty Tier',
        scenario: 'Classify spend in A2: >50000 "Platinum", >20000 "Gold", >10000 "Silver", else "Standard".',
        dataset: makePracticeDataset(['A'], ['AnnualSpend'], [[24000]]),
        targetResult: 'Gold',
        targetResultDisplay: '"Gold"',
        referenceFormula: '=IFS(A2>50000,"Platinum", A2>20000,"Gold", A2>10000,"Silver", TRUE,"Standard")',
        hint: 'Check largest thresholds first.',
        explanation: '24000 > 20000 assigns "Gold".'
      },
      {
        title: 'Ticket Priority by SLA Hours',
        scenario: 'Assign priority for wait hours in A2: >24 "Urgent", >8 "High", >4 "Medium", else "Low".',
        dataset: makePracticeDataset(['A'], ['WaitHours'], [[14]]),
        targetResult: 'High',
        targetResultDisplay: '"High"',
        referenceFormula: '=IFS(A2>24,"Urgent", A2>8,"High", A2>4,"Medium", TRUE,"Low")',
        hint: 'Use =IFS(A2>24,"Urgent", A2>8,"High", A2>4,"Medium", TRUE,"Low")',
        explanation: '14 hours falls into > 8 ("High").'
      },
      {
        title: 'Shipping Method by Weight',
        scenario: 'Assign method for weight in A2: >100 "Freight", >20 "Express Courier", else "Standard Postal".',
        dataset: makePracticeDataset(['A'], ['WeightKg'], [[35]]),
        targetResult: 'Express Courier',
        targetResultDisplay: '"Express Courier"',
        referenceFormula: '=IFS(A2>100,"Freight", A2>20,"Express Courier", TRUE,"Standard Postal")',
        hint: 'Test A2>100, then A2>20.',
        explanation: '35kg gets "Express Courier".'
      },
      {
        title: 'Credit Score Rating',
        scenario: 'Rating for credit score A2: >=750 "Excellent", >=700 "Good", >=650 "Fair", else "Poor".',
        dataset: makePracticeDataset(['A'], ['CreditScore'], [[715]]),
        targetResult: 'Good',
        targetResultDisplay: '"Good"',
        referenceFormula: '=IFS(A2>=750,"Excellent", A2>=700,"Good", A2>=650,"Fair", TRUE,"Poor")',
        hint: 'Use =IFS(A2>=750,"Excellent", A2>=700,"Good", A2>=650,"Fair", TRUE,"Poor")',
        explanation: '715 qualifies for "Good".'
      },
      {
        title: 'Project RAG Status',
        scenario: 'Status for days overdue A2: >14 "Red", >0 "Amber", TRUE "Green".',
        dataset: makePracticeDataset(['A'], ['DaysDelayed'], [[5]]),
        targetResult: 'Amber',
        targetResultDisplay: '"Amber"',
        referenceFormula: '=IFS(A2>14,"Red", A2>0,"Amber", TRUE,"Green")',
        hint: 'Check >14 then >0 then TRUE.',
        explanation: '5 days delayed is Amber.'
      },
      {
        title: 'Volume Pricing Discount Rate',
        scenario: 'Discount for quantity A2: >=100 0.20, >=50 0.15, >=20 0.10, else 0.',
        dataset: makePracticeDataset(['A'], ['Units'], [[60]]),
        targetResult: 0.15,
        targetResultDisplay: '0.15',
        referenceFormula: '=IFS(A2>=100,0.2, A2>=50,0.15, A2>=20,0.1, TRUE,0)',
        hint: 'Return decimal rates.',
        explanation: '60 units gets 15% discount.'
      },
      {
        title: 'Tax Bracket Assignment',
        scenario: 'Tax rate for income A2: >100000 0.35, >50000 0.25, else 0.15.',
        dataset: makePracticeDataset(['A'], ['Income'], [[72000]]),
        targetResult: 0.25,
        targetResultDisplay: '0.25',
        referenceFormula: '=IFS(A2>100000,0.35, A2>50000,0.25, TRUE,0.15)',
        hint: 'Use =IFS(A2>100000,0.35, A2>50000,0.25, TRUE,0.15)',
        explanation: '72k is in 25% bracket.'
      },
      {
        title: 'Employee Headcount Category',
        scenario: 'Size for count A2: >250 "Enterprise", >50 "Mid-Market", else "SMB".',
        dataset: makePracticeDataset(['A'], ['Employees'], [[85]]),
        targetResult: 'Mid-Market',
        targetResultDisplay: '"Mid-Market"',
        referenceFormula: '=IFS(A2>250,"Enterprise", A2>50,"Mid-Market", TRUE,"SMB")',
        hint: 'Test A2>250 then A2>50.',
        explanation: '85 employees is Mid-Market.'
      }
    ])
  },
  {
    id: 'iferror',
    name: 'IFERROR',
    category: 'logical',
    difficulty: 'beginner',
    chapter: 4,
    microsoft365Only: false,
    syntax: '=IFERROR(value, value_if_error)',
    description: 'Catches any Excel error (#N/A, #VALUE!, #DIV/0!, #REF!) and replaces it with a clean custom fallback (like 0, blank, or "Not Found").',
    parameters: [
      { name: 'value', required: true, description: 'Formula or expression to test.' },
      { name: 'value_if_error', required: true, description: 'Fallback value if an error occurs.' }
    ],
    referenceExamples: [
      { context: 'VLOOKUP not found message.', formula: '=IFERROR(VLOOKUP(G2, A2:B100, 2, FALSE), "Product not found")', result: 'Clean message', explanation: 'Replaces #N/A with user-friendly text.' },
      { context: 'Division safety.', formula: '=IFERROR(A2/B2, 0)', result: '0', explanation: 'Prevents #DIV/0! when units are zero.' }
    ],
    realWorldScenarios: [
      'Dashboard Reports: Display "No Data Yet" instead of ugly red errors.',
      'Margin Calculations: Prevent #DIV/0! in zero-sales months.',
      'Catalog Matching: Flag unmatched SKUs clearly for data-entry staff.'
    ],
    practiceExamples: createPracticeSet('IFERROR', [
      {
        title: 'Safe Revenue Per Unit',
        scenario: 'Divide Revenue A2 by Units B2, returning 0 if an error occurs (e.g. B2=0).',
        dataset: makePracticeDataset(['A', 'B'], ['Revenue', 'Units'], [[4500, 0], [6000, 20]]),
        targetResult: 0,
        targetResultDisplay: '0',
        referenceFormula: '=IFERROR(A2/B2, 0)',
        hint: 'Wrap division inside IFERROR: =IFERROR(A2/B2, 0)',
        explanation: '4500/0 generates #DIV/0!, which IFERROR intercepts and returns 0.'
      },
      {
        title: 'Friendly Lookup Fallback',
        scenario: 'Perform lookup for "MissingSKU" in A2:B4, returning "Not Found" on error.',
        dataset: makePracticeDataset(['A', 'B'], ['SKU', 'Price'], [['SKU-1', 40], ['SKU-2', 85], ['SKU-3', 120]]),
        targetResult: 'Not Found',
        targetResultDisplay: '"Not Found"',
        referenceFormula: '=IFERROR(VLOOKUP("MissingSKU", A2:B4, 2, FALSE), "Not Found")',
        hint: 'Wrap VLOOKUP with IFERROR(..., "Not Found")',
        explanation: 'Returns "Not Found" instead of #N/A.'
      },
      {
        title: 'Safe Percentage Change',
        scenario: 'Calculate growth (B2-A2)/A2, returning 0 if Base A2 is 0.',
        dataset: makePracticeDataset(['A', 'B'], ['LastYear', 'ThisYear'], [[0, 5000]]),
        targetResult: 0,
        targetResultDisplay: '0',
        referenceFormula: '=IFERROR((B2-A2)/A2, 0)',
        hint: 'Use =IFERROR((B2-A2)/A2, 0)',
        explanation: 'Prevents division by zero error.'
      },
      {
        title: 'Safe Text to Number Conversion',
        scenario: 'Convert text in A2 to number with VALUE(A2), returning 0 if conversion fails.',
        dataset: makePracticeDataset(['A'], ['RawInput'], [['N/A'], ['125']]),
        targetResult: 0,
        targetResultDisplay: '0',
        referenceFormula: '=IFERROR(VALUE(A2), 0)',
        hint: 'Wrap VALUE(A2) inside IFERROR.',
        explanation: 'Returns 0 when text is not numeric.'
      },
      {
        title: 'Clean Empty String Replacement',
        scenario: 'Divide A2 by B2, returning an empty string "" if an error occurs.',
        dataset: makePracticeDataset(['A', 'B'], ['Numerator', 'Denominator'], [[100, 0]]),
        targetResult: '',
        targetResultDisplay: '"" (Blank)',
        referenceFormula: '=IFERROR(A2/B2, "")',
        hint: 'Use "" as fallback: =IFERROR(A2/B2, "")',
        explanation: 'Leaves cell blank on error.'
      },
      {
        title: 'Safe Date Difference',
        scenario: 'Calculate NETWORKDAYS between start A2 and end B2, returning 0 if invalid.',
        dataset: makePracticeDataset(['A', 'B'], ['Start', 'End'], [['InvalidDate', '2026-04-15']]),
        targetResult: 0,
        targetResultDisplay: '0',
        referenceFormula: '=IFERROR(NETWORKDAYS(A2, B2), 0)',
        hint: 'Wrap NETWORKDAYS in IFERROR.',
        explanation: 'Invalid date string is caught gracefully.'
      },
      {
        title: 'Safe Search Match',
        scenario: 'Find position of "@" in A2 with FIND, returning 0 if not present.',
        dataset: makePracticeDataset(['A'], ['Contact'], [['John Smith']]),
        targetResult: 0,
        targetResultDisplay: '0',
        referenceFormula: '=IFERROR(FIND("@", A2), 0)',
        hint: 'Use =IFERROR(FIND("@", A2), 0)',
        explanation: 'FIND returns #VALUE! when not found, caught to 0.'
      },
      {
        title: 'Protected Average Calculation',
        scenario: 'Average values in A2:A3, returning "No Records" if range contains errors.',
        dataset: makePracticeDataset(['A'], ['Reading'], [['#N/A'], ['#N/A']]),
        targetResult: 'No Records',
        targetResultDisplay: '"No Records"',
        referenceFormula: '=IFERROR(AVERAGE(A2:A3), "No Records")',
        hint: 'Wrap AVERAGE in IFERROR(..., "No Records")',
        explanation: 'Avoids error propagation in dashboard.'
      },
      {
        title: 'Financial Margin Guard',
        scenario: 'Calculate ProfitMargin Profit B2 / Revenue A2, returning 0 if Revenue is 0.',
        dataset: makePracticeDataset(['A', 'B'], ['Revenue', 'Profit'], [[0, -500]]),
        targetResult: 0,
        targetResultDisplay: '0',
        referenceFormula: '=IFERROR(B2/A2, 0)',
        hint: 'Use =IFERROR(B2/A2, 0)',
        explanation: 'Preserves model integrity during pre-revenue phases.'
      }
    ])
  }
];
