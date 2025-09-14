import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "../../component/Navbar";
import ForumSidebar from "../../component/ForumSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

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
}>) {
  return (
    <html lang="en">
      <body
      
      >
        <div className="flex min-h-screen">
          {/* Sidebar - fixed width */}
          <aside className="w-72 bg-white border-r border-gray-200 shadow-lg">
            <ForumSidebar />
          </aside>

          {/* Main Area - grows to fill */}
          <div className="flex-1 flex flex-col">
            {/* Navbar on top */}
            <header className="h-16 bg-gray-100 border-b border-gray-200 shadow-sm">
              <Navbar />
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}