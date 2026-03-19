import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://code-review-topaz.vercel.app"
  ),
  title: "CodeReview·AI – Instant AI code reviews",
  description:
    "Paste your code and get an instant AI-powered review: bugs, security issues, performance tips, and style suggestions. Free to try. Bring your own API key.",
  keywords: [
    "code review",
    "ai code review",
    "automated code review",
    "code analysis",
    "bug detection",
    "security review",
  ],
  openGraph: {
    title: "CodeReview·AI – Instant AI code reviews",
    description:
      "Paste code, get a structured review in seconds. Bugs, security, performance, and style. Powered by Claude AI.",
    type: "website",
    url: "/",
    siteName: "CodeReview·AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeReview·AI – Instant AI code reviews",
    description:
      "Paste code, get a structured review in seconds. Bugs, security, performance, and style. Powered by Claude AI.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "CodeReview·AI",
              description:
                "Instant AI-powered code review. Detects bugs, security issues, performance problems, and style issues.",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web Browser",
              url: "https://code-review-topaz.vercel.app",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Bug detection",
                "Security vulnerability analysis",
                "Performance optimization tips",
                "Code style suggestions",
                "Multi-language support",
              ],
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
