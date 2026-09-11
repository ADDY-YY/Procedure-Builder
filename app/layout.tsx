import type { Metadata } from "next";
import "./globals.css";
import { CreationFlow } from "../components/builder/creation-flow";
import { HowToUse } from "../components/builder/how-to-use";

export const metadata: Metadata = {
  title: "Procedure Builder",
  description: "Create clear, consistent knowledge documents with structured content and clean HTML exports.",
  other: {
    "codex-preview": "development",
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
      <body className="antialiased">{children}<CreationFlow /><HowToUse /></body>
    </html>
  );
}
