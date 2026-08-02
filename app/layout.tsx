import type { Metadata } from "next";
import { Poppins, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Donia's Math Home | Grade 2",
  description: "A calm, mastery-based Grade 2 home mathematics plan with 32 downloadable exercises.",
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
        className={`${poppins.variable} ${lora.variable} ${plexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
