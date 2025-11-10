"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  User,
  LogOut,
  LogIn,
  X,
  ChevronDown,
  Menu,
  Clock,
  TrendingUp,
  Home,
  Users,
  MessageCircle,
  Settings,
} from "lucide-react";
import { ShieldCheck } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";

interface UserInfo {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  fullName?: string;
  avatar?: string;
  role?: "user" | "dealer" | "admin";
}

interface AuthState {
  isLoggedIn: boolean;
  user: UserInfo | null;
  isLoading: boolean;
}

interface Author {
  _id: string;
  fullName: string;
  avatar?: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Post {
  _id: string;
  title: string;
  author: Author;
  categoryDetails: Category;
  createdAt: string;
  views: number;
  commentCount: number;
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} years ago`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} months ago`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} days ago`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hours ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minutes ago`;
  return `${Math.floor(seconds)} seconds ago`;
};

const Navbar: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    isLoading: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [showSearchResultsDropdown, setShowSearchResultsDropdown] =
    useState(false);
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

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

  // --- CLOSE DROPDOWNS WHEN CLICKING OUTSIDE ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        e.target instanceof Node &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        searchDropdownRef.current &&
        e.target instanceof Node &&
        !searchDropdownRef.current.contains(e.target)
      ) {
        setShowSearchResultsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- DEBOUNCED SEARCH EFFECT ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim().length > 2) {
        fetchSearchResults(searchTerm.trim());
        setShowSearchResultsDropdown(true);
      } else {
        setSearchResults([]);
        setShowSearchResultsDropdown(false);
        setSearchError(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchSearchResults = async (query: string) => {
    setIsSearching(true);
    setSearchError(null);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      const response = await fetch(
        `${apiBaseUrl}/posts/search?q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch search results.");
      }
      setSearchResults(data.data);
    } catch (err: unknown) {
      setSearchError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // --- LOGOUT ---
  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user_info");
    setAuthState({ isLoggedIn: false, user: null, isLoading: false });
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    window.location.href = "/";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to a full search results page if needed
      // router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleResultClick = () => {
    setShowSearchResultsDropdown(false);
    setSearchTerm("");
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
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

  // Close mobile search when navigating
  useEffect(() => {
    setIsSearchOpen(false);
    setShowSearchResultsDropdown(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
    <>
      <nav className="relative h-14 sm:h-16 flex items-center justify-between px-4 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 z-50">
        {/* --- LEFT: MENU (mobile) + LOGO --- */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-lg font-bold text-orange-600">
              Ngbuka Forum
            </span>
          </Link>
        </div>

        {/* --- CENTER: SEARCH (Desktop) --- */}
        <div
          className="hidden sm:flex flex-1 mx-3 sm:mx-6 max-w-2xl relative"
          ref={searchDropdownRef}
        >
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search topics, posts, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (searchTerm.trim().length > 2) {
                    setShowSearchResultsDropdown(true);
                  }
                }}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white hover:bg-gray-50 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setShowSearchResultsDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>

          {/* Search Results Dropdown (Desktop) */}
          {showSearchResultsDropdown && searchTerm.trim().length > 2 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-[500px] overflow-hidden">
              {isSearching ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-orange-600"></div>
                    <span className="text-sm text-gray-600">Searching...</span>
                  </div>
                </div>
              ) : searchError ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                  <p className="text-sm text-red-600 font-medium">
                    {searchError}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Please try again</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    No results found
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Try searching with different keywords
                  </p>
                </div>
              ) : (
                <div className="max-h-[500px] overflow-y-auto">
                  {/* Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Search Results ({searchResults.length})
                    </p>
                  </div>

                  {/* Results */}
                  <div className="divide-y divide-gray-100">
                    {searchResults.map((post) => (
                      <Link
                        href={`/forum/post/${post._id}`}
                        key={post._id}
                        onClick={handleResultClick}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                      >
                        {/* Icon */}
                        <div className="shrink-0 mt-1">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <Search className="h-4 w-4 text-orange-600" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 mb-1">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <span className="font-medium text-gray-700">
                              {post.author?.fullName || "Anonymous"}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium">
                              {post.categoryDetails?.name || "Uncategorized"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(post.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {post.views} views
                            </span>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="shrink-0 mt-3">
                          <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                            <svg
                              className="w-3 h-3 text-gray-400 group-hover:text-orange-600 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Footer - View All */}
                  {searchResults.length >= 5 && (
                    <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent border-t border-gray-100 p-3">
                      <Link
                        href={`/search?q=${encodeURIComponent(searchTerm)}`}
                        onClick={handleResultClick}
                        className="block text-center text-sm font-medium text-orange-600 hover:text-orange-700 py-2 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        View all results for &quot;{searchTerm}&quot; →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- MOBILE SEARCH BUTTON --- */}
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

        {/* --- RIGHT: AUTH --- */}
        <div ref={dropdownRef} className="relative flex items-center">
          {authState.isLoggedIn ? (
            <>
              <button
                onClick={() => setIsDropdownOpen((p) => !p)}
                className="hidden sm:flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center overflow-hidden">
                  {authState.user?.avatar ? (
                    <Image
                      src={authState.user.avatar}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User className="text-white h-4 w-4" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Hi, {getDisplayName()}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mobile User Avatar */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center overflow-hidden">
                  {authState.user?.avatar ? (
                    <Image
                      src={authState.user.avatar}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User className="text-white h-4 w-4" />
                  )}
                </div>
              </button>

              {/* Desktop Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 sm:block hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">
                      {getDisplayName()}
                    </p>
                  </div>
                  <Link
                    href="/forum/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4 mr-3 text-gray-500" />
                    Profile
                  </Link>
                  {authState.user?.role === "admin" && (
                    <Link
                      href="/dashboard/users"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4 mr-3 text-gray-500" />
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/forum/my-posts"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 mr-3 text-gray-500" />
                    My Posts
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
      </nav>

      {/* --- Mobile Menu Overlay --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 sm:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 translate-x-0">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              {authState.isLoggedIn && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-800">
                    {getDisplayName()}
                  </p>
                </div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Home</span>
              </Link>
              <Link
                href="/forum"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageCircle className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Forum</span>
              </Link>
              {authState.isLoggedIn ? (
                <>
                  <Link
                    href="/forum/profile"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Profile
                    </span>
                  </Link>
                  {authState.user?.role === "admin" && (
                    <Link
                      href="/dashboard/users"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShieldCheck className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Dashboard
                      </span>
                    </Link>
                  )}
                  <Link
                    href="/forum/my-posts"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MessageCircle className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      My Posts
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Login
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Mobile Search Dropdown --- */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg sm:hidden z-50">
          <div className="p-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search topics, posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => {
                    if (searchTerm.trim().length > 2) {
                      setShowSearchResultsDropdown(true);
                    }
                  }}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setShowSearchResultsDropdown(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Search Results (Mobile) */}
            {showSearchResultsDropdown && searchTerm.trim().length > 2 && (
              <div className="mt-3 bg-white border border-gray-200 rounded-xl shadow-lg max-h-[400px] overflow-hidden">
                {isSearching ? (
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-orange-600"></div>
                      <span className="text-sm text-gray-600">
                        Searching...
                      </span>
                    </div>
                  </div>
                ) : searchError ? (
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-2">
                      <X className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-sm text-red-600 font-medium">
                      {searchError}
                    </p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-700 font-medium">
                      No results found
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Try different keywords
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                    <div className="divide-y divide-gray-100">
                      {searchResults.map((post) => (
                        <Link
                          href={`/forum/post/${post._id}`}
                          key={post._id}
                          onClick={handleResultClick}
                          className="flex items-start gap-3 p-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        >
                          <div className="shrink-0 mt-1">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                              <Search className="h-4 w-4 text-orange-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                              <span className="font-medium">
                                {post.author?.fullName || "Anonymous"}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium">
                                {post.categoryDetails?.name || "Uncategorized"}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatTimeAgo(post.createdAt)}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {searchResults.length >= 5 && (
                      <div className="border-t border-gray-100 p-3">
                        <Link
                          href={`/search?q=${encodeURIComponent(searchTerm)}`}
                          onClick={handleResultClick}
                          className="block text-center text-sm font-medium text-orange-600 py-2 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          View all results →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
