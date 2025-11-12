import type { Metadata } from "next";

import Navbar from "../../component/Navbar";
import ForumSidebar from "../../component/ForumSidebar";

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
    <div className="flex min-h-screen bg-gray-50">
      {/* ForumSidebar handles its own responsive behavior */}
      <ForumSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-72">
        {/* Navbar */}
        <header className="sticky top-0 z-30">
          <Navbar />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto sm:px-4 py-6 pb-24 md:pb-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
