"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { phases, sessions, weeklyUnits, unitNames, type Session } from "@/data/sessions";
import { supabase } from "@/lib/supabase";

type SessionStatus = "not-started" | "practising" | "mastered";
type StatusMap = Record<string, SessionStatus>;
type SyncState = "local" | "syncing" | "synced" | "error";

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

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5" /></svg>;
}

function DownloadIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v9m0 0 4-4m-4 4L6 8M4 16h12" /></svg>;
}

function BookIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H10v14H6.5A2.5 2.5 0 0 0 4 18.5v-14Zm12 0A2.5 2.5 0 0 0 13.5 2H10v14h3.5a2.5 2.5 0 0 1 2.5 2.5v-14Z" /></svg>;
}

function RouteIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="5" cy="5" r="2" /><circle cx="15" cy="15" r="2" /><path d="M7 5h3a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H8a3 3 0 0 0-3 3v0" /></svg>;
}

function ChartIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 16V9m6 7V4m6 12v-5" /></svg>;
}

function GuideIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 17a7 7 0 1 0-7-7m7-3v3l2 2" /><path d="M3 13v4h4" /></svg>;
}

function CloudIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 15.5h9a3.5 3.5 0 0 0 .5-7A5 5 0 0 0 5.4 7 4.3 4.3 0 0 0 5.5 15.5Z" /><path d="m8 11 2 2 3.5-4" /></svg>;
}

