import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NFC Water Check",
  description: "Track consumed water liters from NFC tags",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
