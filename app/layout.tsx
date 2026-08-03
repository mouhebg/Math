import type { Metadata } from "next";
import { sessions } from "@/data/sessions";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mathnest.ca"),
  title: "MathNest | Where numbers grow",
  // Counted rather than written down. This number is the search-result snippet,
  // and it had drifted to 34 while the programme grew to 60.
  description: `A calm, mastery-based Grade 2 home mathematics plan with ${sessions.length} downloadable exercises.`,
  other: {
    "codex-preview": "development",
    viewport: "width=device-width, initial-scale=1",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
