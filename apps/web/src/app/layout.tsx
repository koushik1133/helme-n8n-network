import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventOps - Enterprise Event Operations Platform",
  description: "High-concurrency AI-powered Event Operations Platform for stadiums, rallies, airports, and major venues.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0b0f19]">{children}</body>
    </html>
  );
}
