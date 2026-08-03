import type { Metadata } from "next";
import { Lato, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const lato = Lato({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mathnest.ca"),
  title: "MathNest | Grade 2 math at home",
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
      <body
        className={`${lato.variable} ${sourceSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
