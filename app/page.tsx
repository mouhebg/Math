"use client";

import { useEffect, useState } from "react";

type SessionKind = "Core" | "Extension" | "Review";

type Session = {
  id: string;
  unit: number;
  letter: "A" | "B";
  title: string;
  focus: string;
  activity: string;
  success: string;
  kind: SessionKind;
};

const phases = [
  { name: "Number foundations", units: "Weeks 1 to 4", note: "Build meaning before procedures." },
  { name: "Taking numbers apart", units: "Weeks 5 to 8", note: "Subtraction, sharing, and halves." },
  { name: "Math in daily life", units: "Weeks 9 to 12", note: "Money, time, and planning." },
  { name: "Groups and wider thinking", units: "Weeks 13 to 16", note: "Arrays, data, patterns, and review." },
];

const sessions: Session[] = [
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

const weeklyUnits = Array.from({ length: 16 }, (_, index) => ({
  week: index + 1,
  sessions: sessions.filter((session) => session.unit === index + 1),
}));

const unitNames = [
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

export default function Home() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [activePart, setActivePart] = useState(0);
  const [openUnit, setOpenUnit] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem("donia-math-progress");
      if (stored) {
        try {
          const saved = JSON.parse(stored) as string[];
          setCompleted(saved);
          const firstIncomplete = weeklyUnits.find((unit) => unit.sessions.some((session) => !saved.includes(session.id)));
          if (firstIncomplete) {
            setOpenUnit(firstIncomplete.week);
            setActivePart(Math.floor((firstIncomplete.week - 1) / 4));
          }
        } catch { setCompleted([]); }
      }
      setReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem("donia-math-progress", JSON.stringify(completed));
  }, [completed, ready]);

  const progress = Math.round((completed.length / sessions.length) * 100);
  const visibleUnits = weeklyUnits.slice(activePart * 4, activePart * 4 + 4);

  function toggle(id: string) {
    setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function choosePart(part: number) {
    setActivePart(part);
    setOpenUnit(part * 4 + 1);
  }

  function openPart(part: number) {
    choosePart(part);
    window.requestAnimationFrame(() => document.getElementById("sessions")?.scrollIntoView({ behavior: "smooth" }));
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Donia's Math Home">
          <span className="brand-mark">D</span>
          <span>Donia&apos;s Math Home</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#plan">The plan</a>
          <a href="#sessions">Sessions</a>
          <a href="#parent-guide">Parent guide</a>
        </nav>
        <a className="small-download" href="worksheets/donia-math-exercises.zip" download>
          Download all
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Grade 2 // Home learning // 16 units</p>
          <h1>One idea at a time. Understood, not rushed.</h1>
          <p className="hero-lede">
            A calm, concrete programme made for Donia. Two short sessions per unit, a printable exercise for every lesson, and a clear signal for when to move forward.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#sessions">Choose today&apos;s session</a>
            <a className="text-button" href="worksheets/donia-math-exercises.zip" download>Download the complete set</a>
          </div>
          <div className="hero-rule">
            <span>The question to return to</span>
            <strong>What is the whole? What are the parts? Which one is missing?</strong>
          </div>
        </div>
        <div className="progress-card" aria-label={`${completed.length} of 32 sessions mastered`}>
          <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
            <div><strong>{completed.length}</strong><span>of 32</span></div>
          </div>
          <p className="progress-label">Sessions mastered</p>
          <p>Progress is stored on this device. Repeating a session is part of the plan.</p>
          <div className="mini-track" aria-hidden="true">
            {sessions.map((session) => <span className={completed.includes(session.id) ? "done" : ""} key={session.id} />)}
          </div>
        </div>
      </section>

      <section className="section" id="plan">
        <div className="section-heading">
          <div><p className="eyebrow">The learning map</p><h2>Four parts, one connected story</h2></div>
          <p>Plan for Session A and Session B each week. If an idea is still developing, repeat that week before moving forward.</p>
        </div>
        <div className="phase-grid">
          {phases.map((phase, index) => (
            <button className={`phase-card phase-${index + 1}`} onClick={() => openPart(index)} key={phase.name}>
              <span>Part {index + 1}</span>
              <h3>{phase.name}</h3>
              <p>{phase.units}</p>
              <small>{phase.note}</small>
              <b>Open this part →</b>
            </button>
          ))}
        </div>
        <div className="mastery-grid">
          <article><span>1</span><div><h3>Ready</h3><p>She explains the idea and completes the exercise with confidence. Continue.</p></div></article>
          <article><span>2</span><div><h3>Developing</h3><p>She understands with help. Repeat using new numbers or a different game.</p></div></article>
          <article><span>3</span><div><h3>Not yet</h3><p>Frustration is rising or the model is unclear. Return to the previous concrete step.</p></div></article>
        </div>
      </section>

      <section className="section sessions-section" id="sessions">
        <div className="section-heading">
          <div><p className="eyebrow">The programme</p><h2>Part, Unit, then Exercise</h2></div>
          <p>Follow the three levels below. Complete Session A and Session B inside a Unit, then continue to the next Unit.</p>
        </div>

        <div className="programme-key" aria-label="How to use the programme">
          <div><span>1</span><p><b>Choose a Part</b><small>Four large stages</small></p></div>
          <div><span>2</span><p><b>Open a Unit</b><small>One Unit per week</small></p></div>
          <div><span>3</span><p><b>Teach two exercises</b><small>Session A and Session B</small></p></div>
        </div>

        <div className="part-selector" role="tablist" aria-label="Choose a programme part">
          {phases.map((phase, index) => (
            <button
              className={`part-choice part-choice-${index + 1} ${activePart === index ? "active" : ""}`}
              role="tab"
              aria-selected={activePart === index}
              onClick={() => choosePart(index)}
              key={phase.name}
            >
              <span>Part {index + 1}</span>
              <strong>{phase.name}</strong>
              <small>{phase.units}</small>
            </button>
          ))}
        </div>

        <section className={`part-workspace part-workspace-${activePart + 1}`} role="tabpanel">
          <header className="part-workspace-header">
            <div><span>Part {activePart + 1} of 4</span><h3>{phases[activePart].name}</h3></div>
            <p>{phases[activePart].note} Open one Unit below to see your instructions and Donia&apos;s exercises.</p>
          </header>

          <div className="unit-list">
          {visibleUnits.map((unit) => {
            const completeCount = unit.sessions.filter((session) => completed.includes(session.id)).length;
            const isOpen = openUnit === unit.week;
            return (
              <article className={`unit-accordion ${isOpen ? "open" : ""}`} key={unit.week}>
                <button className="unit-toggle" onClick={() => setOpenUnit(isOpen ? 0 : unit.week)} aria-expanded={isOpen}>
                  <span className="unit-number">Unit {String(unit.week).padStart(2, "0")}</span>
                  <span className="unit-name">{unitNames[unit.week - 1]}</span>
                  <span className="unit-progress">{completeCount}/2 complete</span>
                  <span className="unit-arrow">{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && <div className="unit-content">
                  <div className="unit-instruction">
                    <div>
                      <span>Your weekly rhythm</span>
                      {unit.week === 1 && (
                        <a className="unit-resource" href="worksheets/donia-unit-01-warm-up-card.html" target="_blank" rel="noreferrer">
                          Open the 2-minute warm-up card ↗
                        </a>
                      )}
                    </div>
                    <p>Teach Session A first. Leave at least one day before Session B. If Donia cannot meet the “move on when” check, repeat the activity with new numbers before continuing.</p>
                  </div>
                  <div className="exercise-pair">
                  {unit.sessions.map((session) => {
                    const filename = `donia-unit-${String(session.unit).padStart(2, "0")}-session-${session.letter.toLowerCase()}.html`;
                    const isDone = completed.includes(session.id);
                    return (
                      <section className={`exercise-card ${isDone ? "mastered" : ""}`} key={session.id}>
                        <header className="exercise-header">
                          <span className="session-letter">{session.letter}</span>
                          <div>
                            <span>Session {session.letter}</span>
                            <h4>{session.title}</h4>
                          </div>
                          <span className={`kind kind-${session.kind.toLowerCase()}`}>{session.kind}</span>
                        </header>

                        <div className="parent-instructions">
                          <div><span>Goal</span><p>{session.focus}</p></div>
                          <div><span>What you do</span><p>{session.activity}</p></div>
                          <div><span>Move on when</span><p>{session.success}</p></div>
                        </div>

                        <div className="exercise-actions">
                          <a href={`worksheets/${filename}`} target="_blank" rel="noreferrer" aria-label={`Open Unit ${unit.week}, Session ${session.letter}`}>Open exercise ↗</a>
                          <a className="save-exercise" href={`worksheets/${filename}`} download aria-label={`Download Unit ${unit.week}, Session ${session.letter}`}>Download ↓</a>
                          <button aria-pressed={isDone} onClick={() => toggle(session.id)} aria-label={`${isDone ? "Unmark" : "Mark"} Unit ${unit.week}, Session ${session.letter} as mastered`}>
                            <span className="check">{isDone ? "✓" : ""}</span>{isDone ? "Mastered" : "Mark mastered"}
                          </button>
                        </div>
                      </section>
                    );
                  })}
                  </div>
                </div>
                }
              </article>
            );
          })}
          </div>
        </section>
      </section>

      <section className="section parent-section" id="parent-guide">
        <div className="section-heading">
          <div><p className="eyebrow">For the adult beside her</p><h2>A lesson should feel small</h2></div>
          <p>Twenty to twenty-five minutes is enough on most days. Finish sooner when she reaches a natural success.</p>
        </div>
        <div className="rhythm">
          <div><strong>2</strong><span>min</span><p>Oral warm-up</p></div>
          <div><strong>6</strong><span>min</span><p>Model with objects</p></div>
          <div><strong>8</strong><span>min</span><p>Exercise</p></div>
          <div><strong>5</strong><span>min</span><p>Game or real life</p></div>
          <div><strong>2</strong><span>min</span><p>Donia explains</p></div>
        </div>
        <div className="guide-grid">
          <article>
            <h3>Keep</h3>
            <ul><li>Objects and drawings within reach</li><li>Questions such as “show me how you know”</li><li>Untimed practice and playful fluency</li><li>One digit per square for written work</li></ul>
          </article>
          <article>
            <h3>Pause</h3>
            <ul><li>When the same misunderstanding repeats</li><li>When guessing replaces explaining</li><li>When frustration begins to rise</li><li>When the concrete model no longer makes sense</li></ul>
          </article>
          <article>
            <h3>Remember</h3>
            <ul><li>Finger counting is a valid temporary strategy</li><li>Wrong answers reveal where to teach</li><li>Extensions are optional, not tests</li><li>Confidence and understanding come before speed</li></ul>
          </article>
        </div>
        <div className="curriculum-note">
          <div><span>Ontario alignment</span><h3>Core expectations and enrichment are clearly separated.</h3></div>
          <p>
            Grade 2 core work includes numbers to 200, addition and subtraction situations to 100, facts to 20, fair sharing, equal groups, patterns, data, measurement, and representing Canadian money. Making change, formal written algorithms, larger-number halving, and detailed clock reading are included only as optional extensions.
          </p>
        </div>
      </section>

      <footer>
        <div><span className="brand-mark">D</span><strong>Donia&apos;s Math Home</strong></div>
        <p>Built for patient practice, clear thinking, and the pleasure of finally understanding.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
