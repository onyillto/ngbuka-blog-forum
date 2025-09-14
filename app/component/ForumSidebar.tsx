"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronUp,
  MessageCircle,
  Zap,
  Car,
  ShoppingBag,
  Star,
  Calendar,
  Users,
  Settings,
  Home,
  User,
  LogOut,
} from "lucide-react";

const ForumSidebar = () => {
  const [openCategories, setOpenCategories] = useState(true);
  const [activeCategory, setActiveCategory] = useState("home");
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const categories = [
    {
      id: "general",
      name: "General Discussion",
      count: 1234,
      icon: Users,
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: "performance",
      name: "Engine & Performance",
      count: 856,
      icon: Zap,
      color: "bg-red-100 text-red-700",
    },
    {
      id: "ev",
      name: "Electric Vehicles",
      count: 432,
      icon: Car,
      color: "bg-green-100 text-green-700",
    },
    {
      id: "buysell",
      name: "Buy & Sell",
      count: 567,
      icon: ShoppingBag,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      id: "reviews",
      name: "Car Reviews",
      count: 389,
      icon: Star,
      color: "bg-purple-100 text-purple-700",
    },
    {
      id: "events",
      name: "Events & Meetups",
      count: 145,
      icon: Calendar,
      color: "bg-pink-100 text-pink-700",
    },
  ];

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

  const handleItemClick = (itemId: string, href: string) => {
    setActiveCategory(itemId);
    // Handle navigation here
    console.log("Navigate to:", href);
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden md:flex w-72 bg-white shadow-lg border-r border-gray-200 h-screen flex-col">
      {/* Logo */}
      <div className="flex items-center space-x-2 px-6 py-4 border-b">
        <Car className="h-6 w-6 text-orange-600" />
        <span className="text-xl font-bold text-gray-900">Ngbuka Forum</span>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {/* Main Navigation Items */}
        {desktopSidebarItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            onClick={() => handleItemClick(item.id, item.href)}
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
          </a>
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
          <div className="space-y-1 mt-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-full ${category.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span>{category.name}</span>
                  </div>
                  <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full border">
                    {category.count}
                  </span>
                </button>
              );
            })}
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
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id, item.href)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
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
            </button>
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
