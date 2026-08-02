export type SessionKind = "Core" | "Extension" | "Review";

export type Session = {
  id: string;
  unit: number;
  letter: "A" | "B";
  title: string;
  focus: string;
  activity: string;
  success: string;
  kind: SessionKind;
};

export const phases = [
  { name: "Number foundations", units: "Units 1 to 4", note: "Build meaning before procedures." },
  { name: "Taking numbers apart", units: "Units 5 to 8", note: "Subtraction, sharing, and halves." },
  { name: "Math in daily life", units: "Units 9 to 12", note: "Money, time, and planning." },
  { name: "Groups and wider thinking", units: "Units 13 to 16", note: "Arrays, data, patterns, and review." },
];

export const sessions: Session[] = [
  { id: "1A", unit: 1, letter: "A", title: "Bonds to ten", focus: "See ten as two parts and learn every partner pair.", activity: "Use ten frames, part-whole bars, and the rainbow of ten.", success: "Donia gives the partner of any number to 10 without counting up.", kind: "Core" },
  { id: "1B", unit: 1, letter: "B", title: "Three story shapes", focus: "Find a missing whole, missing part, or missing start.", activity: "Draw the same part-whole box for six different stories.", success: "She decides what is missing without relying on keywords.", kind: "Core" },
  { id: "2A", unit: 2, letter: "A", title: "Tens and ones", focus: "Compose and decompose numbers to 200.", activity: "Build two-digit numbers and trade one ten for ten ones.", success: "She represents one number in two different ways.", kind: "Core" },
  { id: "2B", unit: 2, letter: "B", title: "Charts and order", focus: "Compare, order, and locate numbers to 200.", activity: "Explore neighbours on 100 and 200 charts.", success: "She explains why one number is greater than another.", kind: "Core" },
  { id: "3A", unit: 3, letter: "A", title: "Ten more, ten less", focus: "Use place value to move mentally by tens.", activity: "Move on a number chart, then repeat without the chart.", success: "She changes the tens while tracking what happens to the ones.", kind: "Core" },
  { id: "3B", unit: 3, letter: "B", title: "Add ten, adjust", focus: "Choose an efficient mental addition strategy.", activity: "Solve 47 + 8 by adding ten and adjusting, then by making 50.", success: "She chooses a strategy and explains her route.", kind: "Core" },
  { id: "4A", unit: 4, letter: "A", title: "Regroup with objects", focus: "Understand ten ones as one ten.", activity: "Combine bundled sticks before writing any vertical calculation.", success: "She describes the trade in place-value language.", kind: "Core" },
  { id: "4B", unit: 4, letter: "B", title: "Add within 100", focus: "Represent and solve two-digit addition situations.", activity: "Use drawings, equations, and an optional written method.", success: "Her answer matches her estimate and concrete model.", kind: "Core" },
  { id: "5A", unit: 5, letter: "A", title: "Unbundle a ten", focus: "Trade one ten for ten ones in subtraction.", activity: "Model 52 minus 27 with bundled sticks.", success: "She explains why the number of tens changes.", kind: "Core" },
  { id: "5B", unit: 5, letter: "B", title: "Subtract and check", focus: "Solve subtraction within 100 and check by adding.", activity: "Use objects or drawings first, then an optional written method.", success: "She checks the difference independently.", kind: "Core" },
  { id: "6A", unit: 6, letter: "A", title: "Choose a method", focus: "Compare counting up with subtracting by place value.", activity: "Contrast 52 minus 47 with 52 minus 27.", success: "She selects a method because it suits the numbers.", kind: "Core" },
  { id: "6B", unit: 6, letter: "B", title: "Add or subtract?", focus: "Reason through mixed word problems.", activity: "Identify the whole and parts before choosing an operation.", success: "She justifies the operation before computing.", kind: "Core" },
  { id: "7A", unit: 7, letter: "A", title: "Half of even numbers", focus: "Connect fair sharing, doubles, and halves.", activity: "Share counters equally between two people.", success: "She uses a known double to explain a half.", kind: "Core" },
  { id: "7B", unit: 7, letter: "B", title: "Half with a leftover", focus: "See that an odd quantity can still be shared fairly.", activity: "Share items and divide the remaining item into two equal parts.", success: "She describes the result as a whole number and one half.", kind: "Core" },
  { id: "8A", unit: 8, letter: "A", title: "Half of two-digit numbers", focus: "Extend halving by separating tens and ones.", activity: "Split 48 into 40 and 8, then halve each part.", success: "She chooses the tens-and-ones split without prompting.", kind: "Extension" },
  { id: "8B", unit: 8, letter: "B", title: "Half of odd totals", focus: "Extend halving to two-digit odd numbers.", activity: "Use strips or counters before writing mixed-number answers.", success: "She can model the remaining one half physically.", kind: "Extension" },
  { id: "9A", unit: 9, letter: "A", title: "Canadian coins", focus: "Recognize coins and compare their values.", activity: "Sort real coins by value, not physical size.", success: "She identifies each coin and explains its value.", kind: "Core" },
  { id: "9B", unit: 9, letter: "B", title: "Equivalent amounts", focus: "Represent the same amount in different ways.", activity: "Make 60 cents using several coin combinations.", success: "She creates and verifies more than one combination.", kind: "Core" },
  { id: "10A", unit: 10, letter: "A", title: "Count up for change", focus: "Apply number sense to simple cash change.", activity: "Count from a price to the amount paid using real coins.", success: "She counts up and verifies the total paid.", kind: "Extension" },
  { id: "10B", unit: 10, letter: "B", title: "Home shop", focus: "Use money in a playful real-life setting.", activity: "Price household items, take turns as customer and cashier.", success: "She checks change with coins or addition.", kind: "Extension" },
  { id: "11A", unit: 11, letter: "A", title: "The hour hand", focus: "Read where the short hand has passed.", activity: "Cover the minute hand and reason about the hour.", success: "She names the hour it has passed, not the nearest numeral.", kind: "Extension" },
  { id: "11B", unit: 11, letter: "B", title: "Quarter-hour clocks", focus: "Connect quarters and halves to an analogue clock.", activity: "Set and read o'clock, half past, quarter past, and quarter to.", success: "She explains why 3:45 is quarter to four.", kind: "Extension" },
  { id: "12A", unit: 12, letter: "A", title: "Plan a Saturday", focus: "Combine money, duration, and decision-making.", activity: "Plan activities using a small budget and simple durations.", success: "She explains both her schedule and spending choices.", kind: "Review" },
  { id: "12B", unit: 12, letter: "B", title: "Learning check", focus: "Review Units 1 through 11 without a timer.", activity: "Use the results to choose what to repeat, not to assign a score.", success: "You can identify what is secure and what needs another example.", kind: "Review" },
  { id: "13A", unit: 13, letter: "A", title: "Equal groups", focus: "Represent repeated equal groups.", activity: "Build, draw, and skip-count groups of equal size.", success: "She finds the total without counting every object by ones.", kind: "Core" },
  { id: "13B", unit: 13, letter: "B", title: "Rows and columns", focus: "Explore arrays as organized equal groups.", activity: "Count the same array by rows and by columns.", success: "She explains why both counts produce the same total.", kind: "Core" },
  { id: "14A", unit: 14, letter: "A", title: "Fair sharing", focus: "Share quantities among two, three, four, or six people.", activity: "Use counters and discuss equal shares and leftovers.", success: "She checks that every share is equal.", kind: "Core" },
  { id: "14B", unit: 14, letter: "B", title: "Odd, even, skip count", focus: "Recognize parity and count by useful intervals.", activity: "Pair counters, predict leftovers, then count by 2, 5, 10, and 25.", success: "She predicts odd or even before building the pairs.", kind: "Core" },
  { id: "15A", unit: 15, letter: "A", title: "Tally and graph", focus: "Collect, display, and interpret real data.", activity: "Ask a household question and build a bar graph.", success: "She answers comparison questions using her graph.", kind: "Core" },
  { id: "15B", unit: 15, letter: "B", title: "Patterns and chance", focus: "Describe pattern rules and probability words.", activity: "Continue growing patterns and discuss certain, possible, and impossible events.", success: "She states the rule rather than only the next number.", kind: "Core" },
  { id: "16A", unit: 16, letter: "A", title: "Whole-course review", focus: "Show what is secure across the complete plan.", activity: "Complete a mixed, untimed review independently.", success: "Donia can name strengths and choose what to practise next.", kind: "Review" },
  { id: "16B", unit: 16, letter: "B", title: "Five-minute clocks", focus: "Optional clock-reading extension.", activity: "Skip-count around a clock and set times to five minutes.", success: "She reads the minute hand without losing track of the hour.", kind: "Extension" },
];

export const weeklyUnits = Array.from({ length: 16 }, (_, index) => ({
  week: index + 1,
  sessions: sessions.filter((session) => session.unit === index + 1),
}));

export const unitNames = [
  "Bonds to ten and part-whole thinking",
  "Place value to 200",
  "Mental addition",
  "Addition within 100",
  "Subtraction within 100",
  "Choosing strategies",
  "Fair sharing and halves",
  "Two-digit halving",
  "Canadian money",
  "Making change",
  "Reading clocks",
  "Apply and review",
  "Equal groups and arrays",
  "Sharing, odd and even",
  "Data, patterns and chance",
  "Review and next steps",
];
