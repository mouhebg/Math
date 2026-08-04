"use client";

import { type FormEvent, useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowIcon, CloudIcon, MathNestMark } from "./icons";

export type SyncState = "local" | "syncing" | "synced" | "error";

function syncLabel(user: User | null, syncState: SyncState) {
  if (!user) return "Sync progress";
  if (syncState === "syncing") return "Syncing";
  if (syncState === "error") return "Sync issue";
  return "Synced";
}

type SiteHeaderProps = {
  progress: number;
  syncState: SyncState;
  user: User | null;
  authOpen: boolean;
  onToggleAuth: () => void;
  onCloseAuth: () => void;
  email: string;
  onEmailChange: (value: string) => void;
  authMessage: string;
  onSubmitEmail: (event: FormEvent<HTMLFormElement>) => void;
  onSignOut: () => void;
};

/**
 * The menu bar: the brand, the progress meter and the sync control.
 *
 * The Today / Programme / Parent guide links have been removed, and with them
 * the small-screen menu toggle, which existed only to open them. The bottom
 * navigation still carries those three destinations on a phone, and the brand
 * still returns to the top.
 *
 * It is deliberately plain. An earlier version animated a `::after` underline
 * under each nav link with `will-change: transform` and `backface-visibility`,
 * inside a `position: fixed` bar that was itself promoted with `translateZ(0)`.
 * Every pointer entry and exit built and tore down a compositor layer over the
 * whole viewport, so simply moving the mouse across the bar held the page at
 * half frame rate and blocked the main thread for hundreds of milliseconds at a
 * time. Measured on a 20x-throttled CPU: 414ms blocked and 36 of 49 frames late
 * with the underline, 0ms blocked and 8 of 84 late without it. The cost grew
 * with the page underneath, which is why it only became obvious after opening
 * the programme.
 *
 * The rules that follow from that, and that the rebuilt bar keeps:
 *  - nothing in the bar is layer-promoted: no `will-change`, no `translateZ(0)`,
 *    no `backface-visibility`, no `filter` or `backdrop-filter`
 *  - hover and open states are flat colour swaps on the element itself, never a
 *    transitioned pseudo-element
 *  - the progress fill is set, not animated; it changes when a session changes
 *  - no scroll listener and no scroll-linked state, so scrolling stays a
 *    compositor-only job
 *
 * tests/rendered-html.test.mjs guards each of these.
 */
export default function SiteHeader({
  progress,
  syncState,
  user,
  authOpen,
  onToggleAuth,
  onCloseAuth,
  email,
  onEmailChange,
  authMessage,
  onSubmitEmail,
  onSignOut,
}: SiteHeaderProps) {
  const syncMenuRef = useRef<HTMLDivElement>(null);

  // Escape closes the sync panel, the only thing the bar opens.
  useEffect(() => {
    if (!authOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseAuth();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [authOpen, onCloseAuth]);

  // A press anywhere outside the sync panel dismisses it. The listener exists
  // only while the panel is open, so the closed bar costs nothing.
  useEffect(() => {
    if (!authOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (syncMenuRef.current?.contains(event.target as Node)) return;
      onCloseAuth();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [authOpen, onCloseAuth]);

  return (
    <header className="site-header">
      <a className="brand" href="#today" aria-label="MathNest, where numbers grow">
        <span className="brand-mark"><MathNestMark /></span>
        <span className="brand-words"><strong>MathNest</strong><small>Where numbers grow</small></span>
      </a>

      <div className="header-tools">
        {/* Points at the programme, where a session's status is actually set. */}
        <a
          className="header-progress"
          href="#programme"
          aria-label={`${progress}% of the programme mastered. Open the programme.`}
        >
          <span className="header-progress-track">
            <i style={{ width: `${progress}%` }} aria-hidden="true" />
          </span>
          <b>{progress}%</b>
        </a>

        <div className="sync-menu" ref={syncMenuRef}>
          <button
            className={`sync-trigger sync-${syncState}`}
            onClick={onToggleAuth}
            aria-expanded={authOpen}
            aria-controls="sync-panel"
          >
            <CloudIcon />
            <span>{syncLabel(user, syncState)}</span>
            {user && <i aria-hidden="true" />}
          </button>

          {authOpen && (
            <aside className="sync-panel" id="sync-panel" aria-label="Progress synchronisation">
              {user ? (
                <>
                  <span className="sync-panel-kicker">Cloud sync is on</span>
                  <h2>Your progress is protected.</h2>
                  <p>Signed in as <strong>{user.email}</strong>. Use the same email on another device to continue there.</p>
                  <div className={`sync-status-line sync-${syncState}`} aria-live="polite">
                    <i />
                    <span>{syncState === "syncing" ? "Saving changes…" : syncState === "error" ? "Local copy saved. Cloud will retry." : "Everything is up to date"}</span>
                  </div>
                  <button className="sign-out-button" onClick={onSignOut}>Sign out on this device</button>
                </>
              ) : (
                <>
                  <span className="sync-panel-kicker">Optional cloud backup</span>
                  <h2>Continue on any device.</h2>
                  <p>Enter your email. We will send a secure sign-in link, so there is no password to remember.</p>
                  <form onSubmit={onSubmitEmail}>
                    <label htmlFor="sync-email">Email address</label>
                    <input
                      id="sync-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => onEmailChange(event.target.value)}
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
      </div>
    </header>
  );
}
