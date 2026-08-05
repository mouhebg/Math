export type SessionKind = "Core" | "Extension" | "Review";

export type Session = {
  id: string;
  unit: number;
  letter: "A" | "B" | "C" | "D";
  title: string;
  focus: string;
  activity: string;
  success: string;
  kind: SessionKind;
  /**
   * What to have on the table before starting, in household terms. Present only
   * on sessions that ask for a physical object, because "counters" means nothing
   * to a parent who does not own a box of counters. Everything named here should
   * be findable in an ordinary kitchen, and every entry offers a way out for a
   * parent who has none of it.
   */
  materials?: string;
  /**
   * Ontario Grade 2 mathematics (2020) specific expectation codes covered by
   * this session. An empty array means the session sits outside the Grade 2
   * expectations and is offered as an extension or a review.
   */
  expectations: string[];
  /**
   * A second, standalone worksheet for the same skill, offered for a student
   * who needs another pass before moving on. Present only on sessions where
   * one has been written; its file follows the session's own worksheet name
   * with an "-extra" suffix.
   */
  extraPractice?: { focus: string };
};

export const phases = [
  { name: "Number foundations", units: "Units 1 to 4", note: "Build meaning before procedures." },
  { name: "Taking numbers apart", units: "Units 5 to 8", note: "Subtraction, sharing, and halves." },
  { name: "Shape and space", units: "Units 9 to 12", note: "Shapes, measuring, position, and movement." },
  { name: "Math in daily life", units: "Units 13 to 16", note: "Money, duration, time, and planning." },
  { name: "Patterns, equality and code", units: "Units 17 to 20", note: "Rules, balance, and instructions a machine can follow." },
  { name: "Groups, data and review", units: "Units 21 to 24", note: "Arrays, sharing, data, chance, and review." },
];

