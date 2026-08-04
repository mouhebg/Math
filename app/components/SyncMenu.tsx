"use client";

import { type FormEvent, useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowIcon, CloudIcon } from "./icons";

export type SyncState = "local" | "syncing" | "synced" | "error";

function syncLabel(user: User | null, syncState: SyncState) {
  if (!user) return "Sync progress";
  if (syncState === "syncing") return "Syncing";
  if (syncState === "error") return "Sync issue";
  return "Synced";
}

type SyncMenuProps = {
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
 * Cloud sign-in and sync status.
 *
 * This used to sit in the menu bar. The bar is gone, and this is the only way
 * to reach cloud sync, so it moved to the footer rather than leaving signed-out
 * readers with no way in and signed-in readers with no way out. The panel opens
 * upward for the same reason.
 *
 * Like everything else on the page it does not move: no transition, no
 * keyframe, no promoted layer. tests/rendered-html.test.mjs guards that.
 */
export default function SyncMenu({
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
}: SyncMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseAuth();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [authOpen, onCloseAuth]);

  // A press outside dismisses it. The listener exists only while the panel is
  // open, so the closed control costs nothing.
  useEffect(() => {
    if (!authOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current?.contains(event.target as Node)) return;
      onCloseAuth();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [authOpen, onCloseAuth]);

  return (
    <div className="sync-menu" ref={rootRef}>
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
  );
}
