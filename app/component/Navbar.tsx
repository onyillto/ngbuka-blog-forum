"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, User, LogOut, LogIn, X, ChevronDown } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? Cookies.get("token") : null;
    const userInfo =
      typeof window !== "undefined" ? localStorage.getItem("user_info") : null;

    if (token) {
      setIsLoggedIn(true);
      if (userInfo) {
        const user = JSON.parse(userInfo);
        setUsername(user.firstName || user.email);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      Cookies.remove("token");
      localStorage.removeItem("user_info");
    }
    setIsLoggedIn(false);
    setUsername("Guest");
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="relative h-12 md:h-16 flex items-center justify-between px-3 md:px-4 bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 w-full">
      {/* Search Bar */}
      <div className="flex-1 flex justify-start md:justify-center">
        {/* Desktop Search */}
        <div className="hidden md:block relative w-full max-w-xs md:max-w-md">
          <input
            type="text"
            placeholder="Search topics..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        {/* Mobile Search Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors duration-150"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Auth Section */}
      <div
        ref={dropdownRef}
        className={`relative flex items-center space-x-0 md:space-x-0 ml-3 md:ml-6 ${
          isSearchOpen ? "hidden" : "flex"
        }`}
      >
        {isLoggedIn ? (
          <>
            {/* User Trigger - Desktop */}
            <div
              className="hidden md:flex items-center space-x-2 cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors duration-150">
                <User className="h-4 w-4 text-orange-600" />
              </div>
              <span className="text-gray-900 font-medium capitalize pr-2">
                {username}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* User Trigger - Mobile */}
            <div className="md:hidden cursor-pointer" onClick={toggleDropdown}>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors duration-150">
                <User className="h-4 w-4 text-orange-600" />
              </div>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 md:right-auto mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200/50 z-20 py-1">
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User className="h-4 w-4 mr-3 text-gray-500" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <Link
            href="/auth/signin"
            className="px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 font-medium flex items-center space-x-2 text-sm md:text-base shadow-sm hover:shadow-md transition-all duration-200"
          >
            <LogIn className="h-4 w-4 md:h-5 md:w-5" />
            <span>Get Started</span>
          </Link>
        )}
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-full bg-white/95 backdrop-blur-sm flex items-center px-3 z-10">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search topics..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="ml-3 p-2 text-gray-600 hover:text-gray-900 transition-colors duration-150"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
