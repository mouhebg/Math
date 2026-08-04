"use client";

import { startTransition, type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { phases, sessions, weeklyUnits, unitNames, type Session } from "@/data/sessions";
import { supabase } from "@/lib/supabase";
import SyncMenu, { type SyncState } from "./components/SyncMenu";
import { ArrowIcon, BookIcon, DownloadIcon, GuideIcon, MathNestMark, RouteIcon } from "./components/icons";

type SessionStatus = "not-started" | "practising" | "mastered";
type StatusMap = Record<string, SessionStatus>;

const statusLabels: Record<SessionStatus, string> = {
  "not-started": "Not started",
  practising: "Practising",
  mastered: "Mastered",
};

const storageKeys = {
  statuses: "mathnest-math-statuses",
  progress: "mathnest-math-progress",
  pending: "mathnest-math-sync-pending",
  location: "mathnest-math-location",
} as const;

// Progress saved under the previous site name is still read once, then rewritten under the current keys.
const legacyStorageKeys = {
  statuses: "donia-math-statuses",
  progress: "donia-math-progress",
  pending: "donia-math-sync-pending",
  location: "donia-math-location",
} as const;

function readStored(key: keyof typeof storageKeys) {
  return window.localStorage.getItem(storageKeys[key]) ?? window.localStorage.getItem(legacyStorageKeys[key]);
}

function worksheetName(session: Session) {
  return `mathnest-unit-${String(session.unit).padStart(2, "0")}-session-${session.letter.toLowerCase()}.html`;
}

export default function Home() {
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [activePart, setActivePart] = useState(0);
  // Units the reader has expanded. A list rather than a single value, so opening
  // one unit never collapses another; closing is always a deliberate act.
  const [openUnits, setOpenUnits] = useState<number[]>([1]);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [syncState, setSyncState] = useState<SyncState>("local");
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const openUnit = openUnits.length ? openUnits[openUnits.length - 1] : 0;
  const statusesRef = useRef<StatusMap>({});
  const pendingSyncRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const storedStatuses = readStored("statuses");
        const legacyProgress = readStored("progress");
        const nextStatuses: StatusMap = {};

        if (storedStatuses) {
          const saved = JSON.parse(storedStatuses) as StatusMap;
          for (const session of sessions) {
            if (["not-started", "practising", "mastered"].includes(saved[session.id])) {
              nextStatuses[session.id] = saved[session.id];
            }
          }
        } else if (legacyProgress) {
          const mastered = JSON.parse(legacyProgress) as string[];
          for (const id of mastered) nextStatuses[id] = "mastered";
        }

        statusesRef.current = nextStatuses;
        setStatuses(nextStatuses);
        const savedPending = readStored("pending");
        if (savedPending) {
          pendingSyncRef.current = new Set(JSON.parse(savedPending) as string[]);
        }
        const savedLocation = readStored("location");
        const location = savedLocation ? JSON.parse(savedLocation) as { part?: number; unit?: number } : null;
        if (
          location
          && Number.isInteger(location.part)
          && Number.isInteger(location.unit)
          && location.part! >= 0
          && location.part! <= 3
          && location.unit! >= location.part! * 4 + 1
          && location.unit! <= location.part! * 4 + 4
        ) {
          setActivePart(location.part!);
          setOpenUnits([location.unit!]);
        } else {
          const current = sessions.find((session) => nextStatuses[session.id] === "practising")
            ?? sessions.find((session) => nextStatuses[session.id] !== "mastered");
          if (current) {
            setOpenUnits([current.unit]);
            setActivePart(Math.floor((current.unit - 1) / 4));
          }
        }
      } catch {
        setStatuses({});
      }
      setReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const nextUser = data.session?.user ?? null;
      setUser(nextUser);
      setAuthReady(true);
      if (!nextUser) {
        setCloudLoaded(false);
        setSyncState("local");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      setAuthReady(true);
      setCloudLoaded(false);
      if (!nextUser) setSyncState("local");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    statusesRef.current = statuses;
  }, [statuses]);

  useEffect(() => {
    if (!ready || !authReady) return;
    if (!user) return;

    let cancelled = false;

    async function loadCloudProgress() {
      setSyncState("syncing");
      const [progressResult, preferencesResult] = await Promise.all([
        supabase.from("math_session_progress").select("session_id,status,updated_at").eq("user_id", user!.id),
        supabase.from("math_preferences").select("active_part,open_unit").eq("user_id", user!.id).maybeSingle(),
      ]);

      if (cancelled) return;
      if (progressResult.error || preferencesResult.error) {
        setSyncState("error");
        setAuthMessage("Your local progress is safe, but cloud sync could not connect.");
        return;
      }

      const localStatuses = statusesRef.current;
      const pending = pendingSyncRef.current;
      const merged: StatusMap = { ...localStatuses };
      const remoteIds = new Set<string>();

      for (const row of progressResult.data ?? []) {
        if (!["not-started", "practising", "mastered"].includes(row.status)) continue;
        remoteIds.add(row.session_id);
        if (!pending.has(row.session_id)) merged[row.session_id] = row.status as SessionStatus;
      }

      statusesRef.current = merged;
      setStatuses(merged);

      const rowsToUpload = Object.entries(merged)
        .filter(([id]) => pending.has(id) || !remoteIds.has(id))
        .map(([sessionId, status]) => ({
          user_id: user!.id,
          session_id: sessionId,
          status,
          updated_at: new Date().toISOString(),
        }));

      if (rowsToUpload.length) {
        const { error } = await supabase.from("math_session_progress").upsert(rowsToUpload, { onConflict: "user_id,session_id" });
        if (error) {
          if (!cancelled) setSyncState("error");
          return;
        }
        for (const row of rowsToUpload) pending.delete(row.session_id);
        window.localStorage.setItem(storageKeys.pending, JSON.stringify([...pending]));
      }

      if (preferencesResult.data) {
        setActivePart(preferencesResult.data.active_part);
        setOpenUnits([preferencesResult.data.open_unit]);
      } else {
        const savedLocation = readStored("location");
        const localLocation = savedLocation
          ? JSON.parse(savedLocation) as { part: number; unit: number }
          : { part: 0, unit: 1 };
        await supabase.from("math_preferences").upsert({
          user_id: user!.id,
          active_part: localLocation.part,
          open_unit: localLocation.unit,
          updated_at: new Date().toISOString(),
        });
      }

      if (!cancelled) {
        setCloudLoaded(true);
        setSyncState("synced");
        setAuthMessage("");
      }
    }

    void loadCloudProgress();
    return () => { cancelled = true; };
  }, [authReady, ready, user]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(storageKeys.statuses, JSON.stringify(statuses));
      window.localStorage.setItem(
        storageKeys.progress,
        JSON.stringify(sessions.filter((session) => statuses[session.id] === "mastered").map((session) => session.id)),
      );
    } catch {
      // Local progress remains available for this visit when storage is unavailable.
    }
  }, [statuses, ready]);

  useEffect(() => {
    if (!ready || openUnit === 0) return;
    try {
      window.localStorage.setItem(storageKeys.location, JSON.stringify({ part: activePart, unit: openUnit }));
    } catch {
      // Navigation still works normally when storage is unavailable.
    }

    if (user && cloudLoaded) {
      void supabase.from("math_preferences").upsert({
        user_id: user.id,
        active_part: activePart,
        open_unit: openUnit,
        updated_at: new Date().toISOString(),
      }).then(({ error }) => setSyncState(error ? "error" : "synced"));
    }
  }, [activePart, cloudLoaded, openUnit, ready, user]);

  const masteredCount = sessions.filter((session) => statuses[session.id] === "mastered").length;
  // The whole-programme percentage went with the menu bar. Progress is still on
  // the page per part and per unit, where it is actually actionable.
  const programmeComplete = masteredCount === sessions.length;
  const nextSession = useMemo(
    () => sessions.find((session) => statuses[session.id] === "practising")
      ?? sessions.find((session) => statuses[session.id] !== "mastered")
      ?? sessions[sessions.length - 1],
    [statuses],
  );
  const visibleUnits = weeklyUnits.slice(activePart * 4, activePart * 4 + 4);

  function getStatus(id: string): SessionStatus {
    return statuses[id] ?? "not-started";
  }

  function setStatus(id: string, status: SessionStatus) {
    const next = { ...statusesRef.current, [id]: status };
    statusesRef.current = next;
    setStatuses(next);
    pendingSyncRef.current.add(id);
    try {
      window.localStorage.setItem(storageKeys.pending, JSON.stringify([...pendingSyncRef.current]));
    } catch {
      // The current visit still retains the change.
    }

    if (user) {
      setSyncState("syncing");
      void supabase.from("math_session_progress").upsert({
        user_id: user.id,
        session_id: id,
        status,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,session_id" }).then(({ error }) => {
        if (error) {
          setSyncState("error");
          return;
        }
        pendingSyncRef.current.delete(id);
        window.localStorage.setItem(storageKeys.pending, JSON.stringify([...pendingSyncRef.current]));
        setSyncState("synced");
      });
    }
  }

  // The menu bar's callbacks keep a stable identity, so a status change three
  // sections down the page does not hand the bar a fresh set of props.
  const sendMagicLink = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    setAuthMessage("Sending your secure sign-in linkâ€¦");
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${window.location.origin}${window.location.pathname}`,
      },
    });
    setAuthMessage(error ? error.message : "Check your email and open the sign-in link on this device.");
  }, [email]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    setAuthMessage(error ? error.message : "Signed out. Progress remains saved locally on this device.");
    if (!error) setAuthOpen(false);
  }, []);

  const toggleAuth = useCallback(() => setAuthOpen((open) => !open), []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  function toggleUnit(week: number) {
    setOpenUnits((previous) => (
      previous.includes(week) ? previous.filter((open) => open !== week) : [...previous, week]
    ));
  }

  function choosePart(part: number) {
    const units = weeklyUnits.slice(part * 4, part * 4 + 4);
    const firstCurrent = units.find((unit) => unit.sessions.some((session) => getStatus(session.id) !== "mastered"));
    // Replacing an expanded programme panel is the heaviest update on the page.
    // Keep scrolling and pointer input responsive while React prepares it.
    startTransition(() => {
      setActivePart(part);
      setOpenUnits([firstCurrent?.week ?? part * 4 + 1]);
    });
  }

  function openSession(session: Session) {
    setActivePart(Math.floor((session.unit - 1) / 4));
    setOpenUnits((previous) => (previous.includes(session.unit) ? previous : [...previous, session.unit]));
    window.requestAnimationFrame(() => document.getElementById("programme")?.scrollIntoView({ block: "start" }));
  }

  function startNextLesson() {
    if (!programmeComplete && getStatus(nextSession.id) === "not-started") {
      setStatus(nextSession.id, "practising");
    }
    openSession(nextSession);
  }

  return (
    <main>
      <noscript>
        <div className="noscript-banner">
          JavaScript is needed for progress tracking. You can still <a href="worksheets/mathnest-math-exercises.zip">download all exercises</a>.
        </div>
      </noscript>

      <div className="today-shell">
      {/* The logo, at the top of the page and part of it. Not a bar: nothing
          fixed, nothing sticky, and it scrolls away with the hero. */}
      <div className="masthead">
        <span className="brand-mark"><MathNestMark /></span>
        <span className="masthead-words"><strong>MathNest</strong><small>Where numbers grow</small></span>
      </div>

      <section className="today-section" id="today">
        <div className="today-copy">
          <p className="eyebrow">Grade 2 home learning</p>
          <h1>Small lessons.<br />Strong <span className="accent">foundations.</span></h1>
          <p className="today-lede">
            A calm mathematics programme built around understanding. Short sessions, clear parent guidance, and no pressure to rush.
          </p>
          <div className="programme-summary" aria-label="Programme summary">
            <span><strong>{weeklyUnits.length}</strong> units</span>
            <span><strong>{sessions.length}</strong> sessions</span>
            <span><strong>20</strong> min each</span>
          </div>
          <nav className="part-ribbon" aria-label="Programme parts">
            {phases.map((phase, index) => {
              const partSessions = weeklyUnits.slice(index * 4, index * 4 + 4).flatMap((unit) => unit.sessions);
              const partMastered = partSessions.filter((session) => getStatus(session.id) === "mastered").length;
              return (
                <a
                  className={`part-${index + 1}`}
                  href="#programme"
                  key={phase.name}
                  aria-label={`${phase.name}, ${partMastered} of ${partSessions.length} sessions mastered; choose this part in the programme`}
                  title={phase.name}
                >
                  <i aria-hidden="true"><b style={{ width: `${(partMastered / partSessions.length) * 100}%` }} /></i>
                  <span>Part {index + 1}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <article className="next-lesson-card" aria-label="Today's lesson">
          <header>
            <span className="today-label">{programmeComplete ? "Programme complete" : "Todayâ€™s lesson"}</span>
            <span className={`status-pill status-${getStatus(nextSession.id)}`}>{statusLabels[getStatus(nextSession.id)]}</span>
          </header>
          <div className="lesson-position">
            <span>Part {Math.floor((nextSession.unit - 1) / 4) + 1}</span>
            <span>Unit {String(nextSession.unit).padStart(2, "0")}</span>
            <span>Session {nextSession.letter}</span>
          </div>
          <h2>{programmeComplete ? "Choose what to revisit" : nextSession.title}</h2>
          <p>{programmeComplete ? "All sessions are mastered. Open any unit below for a relaxed review." : nextSession.focus}</p>
          <div className="lesson-meta"><span>About 20 minutes</span><span>{nextSession.kind}</span></div>
          <div className="next-actions">
            <button className="primary-action" onClick={startNextLesson}>
              {programmeComplete ? "Open programme" : getStatus(nextSession.id) === "practising" ? "Continue lesson" : "Start lesson"}<ArrowIcon />
            </button>
            <a href={`worksheets/${worksheetName(nextSession)}`} target="_blank" rel="noreferrer">
              <BookIcon /> Open worksheet
            </a>
          </div>
        </article>
      </section>
      </div>

      <section className="programme-section" id="programme">
        <div className="section-heading">
          <div><p className="eyebrow">Learning pathway</p><h2>See the whole journey.<br />Open only what you need.</h2></div>
          <p>Choose a part, then open any units you want to see. They stay open until you close them. Work through each unit&apos;s sessions in order, leave at least one day between them, and repeat whenever understanding is still developing.</p>
        </div>

        <div className="part-tabs" role="tablist" aria-label="Programme parts">
          {phases.map((phase, index) => {
            const partSessions = weeklyUnits.slice(index * 4, index * 4 + 4).flatMap((unit) => unit.sessions);
            const partMastered = partSessions.filter((session) => getStatus(session.id) === "mastered").length;
            return (
              <button
                className={`part-tab part-${index + 1} ${activePart === index ? "active" : ""}`}
                role="tab"
                aria-selected={activePart === index}
                onClick={() => choosePart(index)}
                key={phase.name}
              >
                <span className="part-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="part-name"><strong>{phase.name}</strong><small>{phase.units}</small></span>
                <span className="part-score">{partMastered}/{partSessions.length}</span>
              </button>
            );
          })}
        </div>

        <div className={`part-panel part-panel-${activePart + 1}`} role="tabpanel">
          <header className="part-panel-header">
            <div><span>Part {activePart + 1} of {phases.length}</span><h3>{phases[activePart].name}</h3></div>
            <p>{phases[activePart].note}</p>
          </header>

          <div className="unit-grid">
            {visibleUnits.map((unit) => {
              const unitMastered = unit.sessions.filter((session) => getStatus(session.id) === "mastered").length;
              const unitPractising = unit.sessions.some((session) => getStatus(session.id) === "practising");
              const isOpen = openUnits.includes(unit.week);
              return (
                <article className={`unit-card ${isOpen ? "open" : ""}`} key={unit.week}>
                  <button className="unit-summary" onClick={() => toggleUnit(unit.week)} aria-expanded={isOpen}>
                    <span className="unit-number">Unit {String(unit.week).padStart(2, "0")}</span>
                    <span className="unit-title">{unitNames[unit.week - 1]}</span>
                    <span className={`unit-state ${unitMastered === unit.sessions.length ? "complete" : unitPractising ? "active" : ""}`}>
                      {unitMastered === unit.sessions.length ? "Mastered" : unitPractising ? "In progress" : `${unitMastered}/${unit.sessions.length} complete`}
                    </span>
                    <span className="unit-toggle-icon" aria-hidden="true">{isOpen ? "âˆ’" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="unit-detail">
                      <div className="weekly-note">
                        <span>Weekly rhythm</span>
                        <p>{unit.sessions.length > 2
                          ? "Teach one session at a time and in order, pausing at least a day between them. Repeat any session with new numbers if the move-on check is not yet secure."
                          : "Teach Session A, pause for at least one day, then teach Session B. Repeat with new numbers if the move-on check is not yet secure."}</p>
                        {/* Every unit has a card now. Unit 1 drills the facts;
                            the rest bring back what earlier units taught. */}
                        <a href={`worksheets/mathnest-unit-${String(unit.week).padStart(2, "0")}-warm-up-card.html`} target="_blank" rel="noreferrer">
                          Open the 2-minute warm-up card <ArrowIcon />
                        </a>
                      </div>

                      <div className="session-grid">
                        {unit.sessions.map((session) => {
                          const currentStatus = getStatus(session.id);
                          return (
                            <section className={`session-card session-slot-${session.letter.toLowerCase()} session-${currentStatus}`} key={session.id}>
                              <header className="session-header">
                                <span className="session-letter">{session.letter}</span>
                                <div><span>Session {session.letter}</span><h4>{session.title}</h4></div>
                                <span className={`kind kind-${session.kind.toLowerCase()}`}>{session.kind}</span>
                              </header>

                              <div className="instruction-list">
                                <div><span>Goal</span><p>{session.focus}</p></div>
                                <div><span>What you do</span><p>{session.activity}</p></div>
                                {/* Named before the worksheet is opened, so a parent
                                    knows what to fetch rather than finding out mid-lesson. */}
                                {session.materials && (
                                  <div><span>What you need</span><p>{session.materials}</p></div>
                                )}
                                <div><span>Move on when</span><p>{session.success}</p></div>
                                {session.expectations.length > 0 && (
                                  <div><span>Ontario Grade 2</span><p className="session-codes">{session.expectations.join(", ")}</p></div>
                                )}
                              </div>

                              <div className="session-resources">
                                <a className="open-resource" href={`worksheets/${worksheetName(session)}`} target="_blank" rel="noreferrer"><BookIcon />Open worksheet</a>
                                <a href={`worksheets/${worksheetName(session)}`} download aria-label={`Download Unit ${unit.week}, Session ${session.letter}`}><DownloadIcon /><span>Download</span></a>
                              </div>

                              <fieldset className="status-control">
                                <legend>Learning status</legend>
                                {(["not-started", "practising", "mastered"] as SessionStatus[]).map((status) => (
                                  <button
                                    className={`status-option status-option-${status}${currentStatus === status ? " selected" : ""}`}
                                    aria-pressed={currentStatus === status}
                                    onClick={() => setStatus(session.id, status)}
                                    key={status}
                                  >
                                    {status === "mastered" && <span aria-hidden="true">âœ“</span>}{statusLabels[status]}
                                  </button>
                                ))}
                              </fieldset>
                            </section>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="guide-section" id="parent-guide">
        <div className="section-heading">
          <div><p className="eyebrow">Parent guide</p><h2>Keep each lesson<br />small and successful.</h2></div>
          <p>Twenty minutes is enough on most days. Finish earlier when the student reaches a natural success, and return another day if frustration starts to rise.</p>
        </div>

        <div className="guide-details">
          <details open>
            <summary><span>01</span><strong>What to keep nearby</strong><i /></summary>
            <ul>
              <li>About 20 small identical things to count with: dried beans, pasta, buttons, or a jar of nickels</li>
              <li>Sticks or straws and a few elastic bands, for bundling tens</li>
              <li>Scrap paper for drawing, folding, and cutting into strips</li>
              <li>None of the above is required. Pencil dots you can rub out do the same job</li>
              <li>Questions such as â€œshow me how you knowâ€</li>
              <li>One digit per square for written work</li>
            </ul>
          </details>
          <details>
            <summary><span>02</span><strong>When to pause</strong><i /></summary>
            <ul><li>The same misunderstanding keeps returning</li><li>Guessing replaces explaining</li><li>Frustration begins to rise</li><li>The concrete model no longer makes sense</li></ul>
          </details>
          <details>
            <summary><span>03</span><strong>What to remember</strong><i /></summary>
            <ul><li>Finger counting can be a useful temporary strategy</li><li>Wrong answers reveal where to teach</li><li>Extensions are optional, not tests</li><li>Confidence and understanding come before speed</li></ul>
          </details>
        </div>

        <div className="curriculum-note">
          <div><span>For French immersion</span><h3>Same idea, two names.</h3></div>
          <div>
            <p>If she learns this in French at school, the concept is not the problem, the word is. Keep the vocabulary card on the table and say each term in both languages once as it comes up.</p>
            <p><a href="worksheets/mathnest-glossary-card.html" target="_blank" rel="noreferrer">Open the English and French vocabulary card <ArrowIcon /></a></p>
          </div>
        </div>

        <div className="curriculum-note">
          <div><span>Ontario alignment</span><h3>Every Grade 2 expectation has a session, and extensions are labelled as extensions.</h3></div>
          <p>Core sessions carry the specific expectation codes they cover, across all six strands of the Ontario 2020 mathematics curriculum: Number, Algebra including coding, Data, Spatial Sense including geometry and measurement, and Financial Literacy. Two-digit halving, making change, and clock reading sit beyond the Grade 2 expectations and are marked as extensions. Social-emotional learning and mathematical modelling run through the parent guide and the review sessions rather than through single lessons. This is a home programme that follows the curriculum, not a replacement for the school year.</p>
        </div>
      </section>

      <footer>
        <div className="footer-brand"><span className="brand-mark"><MathNestMark /></span><span><strong>MathNest</strong><small>Where numbers grow.</small></span></div>
        <p>Built for the pleasure of finally understanding.</p>
        <div className="footer-actions">
          <SyncMenu
            syncState={syncState}
            user={user}
            authOpen={authOpen}
            onToggleAuth={toggleAuth}
            onCloseAuth={closeAuth}
            email={email}
            onEmailChange={setEmail}
            authMessage={authMessage}
            onSubmitEmail={sendMagicLink}
            onSignOut={signOut}
          />
          <a href="#today">Back to top â†‘</a>
        </div>
      </footer>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <a href="#today"><BookIcon /><span>Today</span></a>
        <a href="#programme"><RouteIcon /><span>Programme</span></a>
        <a href="#parent-guide"><GuideIcon /><span>Guide</span></a>
      </nav>
    </main>
  );
}

