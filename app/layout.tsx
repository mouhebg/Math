import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mathnest.ca"),
  title: "MathNest | Where numbers grow",
  description: "A calm, mastery-based Grade 2 home mathematics plan with 34 downloadable exercises.",
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
