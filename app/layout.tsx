import React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ngbuka Forum",
    template: "%s | Ngbuka Forum",
  },
  description:
    "Join the Ngbuka Forum, a vibrant car enthusiast community where you can discuss, share, and learn about automotive topics.",
  keywords: [
    "car forum",
    "automotive community",
    "car enthusiasts",
    "Ngbuka",
    "auto forum",
  ],
  authors: [{ name: "Ngbuka Team", url: "https://ngbuka.com" }],
  openGraph: {
    title: "Ngbuka Forum",
    description: "Car enthusiast community forum",
    url: "https://ngbuka.com/forum",
    siteName: "Ngbuka Forum",
    images: [
      {
        url: "https://ngbuka.com/images/forum-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ngbuka Forum OG Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ngbuka Forum",
    description: "Car enthusiast community forum",
    images: ["https://ngbuka.com/images/forum-og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
