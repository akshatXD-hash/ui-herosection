import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  title: "ITZFIZZ — Driven by the extraordinary",
  description: "A scroll-driven motion study. A timeless silhouette, a new perspective. Built with Next.js, GSAP, and Tailwind CSS.",
};

export const viewport: Viewport = { themeColor: "#f3f2eb" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
