import type { Metadata } from "next";
import "../src/styles/main.scss";

export const metadata: Metadata = {
  title: "Trello Clone - Kanban Board",
  description:
    "A Trello-like Kanban board built with Next.js, TypeScript, and SCSS",
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
