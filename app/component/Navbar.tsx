"use client";

import React, { useState, useEffect } from "react";
import { Search, User, LogOut, LogIn, X } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) {
      setIsLoggedIn(true);
      setUsername("JohnDoe"); // Replace with real user data
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    setIsLoggedIn(false);
    setUsername("Guest");
  };

  return (
    <nav className="relative h-12 md:h-16 flex items-center justify-between px-3 md:px-4 bg-gray-100 w-full border-b border-gray-200">
      {/* Search Bar */}
      <div className="flex-1 flex justify-start md:justify-center">
        {/* Desktop Search */}
        <div className="hidden md:block relative w-full max-w-xs md:max-w-md">
          <input
            type="text"
            placeholder="Search topics..."
            className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 border rounded-md md:rounded-lg text-sm md:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Search className="absolute left-2.5 md:left-3 top-2 md:top-2.5 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
        </div>
        {/* Mobile Search Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 -ml-2 text-gray-600"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Auth Section */}
      <div
        className={`flex items-center space-x-2 md:space-x-4 ml-3 md:ml-6 ${
          isSearchOpen ? "hidden" : "flex"
        }`}
      >
        {isLoggedIn ? (
          <>
            {/* Desktop User Info */}
            <div className="hidden md:flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-gray-900 font-medium">{username}</span>
            </div>

            {/* Mobile User Avatar */}
            <div className="md:hidden">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-orange-600" />
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 md:py-1 bg-red-100 text-red-600 rounded-md md:rounded-lg hover:bg-red-200 text-sm md:text-base"
            >
              <LogOut className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-3 md:px-4 py-1.5 md:py-2 bg-orange-600 text-white rounded-md md:rounded-lg hover:bg-orange-700 font-medium flex items-center space-x-1 md:space-x-2 text-sm md:text-base"
          >
            <LogIn className="h-4 w-4 md:h-5 md:w-5" />
            <span>Login</span>
          </Link>
        )}
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-full bg-gray-100 flex items-center px-3 z-10">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search topics..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="ml-2 p-2 text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
