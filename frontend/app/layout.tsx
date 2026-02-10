import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export const metadata: Metadata = {
  title: "PhotoRetriever - Find Your Event Photos",
  description: "Intelligent photo retrieval system using AI to find your photos from events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
