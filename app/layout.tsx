import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeReview·AI – Instant AI code reviews",
  description:
    "Paste your code and get an instant AI-powered review: bugs, security issues, performance tips, and style suggestions. Free to try. Bring your own API key.",
  openGraph: {
    title: "CodeReview·AI – Instant AI code reviews",
    description:
      "Paste code, get a structured review in seconds. Powered by Claude AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
