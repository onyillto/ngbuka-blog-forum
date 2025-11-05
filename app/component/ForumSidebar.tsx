"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronUp,
  MessageCircle,
  Zap,
  Car,
  Star,
  Settings,
  Home,
  User,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  postCount: number;
  icon: string; // Emoji from API
}

const ForumSidebar = () => {
  const [openCategories, setOpenCategories] = useState(true);
  const [activeCategory, setActiveCategory] = useState("home");
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
      id: "unread",
      name: "Unread Posts",
      icon: MessageCircle,
      href: "/forum/unread",
    },
    { id: "my-posts", name: "My Posts", icon: Star, href: "/forum/my-posts" },
    {
      id: "settings",
      name: "Forum Settings",
      icon: Settings,
      href: "/forum/settings",
    },
  ];

  // Mobile bottom navigation items
  const mobileNavItems = [
    { id: "home", name: "Home", icon: Home, href: "/forum/home" },
    { id: "trending", name: "Trending", icon: Zap, href: "/forum/trending" },
    {
      id: "unread",
      name: "Unread",
      icon: MessageCircle,
      href: "/forum/unread",
    },
    { id: "my-posts", name: "My Posts", icon: Star, href: "/forum/my-posts" },
    { id: "profile", name: "Profile", icon: User, href: "/profile" },
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden md:flex w-72 bg-white shadow-lg border-r border-gray-200 h-screen flex-col fixed top-0 left-0 z-40">
      {/* Logo */}
      <div className="flex items-center space-x-2 px-6 py-4 border-b">
        <Car className="h-6 w-6 text-orange-600" />
        <span className="text-xl font-bold text-gray-900">Ngbuka Forum</span>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {/* Main Navigation Items */}
        {desktopSidebarItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setActiveCategory(item.id)}
            className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === item.id
                ? "text-orange-600 bg-orange-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 ${
                activeCategory === item.id ? "text-orange-600" : "text-gray-400"
              }`}
            />
            {item.name}
          </Link>
        ))}

        {/* Categories Divider */}
        <div className="border-t border-gray-100 my-4" />

        {/* Categories Toggle */}
        <button
          onClick={() => setOpenCategories(!openCategories)}
          className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
            openCategories
              ? "text-gray-900 bg-gray-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          Categories
          <ChevronUp
            className={`ml-auto h-4 w-4 transition-transform ${
              openCategories ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Categories Section */}
        {openCategories && (
          <div className="space-y-1 mt-2 pl-3">
            {categoriesLoading ? (
              <p className="text-xs text-gray-500 p-3">Loading categories...</p>
            ) : categoriesError ? (
              <p className="text-xs text-red-500 p-3">{categoriesError}</p>
            ) : (
              categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/forum/category/${category.slug}`}
                  onClick={() => setActiveCategory(category.slug)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category.slug
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                  <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full border">
                    {category.postCount}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}
      </nav>
    </div>
  );

  // Mobile Bottom Navigation
  const MobileBottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Bottom Navigation Bar */}
      <div className="bg-white border-t border-gray-200 px-2 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          {mobileNavItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors w-1/5 ${
                activeCategory === item.id
                  ? "text-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`h-6 w-6 ${
                  activeCategory === item.id
                    ? "text-orange-600"
                    : "text-gray-400"
                }`}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Safe area padding for iOS devices */}
      <div className="bg-white h-safe-area-inset-bottom"></div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Mobile content padding to account for bottom nav */}
      <div className="md:hidden h-20"></div>
    </>
  );
};

export default ForumSidebar;