export const sessions: Session[] = [
  // ------------------------------------------------------- Part 1, Number foundations
  { id: "1A", unit: 1, letter: "A", title: "Bonds to ten", focus: "See ten as two parts and learn every partner pair.", activity: "Use ten frames, part-whole bars, and the rainbow of ten.", success: "The student gives the partner of any number to 10 without counting up.", kind: "Core", expectations: ["B2.2"] },
  { id: "1B", unit: 1, letter: "B", title: "Three story shapes", focus: "Find a missing whole, missing part, or missing start.", activity: "Draw the same part-whole box for six different stories.", success: "The student decides what is missing without relying on keywords.", kind: "Core", expectations: ["B2.1", "B2.4"], extraPractice: { focus: "Six more stories, weighted toward the missing-start type, for a student who guessed at keywords instead of reasoning from the box." } },
  { id: "1C", unit: 1, letter: "C", title: "Doubles and near doubles", focus: "Use a known double to reach the pair beside it.", activity: "Build equal rows, learn the doubles to 10, then add or take away one.", success: "The student names the double before giving the answer.", kind: "Core", expectations: ["B2.2"] },
  { id: "1D", unit: 1, letter: "D", title: "Cross the ten", focus: "Add past ten by making the ten first.", activity: "Move counters into a ten frame, then read the answer as ten and some ones.", success: "The student says the total, not the leftover.", kind: "Core", materials: "About 20 small identical things: dried beans, nickels, buttons, or pasta. No objects? Draw dots in the squares and rub them out as they move.", expectations: ["B2.2", "B2.3"] },

  { id: "2A", unit: 2, letter: "A", title: "Tens and ones", focus: "Compose and decompose numbers to 200.", activity: "Build two-digit numbers and trade one ten for ten ones.", success: "The student represents one number in two different ways.", kind: "Core", expectations: ["B1.1"] },
  { id: "2B", unit: 2, letter: "B", title: "Charts and order", focus: "Compare, order, and locate numbers to 200.", activity: "Explore neighbours on 100 and 200 charts.", success: "The student explains why one number is greater than another.", kind: "Core", expectations: ["B1.2"] },
  { id: "2C", unit: 2, letter: "C", title: "Estimate, then count", focus: "Estimate a collection up to 200, then count by 20s, 25s, and 50s to check.", activity: "Guess a jar of counters, group them, and count in useful jumps.", success: "The student chooses a grouping that speeds up the count and explains why.", kind: "Core", materials: "Two piles made before you start, one of about 40 things and one of about 150: beans, pasta, coins, or LEGO. Keep the real counts to yourself until the guess is written down.", expectations: ["B1.3", "B1.4"] },

  // B2.3 caps at 50, so it cannot be the only code on either session. 3A moves
  // by tens across numbers as large as 148, which is place value to 200 (B1.1);
  // 3B's sums all land under 100 (B2.4). The work was always Grade 2, only the
  // labels were short.
  { id: "3A", unit: 3, letter: "A", title: "Ten more, ten less", focus: "Use place value to move mentally by tens.", activity: "Move on a number chart, then repeat without the chart.", success: "The student changes the tens while tracking what happens to the ones.", kind: "Core", expectations: ["B1.1", "B2.3"] },
  { id: "3B", unit: 3, letter: "B", title: "Add ten, adjust", focus: "Choose an efficient mental addition strategy.", activity: "Solve 47 + 8 by adding ten and adjusting, then by making 50.", success: "The student chooses a strategy and explains the route.", kind: "Core", expectations: ["B2.3", "B2.4"] },

  { id: "4A", unit: 4, letter: "A", title: "Regroup with objects", focus: "Understand ten ones as one ten.", activity: "Combine bundled sticks before writing any vertical calculation.", success: "The student describes the trade in place-value language.", kind: "Core", materials: "About 30 sticks, straws or cotton buds, plus elastic bands or tape to bundle them in tens. Pencil strokes on paper work just as well.", expectations: ["B1.1", "B2.4"] },
  { id: "4B", unit: 4, letter: "B", title: "Add within 100", focus: "Represent and solve two-digit addition situations.", activity: "Use drawings, equations, and an optional written method.", success: "The student's answer matches the estimate and the concrete model.", kind: "Core", expectations: ["B2.4"] },

  // ------------------------------------------------------- Part 2, Taking numbers apart
  { id: "5A", unit: 5, letter: "A", title: "Unbundle a ten", focus: "Trade one ten for ten ones in subtraction.", activity: "Model 52 minus 27 with bundled sticks.", success: "The student explains why the number of tens changes.", kind: "Core", materials: "The same bundles of ten from Session A: sticks or straws with elastic bands, or drawn strokes you can cross out.", expectations: ["B1.1", "B2.4"] },
  { id: "5B", unit: 5, letter: "B", title: "Subtract and check", focus: "Solve subtraction within 100 and check by adding.", activity: "Use objects or drawings first, then an optional written method.", success: "The student checks the difference independently.", kind: "Core", materials: "Objects or drawings, whichever the student reaches for first. Nothing needs buying.", expectations: ["B2.1", "B2.4"] },

  // Same correction as Unit 3: the sheet subtracts within 100 (84 minus 27,
  // 100 minus 96), which is B2.4, not only the mental strategies capped at 50.
  { id: "6A", unit: 6, letter: "A", title: "Choose a method", focus: "Compare counting up with subtracting by place value.", activity: "Contrast 52 minus 47 with 52 minus 27.", success: "The student selects a method because it suits the numbers.", kind: "Core", expectations: ["B2.3", "B2.4"] },
  { id: "6B", unit: 6, letter: "B", title: "Add or subtract?", focus: "Reason through mixed word problems.", activity: "Identify the whole and parts before choosing an operation.", success: "The student justifies the operation before computing.", kind: "Core", expectations: ["B2.1", "B2.4"] },

  { id: "7A", unit: 7, letter: "A", title: "Half of even numbers", focus: "Connect fair sharing, doubles, and halves.", activity: "Share counters equally between two people.", success: "The student uses a known double to explain a half.", kind: "Core", materials: "An even number of small identical things, up to 24: beans, buttons, coins, or grapes.", expectations: ["B1.6"] },
  { id: "7B", unit: 7, letter: "B", title: "Half with a leftover", focus: "See that an odd quantity can still be shared fairly.", activity: "Share items and divide the remaining item into two equal parts.", success: "The student describes the result as a whole number and one half.", kind: "Core", expectations: ["B1.6"] },

  { id: "8A", unit: 8, letter: "A", title: "Half of two-digit numbers", focus: "Extend halving by separating tens and ones.", activity: "Split 48 into 40 and 8, then halve each part.", success: "The student chooses the tens-and-ones split without prompting.", kind: "Extension", expectations: [] },
  { id: "8B", unit: 8, letter: "B", title: "Half of odd totals", focus: "Extend halving to two-digit odd numbers.", activity: "Use strips or counters before writing mixed-number answers.", success: "The student can model the remaining one half physically.", kind: "Extension", materials: "Two or three paper strips you can fold and cut, plus about 25 small identical things.", expectations: [] },

  // ------------------------------------------------------- Part 3, Shape and space
  { id: "9A", unit: 9, letter: "A", title: "Sides and angles", focus: "Sort two-dimensional shapes by number of sides, side lengths, and angles.", activity: "Sort cut-out shapes, then say each sorting rule out loud.", success: "The student sorts by a property, not by how the shape looks overall.", kind: "Core", expectations: ["E1.1"] },
  { id: "9B", unit: 9, letter: "B", title: "Lines of symmetry", focus: "Find and count the lines of symmetry in a shape.", activity: "Fold paper shapes and mark every fold where the halves match exactly.", success: "The student tests a fold before claiming it is a line of symmetry.", kind: "Core", expectations: ["E1.1"] },

  { id: "10A", unit: 10, letter: "A", title: "Build and break shapes", focus: "Compose and decompose shapes, and see that the area stays the same.", activity: "Rearrange the same tangram or pattern-block pieces into different outlines.", success: "The student says the amount of space is unchanged when pieces move.", kind: "Core", materials: "Tangram or pattern blocks if you have them. If not, cut squares and triangles from any paper.", expectations: ["E1.2"] },
  { id: "10B", unit: 10, letter: "B", title: "Same or not the same", focus: "Match lengths and angles to decide whether two shapes are congruent.", activity: "Compare shapes by eye, then check by placing one on top of the other.", success: "The student checks a prediction physically instead of guessing.", kind: "Core", expectations: ["E1.3"] },

  { id: "11A", unit: 11, letter: "A", title: "Units you can hold", focus: "Measure with non-standard units and see why smaller units give bigger numbers.", activity: "Measure the same table with paper clips, then with hands.", success: "The student predicts that a smaller unit will need more of them.", kind: "Core", expectations: ["E2.1"] },
  { id: "11B", unit: 11, letter: "B", title: "Centimetres and metres", focus: "Relate centimetres to metres and build benchmarks for estimating.", activity: "Find a personal one centimetre and one metre, then estimate before measuring.", success: "The student estimates in a sensible unit before reaching for the tape.", kind: "Core", expectations: ["E2.2"] },
  { id: "11C", unit: 11, letter: "C", title: "The broken ruler", focus: "Measure and draw in centimetres and metres, including from a non-zero start.", activity: "Measure objects lined up at the 3 mark, then draw lines to a given length.", success: "The student accounts for the starting point instead of reading the end number.", kind: "Core", materials: "A ruler or tape measure showing centimetres, and a few objects to measure.", expectations: ["E2.3"] },

  { id: "12A", unit: 12, letter: "A", title: "Map the home", focus: "Create and interpret a simple map of a familiar place.", activity: "Draw a bird's-eye map of one room, then use it to find a hidden object.", success: "The student places objects in the right relative positions on the map.", kind: "Core", materials: "Paper, a pencil, and one small object to hide in the room.", expectations: ["E1.4"] },
  { id: "12B", unit: 12, letter: "B", title: "Routes and directions", focus: "Describe relative positions and the movements needed to get from one place to another.", activity: "Give and follow spoken routes using left, right, forward, and quarter turns.", success: "The student gives a route another person can follow without extra hints.", kind: "Core", expectations: ["E1.5"] },

  // ------------------------------------------------------- Part 4, Math in daily life
  { id: "13A", unit: 13, letter: "A", title: "Canadian coins", focus: "Recognize coins and compare their values.", activity: "Sort real coins by value, not physical size.", success: "The student identifies each coin and explains its value.", kind: "Core", materials: "Real Canadian coins: a nickel, dime, quarter, loonie and toonie. Pennies are out of circulation.", expectations: ["F1.1"] },
  { id: "13B", unit: 13, letter: "B", title: "Equivalent amounts", focus: "Represent the same amount in different ways, in coins and in bills.", activity: "Make 60 cents several ways, then make 75 dollars several ways.", success: "The student creates and verifies more than one combination.", kind: "Core", materials: "A handful of real coins, and a few bills if you have them.", expectations: ["F1.1"] },

  { id: "14A", unit: 14, letter: "A", title: "Count up for change", focus: "Apply number sense to simple cash change.", activity: "Count from a price to the amount paid using real coins.", success: "The student counts up and verifies the total paid.", kind: "Extension", materials: "Real coins, and a few household items to price up.", expectations: [] },
  { id: "14B", unit: 14, letter: "B", title: "Home shop", focus: "Use money in a playful real-life setting.", activity: "Price household items, take turns as customer and cashier.", success: "The student checks change with coins or addition.", kind: "Extension", expectations: [] },

  { id: "15A", unit: 15, letter: "A", title: "How long does it take?", focus: "Describe how long events last, in seconds, minutes, hours, and non-standard units.", activity: "Time real household tasks and order them from shortest to longest.", success: "The student chooses a sensible unit for the length of an event.", kind: "Core", expectations: ["E2.4"] },
  { id: "15B", unit: 15, letter: "B", title: "The hour hand", focus: "Read where the short hand has passed.", activity: "Cover the minute hand and reason about the hour.", success: "The student names the hour it has passed, not the nearest numeral.", kind: "Extension", expectations: [] },
  { id: "15C", unit: 15, letter: "C", title: "Quarter-hour clocks", focus: "Connect quarters and halves to an analogue clock.", activity: "Set and read o'clock, half past, quarter past, and quarter to.", success: "The student explains why 3:45 is quarter to four.", kind: "Extension", expectations: [] },
  { id: "15D", unit: 15, letter: "D", title: "Five-minute clocks", focus: "Read the minute hand in five-minute steps.", activity: "Skip-count around a clock and set times to five minutes.", success: "The student reads the minute hand without losing track of the hour.", kind: "Extension", expectations: [] },

  { id: "16A", unit: 16, letter: "A", title: "Plan a Saturday", focus: "Combine money, duration, and decision-making.", activity: "Plan activities using a small budget and simple durations.", success: "The student explains both the schedule and the spending choices.", kind: "Review", expectations: ["C4", "E2.4", "F1.1"] },
  { id: "16B", unit: 16, letter: "B", title: "Halfway check", focus: "Review Units 1 through 15 without a timer.", activity: "Use the results to choose what to repeat, not to assign a score.", success: "You can identify what is secure and what needs another example.", kind: "Review", expectations: [] },

  // ------------------------------------------------------- Part 5, Patterns, equality and code
  { id: "17A", unit: 17, letter: "A", title: "Patterns around us", focus: "Identify and describe patterns in geometric designs and in real life.", activity: "Hunt for repeating patterns on tiles, fabric, and fences, then describe each core.", success: "The student names the repeating part rather than pointing at the whole design.", kind: "Core", materials: "Nothing to fetch. Look at tiles, fabric, brickwork and railings around the house.", expectations: ["C1.1"] },
  { id: "17B", unit: 17, letter: "B", title: "Same pattern, new clothes", focus: "Create a pattern and translate it into another representation.", activity: "Show one pattern with shapes, then with numbers, then with claps.", success: "The student explains why two different-looking patterns are the same pattern.", kind: "Core", expectations: ["C1.2"] },
  { id: "17C", unit: 17, letter: "C", title: "Find the rule", focus: "Determine pattern rules, extend patterns, and fill missing elements.", activity: "Continue growing patterns and repair patterns with gaps in the middle.", success: "The student states the rule rather than only the next number.", kind: "Core", expectations: ["C1.3"] },

  { id: "18A", unit: 18, letter: "A", title: "Number patterns to 100", focus: "Create and describe patterns that show relationships among whole numbers.", activity: "Colour skip-counting patterns on a hundred chart and describe what repeats.", success: "The student predicts a later number without filling in every step.", kind: "Core", expectations: ["C1.4"] },
  { id: "18B", unit: 18, letter: "B", title: "Different names, same number", focus: "Identify and use equivalent relationships for whole numbers up to 100.", activity: "Write six true ways to name 40, then sort true and false statements.", success: "The student judges a statement as true or false and explains why.", kind: "Core", expectations: ["C2.3"] },

  { id: "19A", unit: 19, letter: "A", title: "What does the symbol stand for?", focus: "Identify when a symbol is being used as a variable.", activity: "Solve puzzles where a shape or a letter hides a number, and say what it stands for.", success: "The student explains that the symbol holds one unknown number.", kind: "Core", expectations: ["C2.1"] },
  { id: "19B", unit: 19, letter: "B", title: "Balance both sides", focus: "Determine what must be added or subtracted to make two expressions equal.", activity: "Use a balance or a drawn scale to fix statements such as 7 + 5 = ? + 4.", success: "The student reads the equals sign as a balance, not as an instruction to answer.", kind: "Core", expectations: ["C2.2"] },

  { id: "20A", unit: 20, letter: "A", title: "Instructions in order", focus: "Write a precise sequence of steps another person can follow exactly.", activity: "Program a parent to make a sandwich or walk a grid, one instruction at a time.", success: "The student fixes an instruction that was ambiguous or out of order.", kind: "Core", expectations: ["C3.1"] },
  { id: "20B", unit: 20, letter: "B", title: "Write and run code", focus: "Create a computational representation and execute it.", activity: "Build a short block program that draws a shape or moves a character.", success: "The student predicts the outcome before running the code.", kind: "Core", materials: "A device with a block coding app such as ScratchJr. Paper and a drawn grid work if there is no device.", expectations: ["C3.1"] },
  { id: "20C", unit: 20, letter: "C", title: "Read it, change it", focus: "Read and alter existing code, including concurrent events, and describe the effect.", activity: "Open a working program, change one value, and say what changed and why.", success: "The student describes the effect of a change in cause-and-effect terms.", kind: "Core", expectations: ["C3.2"] },

  // ------------------------------------------------------- Part 6, Groups, data and review
  { id: "21A", unit: 21, letter: "A", title: "Equal groups", focus: "Represent multiplication as repeated equal groups.", activity: "Build, draw, and skip-count groups of equal size, including groups of one half.", success: "The student finds the total without counting every object by ones.", kind: "Core", expectations: ["B2.5"] },
  { id: "21B", unit: 21, letter: "B", title: "Rows and columns", focus: "Explore arrays as organized equal groups.", activity: "Count the same array by rows and by columns.", success: "The student explains why both counts produce the same total.", kind: "Core", expectations: ["B2.5"] },

  { id: "22A", unit: 22, letter: "A", title: "Fair sharing", focus: "Share up to 12 items among two, three, four, or six people.", activity: "Use counters and discuss equal shares and leftovers.", success: "The student checks that every share is equal.", kind: "Core", materials: "Up to 20 small identical things, and a few plates or sheets of paper to share them onto.", expectations: ["B1.6", "B2.6"] },
  { id: "22B", unit: 22, letter: "B", title: "Thirds and sixths", focus: "Recognize that one third and two sixths of the same whole are equal.", activity: "Fold identical strips into thirds and into sixths, then lay them side by side.", success: "The student shows the two amounts are equal using the same whole.", kind: "Core", materials: "Two identical strips of paper you can fold, and a pencil.", expectations: ["B1.7"] },
  { id: "22C", unit: 22, letter: "C", title: "Odd, even, skip count", focus: "Describe what makes a number even or odd and count by useful intervals.", activity: "Pair counters, predict leftovers, then count by 2, 5, 10, and 25.", success: "The student predicts odd or even before building the pairs.", kind: "Core", materials: "About 25 small identical things that pair up easily: beans, coins, or pasta.", expectations: ["B1.4", "B1.5"] },

  { id: "23A", unit: 23, letter: "A", title: "Sort two ways at once", focus: "Sort a set by two attributes using Venn and Carroll diagrams.", activity: "Sort buttons or books by two rules and argue about the overlap.", success: "The student places an item in the overlap and explains why it belongs there.", kind: "Core", materials: "A set of things to sort by two rules at once: buttons, socks, books, or LEGO bricks.", expectations: ["D1.1"] },
  { id: "23B", unit: 23, letter: "B", title: "Ask and tally", focus: "Collect data on two pieces of information and organize it in a two-way tally table.", activity: "Interview the household with a question of real interest and tally the answers.", success: "The student records every response without losing count.", kind: "Core", expectations: ["D1.2"] },
  { id: "23C", unit: 23, letter: "C", title: "Build the graph", focus: "Display data with one-to-one correspondence, with a source, a title, and labels.", activity: "Turn the tally into a pictograph, a line plot, and a bar graph.", success: "The student labels both axes and names where the data came from.", kind: "Core", expectations: ["D1.3"] },
  { id: "23D", unit: 23, letter: "D", title: "Mode and conclusions", focus: "Identify the mode and use the graph to answer questions and argue a point.", activity: "Read the graph, name the mode, and make one convincing recommendation.", success: "The student supports a claim by pointing at the data.", kind: "Core", expectations: ["D1.4", "D1.5"] },

  { id: "24A", unit: 24, letter: "A", title: "Impossible, possible, certain", focus: "Use likelihood language to describe complementary events and make predictions.", activity: "Sort household statements into the three words, then test a few with a die.", success: "The student uses the right word and gives a reason for the choice.", kind: "Core", expectations: ["D2.1"] },
  { id: "24B", unit: 24, letter: "B", title: "Will the same answer win?", focus: "Predict whether the mode from one group will hold for a different group.", activity: "Repeat the Unit 23 survey with a different set of people and compare.", success: "The student explains why the mode did or did not stay the same.", kind: "Core", expectations: ["D2.2"] },
  { id: "24C", unit: 24, letter: "C", title: "Whole-course review", focus: "Show what is secure across the complete plan.", activity: "Complete a mixed, untimed review independently.", success: "The student can name strengths and choose what to practise next.", kind: "Review", expectations: [] },
];

