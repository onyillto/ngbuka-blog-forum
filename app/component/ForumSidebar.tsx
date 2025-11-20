"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronUp,
  MessageCircle,
  Zap,
  Car,
  Star,
  Home,
  User,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  postCount: number;
  icon: string;
}

const ForumSidebar = () => {
  const pathname = usePathname();
  const [openCategories, setOpenCategories] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
        const response = await fetch(`${apiBaseUrl}/categories`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch categories.");
        }

        setCategories(result.data);
      } catch (error: unknown) {
        setCategoriesError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const desktopSidebarItems = [
    { id: "home", name: "Home", icon: Home, href: "/forum/home" },
    {
      id: "trending",
      name: "Trending Topics",
      icon: Zap,
      href: "/forum/trending",
    },
    {
      id: "low-engagement",
      name: "Low Engagement",
      icon: MessageCircle,
      href: "/forum/low-engagement",
    },
    { id: "my-posts", name: "My Posts", icon: Star, href: "/forum/my-posts" },
  ];

  const mobileNavItems = [
    { id: "home", name: "Home", icon: Home, href: "/forum/home" },
    { id: "trending", name: "Trending", icon: Zap, href: "/forum/trending" },
    {
      id: "unread",
      name: "Unread",
      icon: MessageCircle,
      href: "/forum/low-engagement",
    },
    { id: "my-posts", name: "My Posts", icon: Star, href: "/forum/my-posts" },
    { id: "profile", name: "Profile", icon: User, href: "/forum/profile" },
  ];

  const isActive = (href: string) => pathname === href;

  const DesktopSidebar = () => (
    <div className="hidden md:flex w-72 bg-white shadow-lg border-r border-gray-200 h-screen flex-col fixed top-0 left-0 z-40">
      <div className="flex items-center px-6 py-4 border-b">
        <Link href="/">
          <Image
            src="/logo.png" // Assuming the same logo as the navbar
            alt="Ngbuka Logo"
            width={40}
            height={32}
          />
          {/* <span className="text-lg font-bold text-gray-900">Ngbuka Forum</span> */}
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {desktopSidebarItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "text-orange-600 bg-orange-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 ${
                isActive(item.href) ? "text-orange-600" : "text-gray-400"
              }`}
            />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );

  const MobileBottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white border-t border-gray-200 px-2 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          {mobileNavItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors w-1/5 ${
                isActive(item.href)
                  ? "text-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`h-6 w-6 ${
                  isActive(item.href) ? "text-orange-600" : "text-gray-400"
                }`}
              />
              <span
                className={`text-xs mt-1 transition-all duration-200 ${
                  isActive(item.href)
                    ? "font-semibold text-orange-600"
                    : "text-gray-500"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white h-safe-area-inset-bottom"></div>
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileBottomNav />
      <div className="md:hidden h-20"></div>
    </>
  );
};

export default ForumSidebar;
