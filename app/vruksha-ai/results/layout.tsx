import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analysis Results — Vruksha AI",
  description:
    "View the detailed AI-powered analysis of your plant, including disease detection, treatment, and care recommendations.",
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
