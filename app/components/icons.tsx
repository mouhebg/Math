// The icon set, in one place so the header and the page draw the same shapes.
// Every icon inherits stroke and size from the `svg` rule in globals.css.

export function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export function DownloadIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" /></svg>;
}

export function BookIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v18H7.5A3.5 3.5 0 0 0 4 23.5v-18Zm16 0A3.5 3.5 0 0 0 16.5 2H12v18h4.5a3.5 3.5 0 0 1 3.5 3.5v-18Z" /></svg>;
}

export function RouteIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H13a3 3 0 0 1 0 6h-2a3 3 0 0 0 0 6h4.5" /></svg>;
}

export function GuideIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21a9 9 0 1 0-9-9m9-4v4l3 2" /><path d="M3 16v5h5" /></svg>;
}

export function CloudIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 19h11a4 4 0 0 0 .6-8A6 6 0 0 0 6.4 9 5 5 0 0 0 6.5 19Z" /><path d="m9 14 2 2 4-5" /></svg>;
}

// Two separate glyphs rather than one bar that folds into a cross. The folding
// version needed transitions on two pseudo-elements inside the fixed bar, which
// is the class of work the menu bar is now kept clear of.
export function MenuIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
}

export function CloseIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>;
}

export function MathNestMark() {
  return (
    <img
      className="mathnest-mark"
      src="/mathnest-logo-mark.png"
      width="512"
      height="512"
      alt=""
      aria-hidden="true"
    />
  );
}
