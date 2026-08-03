/**
 * Content spec for generated worksheets.
 *
 * Each entry becomes one printable sheet. The generator in
 * scripts/build-worksheets.mjs wraps this in the standard MathNest shell, so
 * only the exercise bodies live here.
 *
 * Useful markup:
 *   <div class="qg c2"><div class="q">…</div></div>   two-column question grid
 *   <span class="bl"></span>                          writing line
 *   <span class="bl s"></span>                        short writing line
 *   <div class="grid-paper"></div>                    squared working space
 *   <div class="writebox"></div>                      blank working box
 *   <p class="ex-h">…</p>                             hint or example line
 *
 * Answers are parsed by the sheet's own answer-toggle script, which matches
 * "1." "2." "3." groups to the numbered exercises.
 */

const grid = '<div class="grid-paper"></div>';
const box = '<div class="writebox"></div>';

export const worksheetContent = [
  // ============================================================ Unit 02
  {
    unit: 2,
    letter: "C",
    title: "Estimate, then count",
    intro: "A good guess is not a lucky guess. Group first, then count in jumps.",
    expectations: ["B1.3", "B1.4"],
    exercises: [
      {
        prompt: "Guess first. Do not count yet.",
        hint: "Look at the pile for three seconds only, then write your guess. A guess is allowed to be wrong.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Pile A, my guess: <span class="bl"></span></div>' +
          '<div class="q">Pile A, real count: <span class="bl"></span></div>' +
          '<div class="q">Pile B, my guess: <span class="bl"></span></div>' +
          '<div class="q">Pile B, real count: <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Count by 20s. Write the numbers you land on.",
        body:
          '<div class="qg c2">' +
          '<div class="q">20, 40, <span class="bl s"></span>, <span class="bl s"></span>, <span class="bl s"></span>, <span class="bl s"></span></div>' +
          '<div class="q">120, 140, <span class="bl s"></span>, <span class="bl s"></span>, <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Count by 25s, then by 50s.",
        hint: "These two are worth knowing by heart. Quarters and half dollars use them every day.",
        body:
          '<div class="qg c2">' +
          '<div class="q">25, 50, <span class="bl s"></span>, <span class="bl s"></span>, <span class="bl s"></span>, <span class="bl s"></span></div>' +
          '<div class="q">50, 100, <span class="bl s"></span>, <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Which grouping made counting fastest? Draw the groups you used and say why.",
        body: grid,
      },
    ],
    parentNoteTitle: "Why the guess comes first",
    parentNote:
      "Estimating is a skill, not a personality trait. The child who guesses 200 for a pile of 60 has not failed, they have not yet built a benchmark. Show them a group of ten, then ask them to guess again. The second guess is the one that teaches.",
    moveOn:
      "The student chooses a grouping that makes the count faster, and explains why that grouping helped.",
    answers:
      "<b>2.</b> 60, 80, 100, 120 &nbsp; and &nbsp; 160, 180, 200 &nbsp; <b>3.</b> 75, 100, 125, 150 &nbsp; and &nbsp; 150, 200",
  },

  // ============================================================ Unit 09
  {
    unit: 9,
    letter: "A",
    title: "Sides and angles",
    intro: "Sort shapes by what is true about them, not by what they remind you of.",
    expectations: ["E1.1"],
    exercises: [
      {
        prompt: "Count the sides. Then count the corners.",
        hint: "A corner is where two sides meet. It is also called an angle.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Triangle: <span class="bl s"></span> sides, <span class="bl s"></span> corners</div>' +
          '<div class="q">Square: <span class="bl s"></span> sides, <span class="bl s"></span> corners</div>' +
          '<div class="q">Pentagon: <span class="bl s"></span> sides, <span class="bl s"></span> corners</div>' +
          '<div class="q">Hexagon: <span class="bl s"></span> sides, <span class="bl s"></span> corners</div>' +
          '<div class="q">Rectangle: <span class="bl s"></span> sides, <span class="bl s"></span> corners</div>' +
          '<div class="q">Octagon: <span class="bl s"></span> sides, <span class="bl s"></span> corners</div>' +
          "</div>",
      },
      {
        prompt: "Sort your cut-out shapes two ways. Write the rule you used each time.",
        hint: "Good rules sound like: all sides the same length, or has a square corner. Not: looks pointy.",
        body:
          '<div class="qg c2">' +
          '<div class="q">My first rule: <span class="bl"></span></div>' +
          '<div class="q">My second rule: <span class="bl"></span></div>' +
          "</div>" +
          box,
      },
      {
        prompt: "True or false? Write T or F, then explain one of them out loud.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Every square is a rectangle. <span class="bl s"></span></div>' +
          '<div class="q">Every rectangle is a square. <span class="bl s"></span></div>' +
          '<div class="q">A triangle can have a square corner. <span class="bl s"></span></div>' +
          '<div class="q">A hexagon always has equal sides. <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Draw a four-sided shape that is NOT a square and NOT a rectangle.",
        body: grid,
      },
    ],
    parentNoteTitle: "Watch for the tilted square",
    parentNote:
      "Turn a square 45 degrees and many children will call it a diamond and insist it is a different shape. That is the whole point of sorting by properties. Ask them to count the sides and check the corners, then ask again what it is.",
    moveOn: "The student sorts by a property and can name the property, not just the finished piles.",
    answers:
      "<b>1.</b> 3/3, 4/4, 5/5, 6/6, 4/4, 8/8 &nbsp; <b>3.</b> T, F, T, F",
  },
  {
    unit: 9,
    letter: "B",
    title: "Lines of symmetry",
    intro: "A line of symmetry is a fold where both halves land exactly on top of each other.",
    expectations: ["E1.1"],
    exercises: [
      {
        prompt: "Fold each paper shape. How many folds match exactly?",
        hint: "Test every fold. A fold that is close but not exact does not count.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Square: <span class="bl s"></span> lines</div>' +
          '<div class="q">Rectangle: <span class="bl s"></span> lines</div>' +
          '<div class="q">Equal-sided triangle: <span class="bl s"></span> lines</div>' +
          '<div class="q">Circle: <span class="bl s"></span> lines</div>' +
          '<div class="q">Letter A: <span class="bl s"></span> lines</div>' +
          '<div class="q">Letter R: <span class="bl s"></span> lines</div>' +
          "</div>",
      },
      {
        prompt: "Draw every line of symmetry you can find on these shapes.",
        body: grid,
      },
      {
        prompt: "Draw the missing half so the whole picture is symmetrical.",
        body: grid,
      },
      {
        prompt: "Find one symmetrical thing in the house. Draw it and mark the fold line.",
        body: box,
      },
    ],
    parentNoteTitle: "Folding beats looking",
    parentNote:
      "Children guess symmetry from appearance and are often wrong, especially with rectangles, where they want to claim the diagonals. Cut a rectangle from paper, fold it corner to corner, and let them see the overhang. One demonstration settles it better than any explanation.",
    moveOn: "The student tests a fold before claiming it is a line of symmetry.",
    answers: "<b>1.</b> 4, 2, 3, many (infinite), 1, 0",
  },

  // ============================================================ Unit 10
  {
    unit: 10,
    letter: "A",
    title: "Build and break shapes",
    intro: "Move the pieces around. The amount of space stays the same.",
    expectations: ["E1.2"],
    exercises: [
      {
        prompt: "Use pattern blocks or paper triangles. How many small pieces cover each shape?",
        body:
          '<div class="qg c2">' +
          '<div class="q">Triangles to cover one rhombus: <span class="bl s"></span></div>' +
          '<div class="q">Triangles to cover one trapezoid: <span class="bl s"></span></div>' +
          '<div class="q">Triangles to cover one hexagon: <span class="bl s"></span></div>' +
          '<div class="q">Rhombuses to cover one hexagon: <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Make one shape, then break it apart and rebuild it as a different shape.",
        hint: "Use exactly the same pieces both times. Do not add or remove any.",
        body: grid,
      },
      {
        prompt: "Answer in your own words.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Did the number of pieces change? <span class="bl s"></span></div>' +
          '<div class="q">Did the amount of space change? <span class="bl s"></span></div>' +
          "</div>" +
          box,
      },
      {
        prompt: "Cover this rectangle two different ways. Draw both.",
        body: grid,
      },
    ],
    parentNoteTitle: "The idea underneath",
    parentNote:
      "This is conservation of area, and it is the foundation for everything from multiplication arrays to fractions. The sentence to fish for is some version of: it is still the same amount, it just looks different. Say it back to them in those words when they get close.",
    moveOn: "The student says the amount of space is unchanged when the pieces are rearranged.",
    answers: "<b>1.</b> 2, 3, 6, 3",
  },
  {
    unit: 10,
    letter: "B",
    title: "Same or not the same",
    intro: "Congruent means the same size and the same shape. Turning it does not change that.",
    expectations: ["E1.3"],
    exercises: [
      {
        prompt: "Predict first, then check by placing one shape on top of the other.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Pair 1, my guess: <span class="bl s"></span> check: <span class="bl s"></span></div>' +
          '<div class="q">Pair 2, my guess: <span class="bl s"></span> check: <span class="bl s"></span></div>' +
          '<div class="q">Pair 3, my guess: <span class="bl s"></span> check: <span class="bl s"></span></div>' +
          '<div class="q">Pair 4, my guess: <span class="bl s"></span> check: <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Draw a shape. Then draw one congruent to it, but turned.",
        body: grid,
      },
      {
        prompt: "Draw a shape that is the same shape but a different size. Is it congruent?",
        body: grid,
      },
      {
        prompt: "Find two congruent things in this room. Write them down and say how you checked.",
        body: box,
      },
    ],
    parentNoteTitle: "Turning is allowed",
    parentNote:
      "The common error is deciding two shapes are different because one is rotated. Cut two identical shapes, turn one, and hand both to the child. Let them stack them. Physical matching is the whole method at this age.",
    moveOn: "The student checks a prediction by matching physically instead of guessing from a distance.",
    answers: "",
  },

  // ============================================================ Unit 11
  {
    unit: 11,
    letter: "A",
    title: "Units you can hold",
    intro: "Measure the same thing twice, with two different units. Watch what happens to the number.",
    expectations: ["E2.1"],
    exercises: [
      {
        prompt: "Measure the table three ways. Lay the units end to end with no gaps.",
        body:
          '<div class="qg c2">' +
          '<div class="q">In paper clips: <span class="bl s"></span></div>' +
          '<div class="q">In hand spans: <span class="bl s"></span></div>' +
          '<div class="q">In shoe lengths: <span class="bl s"></span></div>' +
          '<div class="q">Which needed the most? <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Predict before you measure.",
        hint: "Smaller unit, bigger number. Bigger unit, smaller number. Say it out loud before you check.",
        body:
          '<div class="qg c2">' +
          '<div class="q">The door in hand spans, guess: <span class="bl s"></span> real: <span class="bl s"></span></div>' +
          '<div class="q">The door in shoe lengths, guess: <span class="bl s"></span> real: <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Two people measured the same shelf. One said 8, one said 20. Can both be right? Explain.",
        body: box,
      },
      {
        prompt: "Measure one object with gaps between the units, then again with no gaps. What changed?",
        body: box,
      },
    ],
    parentNoteTitle: "The inverse relationship",
    parentNote:
      "This is the single idea of the session: as the unit gets smaller, the count gets bigger. It sounds backwards to a seven year old. Do not explain it, demonstrate it twice and let them state it themselves.",
    moveOn: "The student predicts that a smaller unit will need more of them, before measuring.",
    answers: "",
  },
  {
    unit: 11,
    letter: "B",
    title: "Centimetres and metres",
    intro: "One metre is one hundred centimetres. Find both on your own body first.",
    expectations: ["E2.2"],
    exercises: [
      {
        prompt: "Find your personal benchmarks.",
        hint: "Most fingernails are about one centimetre wide. A big step is about one metre.",
        body:
          '<div class="qg c2">' +
          '<div class="q">My one centimetre is: <span class="bl"></span></div>' +
          '<div class="q">My one metre is: <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Would you measure this in centimetres or metres? Circle or write your choice.",
        body:
          '<div class="qg c2">' +
          '<div class="q">A pencil: <span class="bl s"></span></div>' +
          '<div class="q">The hallway: <span class="bl s"></span></div>' +
          '<div class="q">A spoon: <span class="bl s"></span></div>' +
          '<div class="q">The car: <span class="bl s"></span></div>' +
          '<div class="q">Your thumb: <span class="bl s"></span></div>' +
          '<div class="q">The garden: <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Estimate in the sensible unit, then measure.",
        body:
          '<div class="qg c2">' +
          '<div class="q">A fork, guess: <span class="bl s"></span> real: <span class="bl s"></span></div>' +
          '<div class="q">A book, guess: <span class="bl s"></span> real: <span class="bl s"></span></div>' +
          '<div class="q">Your bed, guess: <span class="bl s"></span> real: <span class="bl s"></span></div>' +
          '<div class="q">A window, guess: <span class="bl s"></span> real: <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Fill in the missing numbers.",
        body:
          '<div class="qg c2">' +
          '<div class="q">1 metre = <span class="bl s"></span> cm</div>' +
          '<div class="q">2 metres = <span class="bl s"></span> cm</div>' +
          '<div class="q">50 cm is half of <span class="bl s"></span> metre</div>' +
          '<div class="q">300 cm = <span class="bl s"></span> metres</div>' +
          "</div>",
      },
    ],
    parentNoteTitle: "Estimate before every measurement",
    parentNote:
      "The estimate is not a warm-up, it is the learning. A child who estimates the hallway at 4 centimetres does not yet have a benchmark. Walk it out in big steps together and try again the next day.",
    moveOn: "The student names a sensible unit before reaching for the measuring tape.",
    answers: "<b>4.</b> 100, 200, 1, 3",
  },
  {
    unit: 11,
    letter: "C",
    title: "The broken ruler",
    intro: "The number at the end is not always the answer. Check where the object starts.",
    expectations: ["E2.3"],
    exercises: [
      {
        prompt: "Each object starts at 0. Write its length.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Starts at 0, ends at 7: <span class="bl s"></span> cm</div>' +
          '<div class="q">Starts at 0, ends at 12: <span class="bl s"></span> cm</div>' +
          "</div>",
      },
      {
        prompt: "Now the objects do NOT start at 0. Write the real length.",
        hint: "Count the spaces, or take the start number away from the end number.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Starts at 3, ends at 10: <span class="bl s"></span> cm</div>' +
          '<div class="q">Starts at 2, ends at 9: <span class="bl s"></span> cm</div>' +
          '<div class="q">Starts at 5, ends at 14: <span class="bl s"></span> cm</div>' +
          '<div class="q">Starts at 6, ends at 6: <span class="bl s"></span> cm</div>' +
          '<div class="q">Starts at 4, ends at 20: <span class="bl s"></span> cm</div>' +
          '<div class="q">Starts at 11, ends at 19: <span class="bl s"></span> cm</div>' +
          "</div>",
      },
      {
        prompt: "Draw a line exactly this long. Use a ruler.",
        body:
          '<div class="qg c2">' +
          '<div class="q">6 cm</div>' +
          '<div class="q">11 cm</div>' +
          '<div class="q">3 cm</div>' +
          '<div class="q">14 cm</div>' +
          "</div>" +
          grid,
      },
      {
        prompt: "Measure three things in the room. Write the object and its length in centimetres.",
        body: box,
      },
    ],
    parentNoteTitle: "Why this sheet exists",
    parentNote:
      "Reading the end number instead of the length is the most common measuring error in Grade 2, and it shows up on assessments. Slide a pencil so it starts at the 3 and ask how long it is. If they say the end number, count the spaces together one at a time.",
    moveOn: "The student accounts for the starting point instead of reading the end number.",
    answers: "<b>1.</b> 7, 12 &nbsp; <b>2.</b> 7, 7, 9, 0, 16, 8",
  },

  // ============================================================ Unit 12
  {
    unit: 12,
    letter: "A",
    title: "Map the home",
    intro: "A map shows a place from above. Everything keeps its position.",
    expectations: ["E1.4"],
    exercises: [
      {
        prompt: "Draw a map of one room from above. Mark the door, the window, and three objects.",
        hint: "Looking down from the ceiling. A chair becomes a small square, not a picture of a chair.",
        body: grid,
      },
      {
        prompt: "Hide an object. Mark it on your map with an X. Ask someone to find it using only the map.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Did they find it? <span class="bl s"></span></div>' +
          '<div class="q">What was confusing on the map? <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Use your map. Answer with near, beside, between, in front of, or behind.",
        body:
          '<div class="qg c2">' +
          '<div class="q">The door is <span class="bl"></span> the window.</div>' +
          '<div class="q">The X is <span class="bl"></span> two objects.</div>' +
          "</div>",
      },
      {
        prompt: "Draw a map of the walk from your front door to your bedroom.",
        body: grid,
      },
    ],
    parentNoteTitle: "From above is the hard part",
    parentNote:
      "Most children draw a side view the first time, with chairs standing up. Hold your phone above the table and show them the photo. That one image usually does it. Do not correct the map's proportions, only its positions.",
    moveOn: "The student places objects in the correct relative positions, even if the drawing is rough.",
    answers: "",
  },
  {
    unit: 12,
    letter: "B",
    title: "Routes and directions",
    intro: "Give directions clearly enough that another person can follow them with their eyes closed.",
    expectations: ["E1.5"],
    exercises: [
      {
        prompt: "Write a route from the kitchen to the front door. One instruction per line.",
        hint: "Use forward, left, right, and quarter turn. Say how many steps.",
        body: box,
      },
      {
        prompt: "Someone else follows your route exactly. Where did they end up?",
        body:
          '<div class="qg c2">' +
          '<div class="q">They ended at: <span class="bl"></span></div>' +
          '<div class="q">Which step needed fixing? <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Follow this route on the grid. Mark where you finish.",
        hint: "Start at the bottom left corner, facing up. Forward 3. Quarter turn right. Forward 2. Quarter turn left. Forward 1.",
        body: grid,
      },
      {
        prompt: "Describe where the marked square is, using two different position words.",
        body:
          '<div class="qg c2">' +
          '<div class="q">First way: <span class="bl"></span></div>' +
          '<div class="q">Second way: <span class="bl"></span></div>' +
          "</div>",
      },
    ],
    parentNoteTitle: "Follow it wrongly on purpose",
    parentNote:
      "If an instruction says turn, turn the wrong way. If it says go, take one enormous step. Being followed literally is what teaches precision, and it is funny, which keeps the session light. This session is also the best possible preparation for the coding unit.",
    moveOn: "The student gives a route another person can follow without asking for extra hints.",
    answers: "",
  },

  // ============================================================ Unit 15
  {
    unit: 15,
    letter: "A",
    title: "How long does it take?",
    intro: "Some things take seconds, some take minutes, some take hours. Pick the unit that fits.",
    expectations: ["E2.4"],
    exercises: [
      {
        prompt: "Seconds, minutes, or hours? Write the unit that fits best.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Brushing teeth: <span class="bl s"></span></div>' +
          '<div class="q">A night of sleep: <span class="bl s"></span></div>' +
          '<div class="q">Clapping once: <span class="bl s"></span></div>' +
          '<div class="q">Eating dinner: <span class="bl s"></span></div>' +
          '<div class="q">A school day: <span class="bl s"></span></div>' +
          '<div class="q">Tying a shoe: <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Time it. Guess first, then use a timer.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Write your name, guess: <span class="bl s"></span> real: <span class="bl s"></span></div>' +
          '<div class="q">Walk to the door, guess: <span class="bl s"></span> real: <span class="bl s"></span></div>' +
          '<div class="q">Count to 20, guess: <span class="bl s"></span> real: <span class="bl s"></span></div>' +
          '<div class="q">Tidy the table, guess: <span class="bl s"></span> real: <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Put these in order, shortest first. Write 1 to 5.",
        body:
          '<div class="qg c2">' +
          '<div class="q">A sneeze <span class="bl s"></span></div>' +
          '<div class="q">A car trip to Toronto <span class="bl s"></span></div>' +
          '<div class="q">A song <span class="bl s"></span></div>' +
          '<div class="q">A cartoon episode <span class="bl s"></span></div>' +
          '<div class="q">A hug <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Measure something using a non-standard unit of time. How many claps does it take?",
        hint: "Claps, breaths, or hums all work. Keep the beat steady.",
        body: box,
      },
    ],
    parentNoteTitle: "Duration is the Grade 2 expectation",
    parentNote:
      "How long something lasts is the assessed skill. Reading a clock face is useful but sits in the extension sessions that follow. Do this one first, even if the child can already read a clock.",
    moveOn: "The student chooses a sensible unit for the length of an event.",
    answers:
      "<b>1.</b> minutes, hours, seconds, minutes, hours, seconds &nbsp; <b>3.</b> sneeze 1, hug 2, song 3, cartoon 4, car trip 5",
  },

  // ============================================================ Unit 17
  {
    unit: 17,
    letter: "A",
    title: "Patterns around us",
    intro: "Every pattern has a part that repeats. Find that part and you have found the pattern.",
    expectations: ["C1.1"],
    exercises: [
      {
        prompt: "Circle the part that repeats, then say how many items are in it.",
        body:
          '<div class="qg c2">' +
          '<div class="q">red, blue, red, blue, red, blue &nbsp; repeat = <span class="bl s"></span></div>' +
          '<div class="q">up, up, down, up, up, down &nbsp; repeat = <span class="bl s"></span></div>' +
          '<div class="q">A, B, B, C, A, B, B, C &nbsp; repeat = <span class="bl s"></span></div>' +
          '<div class="q">circle, square, circle, square &nbsp; repeat = <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Pattern hunt. Find four patterns in the house and draw the repeating part of each.",
        hint: "Try tiles, brick walls, fabric, fences, and railings.",
        body: grid,
      },
      {
        prompt: "Make a pattern with objects on the table. Ask someone to name the repeating part.",
        body:
          '<div class="qg c2">' +
          '<div class="q">My repeating part: <span class="bl"></span></div>' +
          '<div class="q">Did they get it right? <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Draw a pattern that repeats every three items.",
        body: grid,
      },
    ],
    parentNoteTitle: "Name the core, not the whole",
    parentNote:
      "Children point at the whole design and say that is the pattern. Press them: which bit keeps coming back? The repeating part is called the core, and naming it is what makes the next session possible.",
    moveOn: "The student names the repeating part rather than pointing at the whole design.",
    answers: "<b>1.</b> 2, 3, 4, 2",
  },
  {
    unit: 17,
    letter: "B",
    title: "Same pattern, new clothes",
    intro: "One pattern can be shown with shapes, with numbers, with sounds, or with movements.",
    expectations: ["C1.2"],
    exercises: [
      {
        prompt: "Translate this pattern into two more forms.",
        hint: "Shape pattern: circle, circle, square, circle, circle, square.",
        body:
          '<div class="qg c2">' +
          '<div class="q">As letters: <span class="bl"></span></div>' +
          '<div class="q">As numbers: <span class="bl"></span></div>' +
          '<div class="q">As sounds: <span class="bl"></span></div>' +
          '<div class="q">As movements: <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Two patterns look different. Are they the same pattern? Write yes or no and say why.",
        body:
          '<div class="qg c2">' +
          '<div class="q">A B A B and 1 2 1 2: <span class="bl s"></span></div>' +
          '<div class="q">A A B and 1 1 2: <span class="bl s"></span></div>' +
          '<div class="q">A B C and 1 2 1: <span class="bl s"></span></div>' +
          '<div class="q">clap clap stomp and A A B: <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Make your own pattern with shapes, then write the same pattern with numbers.",
        body: grid,
      },
      {
        prompt: "Explain in your own words how two different-looking patterns can be the same pattern.",
        body: box,
      },
    ],
    parentNoteTitle: "This is early algebra",
    parentNote:
      "Recognizing that AAB and 112 are the same structure is abstraction, and it is the same move that later lets a child see that 3 + n works like 3 + 5. Take it slowly and celebrate the moment they see it.",
    moveOn: "The student explains why two different-looking patterns are the same pattern.",
    answers: "<b>2.</b> yes, yes, no, yes",
  },

  {
    unit: 17,
    letter: "C",
    title: "Find the rule",
    intro: "A rule tells you how to get the next one. With a rule you can jump ahead.",
    expectations: ["C1.3"],
    exercises: [
      {
        prompt: "Keep the pattern going, then write the rule.",
        body:
          '<div class="qg c2">' +
          '<div class="q">2, 5, 8, 11, <span class="bl s"></span>, <span class="bl s"></span> &nbsp; rule: <span class="bl"></span></div>' +
          '<div class="q">4, 8, 12, 16, <span class="bl s"></span>, <span class="bl s"></span> &nbsp; rule: <span class="bl"></span></div>' +
          '<div class="q">100, 90, 80, <span class="bl s"></span>, <span class="bl s"></span> &nbsp; rule: <span class="bl"></span></div>' +
          '<div class="q">5, 10, 15, 20, <span class="bl s"></span>, <span class="bl s"></span> &nbsp; rule: <span class="bl"></span></div>' +
          '<div class="q">1, 3, 5, 7, <span class="bl s"></span>, <span class="bl s"></span> &nbsp; rule: <span class="bl"></span></div>' +
          '<div class="q">50, 45, 40, <span class="bl s"></span>, <span class="bl s"></span> &nbsp; rule: <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "The gap is in the middle this time. Fill it in.",
        hint: "Work forwards from the left, or backwards from the right. Both work. Try both.",
        body:
          '<div class="qg c2">' +
          '<div class="q">3, 6, <span class="bl s"></span>, 12, 15</div>' +
          '<div class="q">20, <span class="bl s"></span>, 30, 35, 40</div>' +
          '<div class="q">7, 14, 21, <span class="bl s"></span>, 35</div>' +
          '<div class="q">90, 80, <span class="bl s"></span>, 60, 50</div>' +
          '<div class="q">circle, square, <span class="bl s"></span>, square, circle</div>' +
          '<div class="q">A, B, B, <span class="bl s"></span>, B, B, A</div>' +
          "</div>",
      },
      {
        prompt: "Jump ahead. Do not write every step.",
        hint: "Use the rule. Counting one by one is allowed, but see if you can beat it.",
        body:
          '<div class="qg c2">' +
          '<div class="q">2, 4, 6, 8 … what is the 10th number? <span class="bl s"></span></div>' +
          '<div class="q">5, 10, 15 … what is the 8th number? <span class="bl s"></span></div>' +
          '<div class="q">In red, blue, red, blue … what colour is 12th? <span class="bl"></span></div>' +
          '<div class="q">In A, B, C, A, B, C … what letter is 9th? <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Draw a repeating pattern, then a growing pattern. Write the rule under each.",
        hint: "A repeating pattern loops. A growing pattern gets bigger by the same amount each time.",
        body: grid,
      },
    ],
    parentNoteTitle: "Forwards and backwards",
    parentNote:
      "Question 2 is the one that matters. A child who can only work left to right has memorised a procedure. A child who can fill a middle gap from either direction has understood the rule. Ask them to check their answer from the other end.",
    moveOn: "The student states the rule rather than only the next number.",
    answers:
      "<b>1.</b> 14, 17 add 3 &nbsp; 20, 24 add 4 &nbsp; 70, 60 take 10 &nbsp; 25, 30 add 5 &nbsp; 9, 11 add 2 &nbsp; 35, 30 take 5 &nbsp; " +
      "<b>2.</b> 9, 25, 28, 70, circle, A &nbsp; <b>3.</b> 20, 40, blue, C",
  },

  // ============================================================ Unit 18
  {
    unit: 18,
    letter: "A",
    title: "Number patterns to 100",
    intro: "Colour a hundred chart and the patterns show themselves.",
    expectations: ["C1.4"],
    exercises: [
      {
        prompt: "Colour the counting by 5s squares. Describe what you see.",
        body:
          '<div class="qg c2">' +
          '<div class="q">The colours make: <span class="bl"></span></div>' +
          '<div class="q">Every coloured number ends in: <span class="bl"></span></div>' +
          "</div>" +
          grid,
      },
      {
        prompt: "Continue each pattern and write the rule.",
        body:
          '<div class="qg c2">' +
          '<div class="q">4, 8, 12, <span class="bl s"></span>, <span class="bl s"></span> &nbsp; rule: <span class="bl"></span></div>' +
          '<div class="q">100, 90, 80, <span class="bl s"></span>, <span class="bl s"></span> &nbsp; rule: <span class="bl"></span></div>' +
          '<div class="q">3, 6, 9, <span class="bl s"></span>, <span class="bl s"></span> &nbsp; rule: <span class="bl"></span></div>' +
          '<div class="q">1, 3, 6, 10, <span class="bl s"></span> &nbsp; rule: <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Predict without counting every step.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Counting by 10 from 0, is 70 in the pattern? <span class="bl s"></span></div>' +
          '<div class="q">Counting by 5 from 0, is 43 in the pattern? <span class="bl s"></span></div>' +
          '<div class="q">Counting by 2 from 0, is 99 in the pattern? <span class="bl s"></span></div>' +
          '<div class="q">Counting by 25 from 0, is 75 in the pattern? <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Make a number pattern of your own. Leave one gap for someone else to fill.",
        body: box,
      },
    ],
    parentNoteTitle: "Prediction, not recitation",
    parentNote:
      "The goal is not to chant the sequence. It is to answer is 43 in the fives without counting to 43. If they can say numbers in the fives end in 5 or 0, they have found a rule and used it.",
    moveOn: "The student predicts a later number without filling in every step.",
    answers:
      "<b>2.</b> 16, 20 (add 4) &nbsp; 70, 60 (subtract 10) &nbsp; 12, 15 (add 3) &nbsp; 15 (add one more each time) &nbsp; <b>3.</b> yes, no, no, yes",
  },
  {
    unit: 18,
    letter: "B",
    title: "Different names, same number",
    intro: "Forty has many names. All of them are true at once.",
    expectations: ["C2.3"],
    exercises: [
      {
        prompt: "Write six true ways to name 40.",
        hint: "Try adding, subtracting, and grouping. 20 + 20 counts. So does 4 tens.",
        body: box,
      },
      {
        prompt: "True or false? Write T or F.",
        body:
          '<div class="qg c2">' +
          '<div class="q">30 + 10 = 40 <span class="bl s"></span></div>' +
          '<div class="q">50 - 10 = 40 <span class="bl s"></span></div>' +
          '<div class="q">4 + 0 = 40 <span class="bl s"></span></div>' +
          '<div class="q">20 + 20 = 40 <span class="bl s"></span></div>' +
          '<div class="q">39 + 1 = 40 <span class="bl s"></span></div>' +
          '<div class="q">14 + 26 = 40 <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Fill in a number that makes each statement true.",
        body:
          '<div class="qg c2">' +
          '<div class="q">25 + <span class="bl s"></span> = 40</div>' +
          '<div class="q">60 - <span class="bl s"></span> = 40</div>' +
          '<div class="q">40 = 15 + <span class="bl s"></span></div>' +
          '<div class="q">40 = <span class="bl s"></span> + 33</div>' +
          "</div>",
      },
      {
        prompt: "Pick your own number under 100. Write five true names for it.",
        body: box,
      },
    ],
    parentNoteTitle: "The equals sign is not a doorbell",
    parentNote:
      "Many children read = as now write the answer. Statements like 40 = 15 + 25 feel wrong to them. Reading these aloud, with the number on the left, is quietly one of the most useful things you can do this year.",
    moveOn: "The student judges a statement as true or false and explains why.",
    answers: "<b>2.</b> T, T, F, T, T, T &nbsp; <b>3.</b> 15, 20, 25, 7",
  },

  // ============================================================ Unit 19
  {
    unit: 19,
    letter: "A",
    title: "What does the symbol stand for?",
    intro: "Sometimes a shape or a letter is standing in for a number we do not know yet.",
    expectations: ["C2.1"],
    exercises: [
      {
        prompt: "Find the number the shape is hiding.",
        body:
          '<div class="qg c2">' +
          '<div class="q">▲ + 3 = 10, so ▲ = <span class="bl s"></span></div>' +
          '<div class="q">7 + ● = 12, so ● = <span class="bl s"></span></div>' +
          '<div class="q">■ - 4 = 6, so ■ = <span class="bl s"></span></div>' +
          '<div class="q">20 - ★ = 15, so ★ = <span class="bl s"></span></div>' +
          '<div class="q">n + n = 14, so n = <span class="bl s"></span></div>' +
          '<div class="q">k + k + k = 12, so k = <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "In each line, does the symbol stand for one number, or can it be many? Write one or many.",
        hint: "▲ + 3 = 10 has one answer. ▲ + ● = 10 has many.",
        body:
          '<div class="qg c2">' +
          '<div class="q">▲ + 5 = 9 <span class="bl s"></span></div>' +
          '<div class="q">▲ + ● = 9 <span class="bl s"></span></div>' +
          '<div class="q">▲ - 2 = 8 <span class="bl s"></span></div>' +
          '<div class="q">▲ + ▲ = 8 <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Write a puzzle of your own with a hidden shape. Give it to someone to solve.",
        body: box,
      },
      {
        prompt: "In ▲ + ▲ = 8, why must both triangles be the same number?",
        body: box,
      },
    ],
    parentNoteTitle: "Same symbol, same value",
    parentNote:
      "The rule that matters is that the same symbol holds the same number everywhere in one puzzle. Children often let the two triangles be different. Ask them to explain their answer and the error usually surfaces on its own.",
    moveOn: "The student explains that the symbol holds one unknown number.",
    answers: "<b>1.</b> 7, 5, 10, 5, 7, 4 &nbsp; <b>2.</b> one, many, one, one",
  },
  {
    unit: 19,
    letter: "B",
    title: "Balance both sides",
    intro: "The equals sign means both sides weigh the same. Keep the scale level.",
    expectations: ["C2.2"],
    exercises: [
      {
        prompt: "Make both sides equal.",
        hint: "Work out the side you can, then ask what the other side needs.",
        body:
          '<div class="qg c2">' +
          '<div class="q">7 + 5 = <span class="bl s"></span> + 4</div>' +
          '<div class="q">6 + 6 = 10 + <span class="bl s"></span></div>' +
          '<div class="q">9 + 3 = <span class="bl s"></span> + 2</div>' +
          '<div class="q">15 - 5 = 4 + <span class="bl s"></span></div>' +
          '<div class="q">8 + <span class="bl s"></span> = 6 + 7</div>' +
          '<div class="q"><span class="bl s"></span> + 9 = 12 + 5</div>' +
          "</div>",
      },
      {
        prompt: "The scale is tipping. What would you add or take away to level it?",
        body:
          '<div class="qg c2">' +
          '<div class="q">Left 12, right 8. Add <span class="bl s"></span> to the right.</div>' +
          '<div class="q">Left 7, right 15. Add <span class="bl s"></span> to the left.</div>' +
          '<div class="q">Left 20, right 14. Take <span class="bl s"></span> from the left.</div>' +
          '<div class="q">Left 9, right 9. Do <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "True or false?",
        body:
          '<div class="qg c2">' +
          '<div class="q">5 + 4 = 9 + 0 <span class="bl s"></span></div>' +
          '<div class="q">5 + 4 = 9 + 1 <span class="bl s"></span></div>' +
          '<div class="q">10 = 6 + 4 <span class="bl s"></span></div>' +
          '<div class="q">3 + 3 = 2 + 2 + 2 <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Build one of these on a real balance or drawn scale. Draw what you did.",
        body: grid,
      },
    ],
    parentNoteTitle: "The most common wrong answer",
    parentNote:
      "Ask 7 + 5 = __ + 4 and most Grade 2 children write 12, because they read the equals sign as an instruction. Use a real balance if you have one, a drawn seesaw if you do not. The picture fixes what the explanation cannot.",
    moveOn: "The student reads the equals sign as a balance, not as an instruction to answer.",
    answers:
      "<b>1.</b> 8, 2, 10, 6, 5, 8 &nbsp; <b>2.</b> 4, 8, 6, nothing &nbsp; <b>3.</b> T, F, T, T",
  },

  // ============================================================ Unit 20
  {
    unit: 20,
    letter: "A",
    title: "Instructions in order",
    intro: "A computer does exactly what you say, in exactly the order you say it.",
    expectations: ["C3.1"],
    exercises: [
      {
        prompt: "Number these steps in the right order, 1 to 5.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Put the bread on the plate <span class="bl s"></span></div>' +
          '<div class="q">Eat it <span class="bl s"></span></div>' +
          '<div class="q">Open the jar <span class="bl s"></span></div>' +
          '<div class="q">Spread the jam <span class="bl s"></span></div>' +
          '<div class="q">Get a knife <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Program a parent. Write instructions to walk from here to the kitchen. They follow you literally.",
        hint: "Forward, turn left, turn right, stop. Say how many steps each time.",
        body: box,
      },
      {
        prompt: "Which instruction went wrong? Write the number and fix it.",
        hint: "1 Forward 3. 2 Turn. 3 Forward 2. 4 Open door. 5 Turn right.",
        body:
          '<div class="qg c2">' +
          '<div class="q">The unclear step is: <span class="bl s"></span></div>' +
          '<div class="q">Fixed version: <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Two things happen at the same time. Write instructions for clapping while walking forward 4 steps.",
        body: box,
      },
    ],
    parentNoteTitle: "Follow it exactly, even when it is wrong",
    parentNote:
      "Turn is ambiguous, so turn in a full circle. Forward with no number means one tiny shuffle. Being followed literally is what teaches precision, and it produces the debugging instinct that the next two sessions build on. Keep it playful.",
    moveOn: "The student fixes an instruction that was ambiguous or out of order.",
    answers: "<b>1.</b> 2, 5, 3, 4, 1 &nbsp; <b>3.</b> step 2, turn is unclear, needs turn left or turn right",
  },
  {
    unit: 20,
    letter: "B",
    title: "Write and run code",
    intro: "Write the program first. Predict what it will do. Then run it and find out.",
    expectations: ["C3.1"],
    exercises: [
      {
        prompt: "Before you touch the computer, write the steps for drawing a square.",
        hint: "Free tools that work well: ScratchJr, code.org Course A or B, or Blockly Games.",
        body: box,
      },
      {
        prompt: "Predict, then run.",
        body:
          '<div class="qg c2">' +
          '<div class="q">I think it will: <span class="bl"></span></div>' +
          '<div class="q">It actually: <span class="bl"></span></div>' +
          '<div class="q">Was my prediction right? <span class="bl s"></span></div>' +
          '<div class="q">How many blocks did I use? <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Make the character do two things at once. Write which two.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Thing one: <span class="bl"></span></div>' +
          '<div class="q">Thing two: <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Draw what your program made.",
        body: grid,
      },
    ],
    parentNoteTitle: "Predict before running",
    parentNote:
      "Clicking run and watching is entertainment. Predicting first, then running, is learning. When the prediction is wrong, that gap is the most valuable thing on the screen. Ask why before fixing anything.",
    moveOn: "The student predicts the outcome before running the code.",
    answers: "",
  },
  {
    unit: 20,
    letter: "C",
    title: "Read it, change it",
    intro: "Open someone else's program. Change one thing. Say what happened and why.",
    expectations: ["C3.2"],
    exercises: [
      {
        prompt: "Read the program without running it. What do you think it does?",
        body: box,
      },
      {
        prompt: "Change one number. Record the effect.",
        body:
          '<div class="qg c2">' +
          '<div class="q">I changed: <span class="bl"></span></div>' +
          '<div class="q">From <span class="bl s"></span> to <span class="bl s"></span></div>' +
          '<div class="q">What changed on screen: <span class="bl"></span></div>' +
          '<div class="q">Why: <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Swap the order of two blocks. Does the result change? Write yes or no and explain.",
        body: box,
      },
      {
        prompt: "Make two things happen at the same time, then make them happen one after the other. Describe the difference.",
        body: box,
      },
    ],
    parentNoteTitle: "Cause and effect language",
    parentNote:
      "The sentence you are listening for has a because in it. I changed the 4 to a 10 and it went further because that block says how many steps. Reading and altering someone else's code is a named Grade 2 expectation, not an optional extra.",
    moveOn: "The student describes the effect of a change in cause-and-effect terms.",
    answers: "",
  },

  // ============================================================ Unit 22
  {
    unit: 22,
    letter: "B",
    title: "Thirds and sixths",
    intro: "One third and two sixths are the same amount of the same whole.",
    expectations: ["B1.7"],
    exercises: [
      {
        prompt: "Fold two identical paper strips. One into thirds, one into sixths. Colour one third and two sixths.",
        hint: "The strips must be the same length to start. This is the whole point.",
        body: grid,
      },
      {
        prompt: "Lay them side by side. Answer.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Is one third the same as two sixths? <span class="bl s"></span></div>' +
          '<div class="q">How do you know? <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Same or not the same? Write S or N.",
        body:
          '<div class="qg c2">' +
          '<div class="q">one half and two fourths <span class="bl s"></span></div>' +
          '<div class="q">one third and two sixths <span class="bl s"></span></div>' +
          '<div class="q">one third and one sixth <span class="bl s"></span></div>' +
          '<div class="q">one half and three sixths <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Six cookies are shared among three children. Draw it. How many each? What fraction of the whole plate is that?",
        body: grid,
      },
    ],
    parentNoteTitle: "The same whole, every time",
    parentNote:
      "One third of a small strip is not the same as two sixths of a large one. If the two strips differ in length the whole lesson collapses. Cut them together, from the same sheet, before you start.",
    moveOn: "The student shows the two amounts are equal using the same whole.",
    answers: "<b>3.</b> S, S, N, S &nbsp; <b>4.</b> 2 cookies each, one third of the plate",
  },

  // ============================================================ Unit 23
  {
    unit: 23,
    letter: "A",
    title: "Sort two ways at once",
    intro: "Some things follow both rules. Those go in the overlap.",
    expectations: ["D1.1"],
    exercises: [
      {
        prompt: "Draw two overlapping circles. Label them RED and ROUND. Sort ten objects.",
        body: grid,
      },
      {
        prompt: "Answer about your diagram.",
        body:
          '<div class="qg c2">' +
          '<div class="q">How many in the overlap? <span class="bl s"></span></div>' +
          '<div class="q">How many outside both circles? <span class="bl s"></span></div>' +
          '<div class="q">Name one item in the overlap: <span class="bl"></span></div>' +
          '<div class="q">Why does it belong there? <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Fill in this Carroll diagram with the numbers 1 to 12.",
        hint: "Columns: even, not even. Rows: more than 6, not more than 6.",
        body: grid,
      },
      {
        prompt: "Invent two sorting rules of your own and sort the family's shoes.",
        body: box,
      },
    ],
    parentNoteTitle: "The overlap is the lesson",
    parentNote:
      "Children want each object in exactly one place. The red ball that belongs in both circles at once is the idea worth slowing down for. Ask them to defend the placement out loud.",
    moveOn: "The student places an item in the overlap and explains why it belongs there.",
    answers: "<b>3.</b> even and more than 6: 8, 10, 12 · even and not: 2, 4, 6 · not even and more than 6: 7, 9, 11 · not even and not: 1, 3, 5",
  },
  {
    unit: 23,
    letter: "B",
    title: "Ask and tally",
    intro: "Ask a real question to real people. Record every answer as it comes.",
    expectations: ["D1.2"],
    exercises: [
      {
        prompt: "Write a question with two things to record.",
        hint: "For example: what is your favourite fruit, and are you a child or an adult?",
        body: box,
      },
      {
        prompt: "Build a two-way tally table and fill it in as you interview people.",
        hint: "Four marks then a diagonal fifth. Groups of five are much easier to count.",
        body: grid,
      },
      {
        prompt: "Count your tallies.",
        body:
          '<div class="qg c2">' +
          '<div class="q">How many people did you ask? <span class="bl s"></span></div>' +
          '<div class="q">Most common answer: <span class="bl"></span></div>' +
          '<div class="q">Least common answer: <span class="bl"></span></div>' +
          '<div class="q">Did any group answer differently? <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Keep this sheet. You will turn it into a graph in the next session.",
        body: box,
      },
    ],
    parentNoteTitle: "Let the question be theirs",
    parentNote:
      "Data work fails when the question is boring. Let them ask something they actually want to know, even if it is which cartoon is best. Interview neighbours or call relatives if the household is too small to make the graph interesting.",
    moveOn: "The student records every response without losing count.",
    answers: "",
  },
  {
    unit: 23,
    letter: "D",
    title: "Mode and conclusions",
    intro: "The mode is the answer that came up most. Then say what it means.",
    expectations: ["D1.4", "D1.5"],
    exercises: [
      {
        prompt: "Find the mode of each set.",
        body:
          '<div class="qg c2">' +
          '<div class="q">2, 3, 3, 5, 7 &nbsp; mode = <span class="bl s"></span></div>' +
          '<div class="q">red, blue, red, red, green &nbsp; mode = <span class="bl s"></span></div>' +
          '<div class="q">1, 1, 4, 4, 9 &nbsp; mode = <span class="bl"></span></div>' +
          '<div class="q">6, 7, 8, 9 &nbsp; mode = <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Look at your graph from the last session. Answer.",
        body:
          '<div class="qg c2">' +
          '<div class="q">The mode is: <span class="bl"></span></div>' +
          '<div class="q">How many chose it? <span class="bl s"></span></div>' +
          '<div class="q">How many more than the next one? <span class="bl s"></span></div>' +
          '<div class="q">How many people in total? <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Use your data to make one recommendation. Point at the graph while you say it.",
        hint: "For example: we should buy apples, because seven people picked apples and only two picked pears.",
        body: box,
      },
      {
        prompt: "Write one thing your graph does NOT tell you.",
        body: box,
      },
    ],
    parentNoteTitle: "Two honest answers",
    parentNote:
      "A set can have two modes, and a set can have none. Both are correct answers, and question 1 includes each on purpose. The last question matters too: knowing the limits of your data is the beginning of thinking clearly with it.",
    moveOn: "The student supports a claim by pointing at the data.",
    answers: "<b>1.</b> 3, red, 1 and 4 (two modes), no mode",
  },

  // ============================================================ Unit 24
  {
    unit: 24,
    letter: "A",
    title: "Impossible, possible, certain",
    intro: "Three words for how likely something is. Choose carefully.",
    expectations: ["D2.1"],
    exercises: [
      {
        prompt: "Write impossible, possible, or certain.",
        body:
          '<div class="qg c2">' +
          '<div class="q">The sun will rise tomorrow <span class="bl"></span></div>' +
          '<div class="q">It will snow in Ottawa in July <span class="bl"></span></div>' +
          '<div class="q">I will roll a 4 on a die <span class="bl"></span></div>' +
          '<div class="q">I will roll a 9 on a die <span class="bl"></span></div>' +
          '<div class="q">A dropped ball will fall down <span class="bl"></span></div>' +
          '<div class="q">We will have pasta for dinner <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Roll a die 20 times. Tally what comes up.",
        body: grid,
      },
      {
        prompt: "Answer using your rolls.",
        body:
          '<div class="qg c2">' +
          '<div class="q">Which number came up most? <span class="bl s"></span></div>' +
          '<div class="q">Did every number appear? <span class="bl s"></span></div>' +
          '<div class="q">Is rolling a 6 impossible? <span class="bl"></span></div>' +
          '<div class="q">Is rolling a 7 possible? <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Write one certain, one possible, and one impossible sentence about tomorrow.",
        body: box,
      },
    ],
    parentNoteTitle: "Rare is not impossible",
    parentNote:
      "Children often call an unlikely event impossible. If a number did not come up in twenty rolls, they may declare it impossible. Ask them to roll ten more times. Possible but rare is the distinction worth naming.",
    moveOn: "The student uses the right word and gives a reason for the choice.",
    answers:
      "<b>1.</b> certain, impossible, possible, impossible, certain, possible",
  },
  {
    unit: 24,
    letter: "B",
    title: "Will the same answer win?",
    intro: "You found a mode in one group. Ask a different group and see if it holds.",
    expectations: ["D2.2"],
    exercises: [
      {
        prompt: "Write down your prediction before you ask anyone.",
        body:
          '<div class="qg c2">' +
          '<div class="q">The mode last time was: <span class="bl"></span></div>' +
          '<div class="q">With a new group I predict: <span class="bl"></span></div>' +
          '<div class="q">Because: <span class="bl"></span></div>' +
          "</div>",
      },
      {
        prompt: "Ask the same question to a different group. Tally the answers.",
        hint: "Cousins, classmates, neighbours, or grandparents all count as a different group.",
        body: grid,
      },
      {
        prompt: "Compare the two sets.",
        body:
          '<div class="qg c2">' +
          '<div class="q">New mode: <span class="bl"></span></div>' +
          '<div class="q">Same as before? <span class="bl s"></span></div>' +
          '<div class="q">People asked this time: <span class="bl s"></span></div>' +
          '<div class="q">Was my prediction right? <span class="bl s"></span></div>' +
          "</div>",
      },
      {
        prompt: "Why might a different group give a different answer? Write your best explanation.",
        body: box,
      },
    ],
    parentNoteTitle: "Being wrong is the result",
    parentNote:
      "If the prediction fails, that is a finding, not a mistake. The question to ask is what is different about these people. This is the first step toward understanding why a sample does not always speak for everyone.",
    moveOn: "The student explains why the mode did or did not stay the same.",
    answers: "",
  },
];
