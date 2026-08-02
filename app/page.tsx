"use client";

import { useEffect, useState } from "react";
import { phases, sessions, weeklyUnits, unitNames } from "@/data/sessions";

export default function Home() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [activePart, setActivePart] = useState(0);
  const [openUnit, setOpenUnit] = useState(1);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = window.localStorage.getItem("donia-math-progress");
        if (stored) {
          const saved = JSON.parse(stored) as string[];
          setCompleted(saved);
          const firstIncomplete = weeklyUnits.find((unit) => unit.sessions.some((session) => !saved.includes(session.id)));
          if (firstIncomplete) {
            setOpenUnit(firstIncomplete.week);
            setActivePart(Math.floor((firstIncomplete.week - 1) / 4));
          }
        }
      } catch { setCompleted([]); }
      setReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem("donia-math-progress", JSON.stringify(completed));
    } catch { /* storage full or unavailable */ }
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
      <noscript>
        <div className="noscript-banner">
          This site requires JavaScript to track progress and navigate sessions.
          You can still <a href="worksheets/donia-math-exercises.zip">download all exercises</a> directly.
        </div>
      </noscript>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Donia's Math Home">
          <span className="brand-mark">D</span>
          <span>Donia&apos;s Math Home</span>
        </a>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className={`hamburger ${menuOpen ? "open" : ""}`} />
        </button>
        <nav id="main-nav" className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
          <a href="#plan" onClick={() => setMenuOpen(false)}>The plan</a>
          <a href="#sessions" onClick={() => setMenuOpen(false)}>Sessions</a>
          <a href="#parent-guide" onClick={() => setMenuOpen(false)}>Parent guide</a>
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
        <div className="progress-card" role="region" aria-label="Mastery progress">
          <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
            <div role="img" aria-label={`${completed.length} of 32 sessions mastered`}>
              <strong aria-hidden="true">{completed.length}</strong>
              <span aria-hidden="true">of 32</span>
            </div>
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
                    <p>Teach Session A first. Leave at least one day before Session B. If Donia cannot meet the "move on when" check, repeat the activity with new numbers before continuing.</p>
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
            <ul><li>Objects and drawings within reach</li><li>Questions such as "show me how you know"</li><li>Untimed practice and playful fluency</li><li>One digit per square for written work</li></ul>
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
