"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  User,
  LogOut,
  LogIn,
  X,
  ChevronDown,
  Menu,
} from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";

interface UserInfo {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  fullName?: string;
  avatar?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: UserInfo | null;
  isLoading: boolean;
}

const Navbar: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    isLoading: true,
  });
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- AUTH CHECK ---
  useEffect(() => {
    const token = Cookies.get("token");
    const userInfoStr = localStorage.getItem("user_info");

    if (!token || !userInfoStr) {
      setAuthState({ isLoggedIn: false, user: null, isLoading: false });
      return;
    }

    try {
      const userInfo: UserInfo = JSON.parse(userInfoStr);
      if (!userInfo._id || !userInfo.email) throw new Error("Invalid info");
      setAuthState({ isLoggedIn: true, user: userInfo, isLoading: false });
    } catch {
      Cookies.remove("token");
      localStorage.removeItem("user_info");
      setAuthState({ isLoggedIn: false, user: null, isLoading: false });
    }
  }, []);

  // --- CLOSE DROPDOWN WHEN CLICKING OUTSIDE ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        e.target instanceof Node &&
        !dropdownRef.current.contains(e.target)
      )
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGOUT ---
  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user_info");
    setAuthState({ isLoggedIn: false, user: null, isLoading: false });
    setIsDropdownOpen(false);
    window.location.href = "/";
  };

  const getDisplayName = (): string => {
    if (!authState.user) return "Guest";
    return (
      authState.user.firstName ||
      authState.user.fullName ||
      authState.user.email.split("@")[0] ||
      "User"
    );
  };

  // --- LOADING STATE ---
  if (authState.isLoading) {
    return (
      <nav className="h-14 flex items-center justify-between px-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="w-24 h-6 bg-gray-100 rounded animate-pulse"></div>
        <div className="w-20 h-6 bg-gray-100 rounded animate-pulse"></div>
      </nav>
    );
  }

  return (
    <nav className="relative h-14 sm:h-16 flex items-center justify-between px-4 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 z-50">
      {/* --- LEFT: MENU (mobile) + LOGO --- */}
      <div className="flex items-center space-x-3">
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>

        <Link href="/" className="flex items-center">
          <span className="text-lg font-bold text-orange-600">Forum</span>
        </Link>
      </div>

      {/* --- CENTER: SEARCH --- */}
      <div className="flex-1 mx-3 sm:mx-6">
        <div className="hidden sm:block relative">
          <input
            type="text"
            placeholder="Search topics..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white hover:bg-gray-50 transition"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>

        {/* --- Mobile Search Button --- */}
        <button
          onClick={() => setIsSearchOpen((p) => !p)}
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
        >
          {isSearchOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* --- RIGHT: AUTH --- */}
      <div ref={dropdownRef} className="relative flex items-center">
        {authState.isLoggedIn ? (
          <>
            <button
              onClick={() => setIsDropdownOpen((p) => !p)}
              className="flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center">
                {authState.user?.avatar ? (
                  <img
                    src={authState.user.avatar}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="text-white h-4 w-4" />
                )}
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {authState.user?.email}
                  </p>
                </div>
                <Link
                  href="/forum/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User className="h-4 w-4 mr-3 text-gray-500" />
                  Profile
                </Link>
                <Link
                  href="/forum/my-posts"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <svg
                    className="h-4 w-4 mr-3 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  My Posts
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
            className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Link>
        )}
      </div>

      {/* --- Mobile Search Dropdown --- */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-md py-2 px-4 sm:hidden animate-in slide-in-from-top-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search topics..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
