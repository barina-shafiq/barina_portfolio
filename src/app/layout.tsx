import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/ui/SmoothScrollProvider";

export const metadata: Metadata = {
  title: "Barina Shafique | CS Graduate & Masters Scholar",
  description:
    "Portfolio of Barina Shafique — Computer Science graduate specializing in Machine Learning, NLP, and Full-Stack Development. Seeking Masters scholarship opportunities abroad.",
  keywords: [
    "Barina Shafique",
    "Computer Science",
    "Machine Learning",
    "NLP",
    "Portfolio",
    "Masters Scholarship",
    "Research",
    "AI",
    "Pakistan",
  ],
  authors: [{ name: "Barina Shafique" }],
  openGraph: {
    title: "Barina Shafique | CS Graduate & Masters Scholar",
    description:
      "Explore research, projects, and skills of Barina Shafique — a passionate CS graduate applying for Masters scholarships abroad.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barina Shafique | CS Graduate & Masters Scholar",
    description:
      "Portfolio of Barina Shafique — CS graduate, researcher, and Masters scholarship applicant.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