export default function Home() {
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [activePart, setActivePart] = useState(0);
  const [openUnit, setOpenUnit] = useState(1);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [syncState, setSyncState] = useState<SyncState>("local");
  const [cloudLoaded, setCloudLoaded] = useState(false);
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
          setOpenUnit(location.unit!);
        } else {
          const current = sessions.find((session) => nextStatuses[session.id] === "practising")
            ?? sessions.find((session) => nextStatuses[session.id] !== "mastered");
          if (current) {
            setOpenUnit(current.unit);
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
        setOpenUnit(preferencesResult.data.open_unit);
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
  const practisingCount = sessions.filter((session) => statuses[session.id] === "practising").length;
  const progress = Math.round((masteredCount / sessions.length) * 100);
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

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    setAuthMessage("Sending your secure sign-in link…");
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${window.location.origin}${window.location.pathname}`,
      },
    });
    setAuthMessage(error ? error.message : "Check your email and open the sign-in link on this device.");
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    setAuthMessage(error ? error.message : "Signed out. Progress remains saved locally on this device.");
    if (!error) setAuthOpen(false);
  }

  function choosePart(part: number) {
    const units = weeklyUnits.slice(part * 4, part * 4 + 4);
    const firstCurrent = units.find((unit) => unit.sessions.some((session) => getStatus(session.id) !== "mastered"));
    setActivePart(part);
    setOpenUnit(firstCurrent?.week ?? part * 4 + 1);
  }

  function openSession(session: Session) {
    setActivePart(Math.floor((session.unit - 1) / 4));
    setOpenUnit(session.unit);
    window.requestAnimationFrame(() => document.getElementById("programme")?.scrollIntoView({ behavior: "smooth" }));
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

      <header className="site-header">
        <a className="brand" href="#today" aria-label="MathNest">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span><strong>MathNest</strong><small>Grade 2 math</small></span>
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
          <a href="#today" onClick={() => setMenuOpen(false)}>Today</a>
          <a href="#programme" onClick={() => setMenuOpen(false)}>Programme</a>
          <a href="#progress" onClick={() => setMenuOpen(false)}>Progress</a>
          <a href="#parent-guide" onClick={() => setMenuOpen(false)}>Parent guide</a>
        </nav>
        <a className="header-progress" href="#progress" aria-label={`${progress}% of the programme mastered`}>
          <span><i style={{ width: `${progress}%` }} /></span><b>{progress}%</b>
        </a>
        <div className="sync-menu">
          <button
            className={`sync-trigger sync-${syncState}`}
            onClick={() => setAuthOpen(!authOpen)}
            aria-expanded={authOpen}
            aria-controls="sync-panel"
          >
            <CloudIcon />
            <span>{user ? syncState === "syncing" ? "Syncing" : syncState === "error" ? "Sync issue" : "Synced" : "Sync progress"}</span>
            {user && <i aria-hidden="true" />}
          </button>

          {authOpen && (
            <aside className="sync-panel" id="sync-panel" aria-label="Progress synchronization">
              {user ? (
                <>
                  <span className="sync-panel-kicker">Cloud sync is on</span>
                  <h2>Your progress is protected.</h2>
                  <p>Signed in as <strong>{user.email}</strong>. Use the same email on another device to continue there.</p>
                  <div className={`sync-status-line sync-${syncState}`} aria-live="polite">
                    <i />
                    <span>{syncState === "syncing" ? "Saving changes…" : syncState === "error" ? "Local copy saved. Cloud will retry." : "Everything is up to date"}</span>
                  </div>
                  <button className="sign-out-button" onClick={signOut}>Sign out on this device</button>
                </>
              ) : (
                <>
                  <span className="sync-panel-kicker">Optional cloud backup</span>
                  <h2>Continue on any device.</h2>
                  <p>Enter your email. We will send a secure sign-in link, so there is no password to remember.</p>
                  <form onSubmit={sendMagicLink}>
                    <label htmlFor="sync-email">Email address</label>
                    <input
                      id="sync-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                    <button type="submit">Send sign-in link <ArrowIcon /></button>
                  </form>
                  <small>Your local progress will be combined with the cloud copy after you sign in.</small>
                </>
              )}
              {authMessage && <p className="auth-message" aria-live="polite">{authMessage}</p>}
            </aside>
          )}
        </div>
        <a className="header-download" href="worksheets/mathnest-math-exercises.zip" download>
          <DownloadIcon /><span>Download all</span>
        </a>
      </header>

      <section className="today-section" id="today">
        <div className="today-copy">
          <p className="eyebrow">Grade 2 home learning</p>
          <h1>Small lessons.<br />Strong foundations.</h1>
          <p className="today-lede">
            A calm mathematics programme built around understanding. Short sessions, clear parent guidance, and no pressure to rush.
          </p>
          <div className="programme-summary" aria-label="Programme summary">
            <span><strong>{weeklyUnits.length}</strong> units</span>
            <span><strong>{sessions.length}</strong> sessions</span>
            <span><strong>20</strong> min each</span>
          </div>
        </div>

        <article className="next-lesson-card" aria-label="Today's lesson">
          <header>
            <span className="today-label">{programmeComplete ? "Programme complete" : "Today’s lesson"}</span>
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

      <section className="programme-section" id="programme">
        <div className="section-heading">
          <div><p className="eyebrow">Learning pathway</p><h2>See the whole journey.<br />Open only what you need.</h2></div>
          <p>Choose a part, then open one unit. Work through its sessions in order, leave at least one day between them, and repeat whenever understanding is still developing.</p>
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
            <div><span>Part {activePart + 1} of 4</span><h3>{phases[activePart].name}</h3></div>
            <p>{phases[activePart].note}</p>
          </header>

          <div className="unit-grid">
            {visibleUnits.map((unit) => {
              const unitMastered = unit.sessions.filter((session) => getStatus(session.id) === "mastered").length;
              const unitPractising = unit.sessions.some((session) => getStatus(session.id) === "practising");
              const isOpen = openUnit === unit.week;
              return (
                <article className={`unit-card ${isOpen ? "open" : ""}`} key={unit.week}>
                  <button className="unit-summary" onClick={() => setOpenUnit(isOpen ? 0 : unit.week)} aria-expanded={isOpen}>
                    <span className="unit-number">Unit {String(unit.week).padStart(2, "0")}</span>
                    <span className="unit-title">{unitNames[unit.week - 1]}</span>
                    <span className={`unit-state ${unitMastered === unit.sessions.length ? "complete" : unitPractising ? "active" : ""}`}>
                      {unitMastered === unit.sessions.length ? "Mastered" : unitPractising ? "In progress" : `${unitMastered}/${unit.sessions.length} complete`}
                    </span>
                    <span className="unit-toggle-icon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="unit-detail">
                      <div className="weekly-note">
                        <span>Weekly rhythm</span>
                        <p>{unit.sessions.length > 2
                          ? "Teach one session at a time and in order, pausing at least a day between them. Repeat any session with new numbers if the move-on check is not yet secure."
                          : "Teach Session A, pause for at least one day, then teach Session B. Repeat with new numbers if the move-on check is not yet secure."}</p>
                        {unit.week === 1 && (
                          <a href="worksheets/mathnest-unit-01-warm-up-card.html" target="_blank" rel="noreferrer">Open the 2-minute warm-up card <ArrowIcon /></a>
                        )}
                      </div>

                      <div className="session-grid">
                        {unit.sessions.map((session) => {
                          const currentStatus = getStatus(session.id);
                          return (
                            <section className={`session-card session-${currentStatus}`} key={session.id}>
                              <header className="session-header">
                                <span className="session-letter">{session.letter}</span>
                                <div><span>Session {session.letter}</span><h4>{session.title}</h4></div>
                                <span className={`kind kind-${session.kind.toLowerCase()}`}>{session.kind}</span>
                              </header>

                              <div className="instruction-list">
                                <div><span>Goal</span><p>{session.focus}</p></div>
                                <div><span>What you do</span><p>{session.activity}</p></div>
                                <div><span>Move on when</span><p>{session.success}</p></div>
                              </div>

                              <div className="session-resources">
                                <a className="open-resource" href={`worksheets/${worksheetName(session)}`} target="_blank" rel="noreferrer"><BookIcon />Open worksheet</a>
                                <a href={`worksheets/${worksheetName(session)}`} download aria-label={`Download Unit ${unit.week}, Session ${session.letter}`}><DownloadIcon /><span>Download</span></a>
                              </div>

                              <fieldset className="status-control">
                                <legend>Learning status</legend>
                                {(["not-started", "practising", "mastered"] as SessionStatus[]).map((status) => (
                                  <button
                                    className={currentStatus === status ? "selected" : ""}
                                    aria-pressed={currentStatus === status}
                                    onClick={() => setStatus(session.id, status)}
                                    key={status}
                                  >
                                    {status === "mastered" && <span aria-hidden="true">✓</span>}{statusLabels[status]}
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

      <section className="progress-section" id="progress">
        <div className="section-heading progress-heading">
          <div><p className="eyebrow">Progress</p><h2>Understanding grows<br />one unit at a time.</h2></div>
          <div className="progress-overview">
            <strong>{progress}%</strong>
            <span>{masteredCount} mastered{practisingCount ? `, ${practisingCount} practising` : ""}</span>
          </div>
        </div>

        <div className="unit-progress-grid">
          {weeklyUnits.map((unit) => {
            const count = unit.sessions.filter((session) => getStatus(session.id) === "mastered").length;
            return (
              <button onClick={() => openSession(unit.sessions.find((session) => getStatus(session.id) !== "mastered") ?? unit.sessions[0])} key={unit.week}>
                <span className="progress-unit-number">{String(unit.week).padStart(2, "0")}</span>
                <span className="progress-unit-name">{unitNames[unit.week - 1]}</span>
                <span className="session-dots" aria-label={`${count} of ${unit.sessions.length} sessions mastered`}>
                  {unit.sessions.map((session) => <i className={`dot-${getStatus(session.id)}`} key={session.id} />)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="guide-section" id="parent-guide">
        <div className="section-heading">
          <div><p className="eyebrow">Parent guide</p><h2>Keep each lesson<br />small and successful.</h2></div>
          <p>Twenty minutes is enough on most days. Finish earlier when your child reaches a natural success, and return another day if frustration starts to rise.</p>
        </div>

        <div className="lesson-rhythm" aria-label="Suggested lesson timing">
          {[{ time: "2", label: "Warm up" }, { time: "6", label: "Model" }, { time: "8", label: "Exercise" }, { time: "5", label: "Play" }, { time: "2", label: "Explain" }].map((step, index) => (
            <div key={step.label}><span>{index + 1}</span><strong>{step.time}<small>min</small></strong><p>{step.label}</p></div>
          ))}
        </div>

        <div className="guide-details">
          <details open>
            <summary><span>01</span><strong>What to keep nearby</strong><i /></summary>
            <ul><li>Objects and drawings for modelling</li><li>Questions such as “show me how you know”</li><li>Untimed practice and playful fluency</li><li>One digit per square for written work</li></ul>
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
          <div><span>Ontario alignment</span><h3>Core learning and optional enrichment are clearly separated.</h3></div>
          <p>Grade 2 core work includes numbers to 200, addition and subtraction situations to 100, facts to 20, fair sharing, equal groups, patterns, data, measurement, and Canadian money. More advanced change, algorithms, halving, and clock reading remain optional extensions.</p>
        </div>
      </section>

      <footer>
        <div className="footer-brand"><span className="brand-mark">M</span><span><strong>MathNest</strong><small>Patient practice. Clear thinking.</small></span></div>
        <p>Built for the pleasure of finally understanding.</p>
        <div className="footer-actions"><a href="worksheets/mathnest-math-exercises.zip" download>Download all</a><a href="#today">Back to top ↑</a></div>
      </footer>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <a href="#today"><BookIcon /><span>Today</span></a>
        <a href="#programme"><RouteIcon /><span>Programme</span></a>
        <a href="#progress"><ChartIcon /><span>Progress</span></a>
        <a href="#parent-guide"><GuideIcon /><span>Guide</span></a>
      </nav>
    </main>
  );
}
