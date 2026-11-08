import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hackathon UniALFA",
  description: "Login, dashboard e listagem de projetos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