export const unitNames = [
  "Bonds to ten and facts to 20",
  "Place value to 200",
  "Mental addition",
  "Addition within 100",
  "Subtraction within 100",
  "Choosing strategies",
  "Fair sharing and halves",
  "Two-digit halving",
  "Sorting two-dimensional shapes",
  "Composing shapes and congruence",
  "Measuring length",
  "Maps, position and movement",
  "Canadian money",
  "Making change",
  "Duration and clocks",
  "Apply and review",
  "Patterns and rules",
  "Number patterns and equality",
  "Balance and the missing number",
  "Coding",
  "Equal groups and arrays",
  "Sharing, thirds, odd and even",
  "Data",
  "Chance and review",
];

export const unitsPerPart = 4;

export const weeklyUnits = Array.from({ length: unitNames.length }, (_, index) => ({
  week: index + 1,
  sessions: sessions.filter((session) => session.unit === index + 1),
}));

/**
 * Every specific expectation in the Ontario Grade 2 mathematics curriculum
 * (2020). A1 (social-emotional learning) and C4 (mathematical modelling) are
 * ongoing expectations rather than single-session topics, so they are handled
 * through the parent guide and the review sessions.
 * Source: https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-mathematics/grades/g2-math
 */
export const ontarioGrade2Expectations: { code: string; strand: string; summary: string }[] = [
  { code: "B1.1", strand: "Number", summary: "Read, represent, compose, and decompose whole numbers up to 200" },
  { code: "B1.2", strand: "Number", summary: "Compare and order whole numbers up to 200" },
  { code: "B1.3", strand: "Number", summary: "Estimate collections of up to 200 and verify by counting" },
  { code: "B1.4", strand: "Number", summary: "Count to 200, including by 20s, 25s, and 50s" },
  { code: "B1.5", strand: "Number", summary: "Describe what makes a number even or odd" },
  { code: "B1.6", strand: "Number", summary: "Fair-share up to 10 items among 2, 3, 4, and 6 sharers" },
  { code: "B1.7", strand: "Number", summary: "Recognize that one third and two sixths of the same whole are equal" },
  { code: "B2.1", strand: "Number", summary: "Use the properties of addition and subtraction and their relationships to multiplication and division" },
  { code: "B2.2", strand: "Number", summary: "Recall addition facts to 20 and the related subtraction facts" },
  { code: "B2.3", strand: "Number", summary: "Use mental math strategies, including estimation, to add and subtract to 50" },
  { code: "B2.4", strand: "Number", summary: "Represent and solve addition and subtraction situations to 100" },
  { code: "B2.5", strand: "Number", summary: "Represent multiplication as repeated equal groups" },
  { code: "B2.6", strand: "Number", summary: "Represent division of up to 12 items as equal sharing" },
  { code: "C1.1", strand: "Algebra", summary: "Identify and describe patterns in geometric designs and in real life" },
  { code: "C1.2", strand: "Algebra", summary: "Create and translate patterns using shapes and numbers" },
  { code: "C1.3", strand: "Algebra", summary: "Determine pattern rules, extend patterns, and find missing elements" },
  { code: "C1.4", strand: "Algebra", summary: "Create and describe patterns showing relationships among numbers to 100" },
  { code: "C2.1", strand: "Algebra", summary: "Identify when symbols are being used as variables" },
  { code: "C2.2", strand: "Algebra", summary: "Determine what makes two expressions equivalent" },
  { code: "C2.3", strand: "Algebra", summary: "Identify and use equivalent relationships for whole numbers to 100" },
  { code: "C3.1", strand: "Algebra", summary: "Write and execute code, including sequential and concurrent events" },
  { code: "C3.2", strand: "Algebra", summary: "Read and alter existing code and describe how changes affect outcomes" },
  { code: "D1.1", strand: "Data", summary: "Sort by two attributes using tables and logic diagrams, including Venn and Carroll" },
  { code: "D1.2", strand: "Data", summary: "Collect data on two pieces of information in two-way tally tables" },
  { code: "D1.3", strand: "Data", summary: "Display data in concrete graphs, pictographs, line plots, and bar graphs with sources, titles, and labels" },
  { code: "D1.4", strand: "Data", summary: "Identify the mode and explain what it indicates" },
  { code: "D1.5", strand: "Data", summary: "Analyse data, draw conclusions, and make convincing arguments" },
  { code: "D2.1", strand: "Data", summary: "Use impossible, possible, and certain to describe likelihood" },
  { code: "D2.2", strand: "Data", summary: "Predict whether the mode holds for a different population" },
  { code: "E1.1", strand: "Spatial Sense", summary: "Sort two-dimensional shapes by sides, side lengths, angles, and lines of symmetry" },
  { code: "E1.2", strand: "Spatial Sense", summary: "Compose and decompose shapes and show that area is conserved" },
  { code: "E1.3", strand: "Spatial Sense", summary: "Identify congruent lengths and angles" },
  { code: "E1.4", strand: "Spatial Sense", summary: "Create and interpret simple maps of familiar places" },
  { code: "E1.5", strand: "Spatial Sense", summary: "Describe relative positions and the movements between them" },
  { code: "E2.1", strand: "Spatial Sense", summary: "Use non-standard units and describe the inverse relationship between unit size and count" },
  { code: "E2.2", strand: "Spatial Sense", summary: "Relate centimetres to metres and use benchmarks to estimate" },
  { code: "E2.3", strand: "Spatial Sense", summary: "Measure and draw in centimetres and metres, including from a non-zero start" },
  { code: "E2.4", strand: "Spatial Sense", summary: "Use units of time to describe the duration of events" },
  { code: "F1.1", strand: "Financial Literacy", summary: "Represent the same amount of money up to 200 cents and up to 200 dollars in different ways" },
];

/**
 * C4, mathematical modelling, is an overall expectation. The Ontario document
 * lists no specific expectations beneath it, so it is held apart rather than
 * counted among the thirty-nine above. Session 16A cites it, and without this
 * entry that citation pointed at nothing and was never checked.
 */
export const ontarioGrade2OverallExpectations: { code: string; strand: string; summary: string }[] = [
  { code: "C4", strand: "Algebra", summary: "Apply the process of mathematical modelling to represent, analyse, and make predictions about real-life situations" },
];

/** Sessions covering a given expectation code. */
export const coverageFor = (code: string) =>
  sessions.filter((session) => session.expectations.includes(code));

/** Expectations with no session attached. This should stay empty. */
export const uncoveredExpectations = ontarioGrade2Expectations
  .filter((expectation) => coverageFor(expectation.code).length === 0)
  .map((expectation) => expectation.code);
