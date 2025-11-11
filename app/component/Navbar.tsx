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
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";

// ============ TYPES ============
interface UserInfo {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  fullName?: string;
  avatar?: string;
  role?: "user" | "dealer" | "admin" | "moderator";
}

interface Post {
  _id: string;
  title: string;
  author: { _id: string; fullName: string; avatar?: string };
  categoryDetails: { _id: string; name: string };
  createdAt: string;
  views: number;
  commentCount: number;
}

// ============ UTILITIES ============
const formatTimeAgo = (dateString: string) => {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
  return `${Math.floor(seconds / 31536000)}y ago`;
};

// ============ SUB-COMPONENTS ============

// Search Results Component
const SearchResults: React.FC<{
  results: Post[];
  isSearching: boolean;
  error: string | null;
  searchTerm: string;
  onResultClick: () => void;
}> = ({ results, isSearching, error, searchTerm, onResultClick }) => {
  if (isSearching) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-orange-600" />
          <span className="text-sm text-gray-600">Searching...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 mx-auto mb-3 flex items-center justify-center">
          <X className="h-6 w-6 text-red-600" />
        </div>
        <p className="text-sm text-red-600 font-medium">{error}</p>
        <p className="text-xs text-gray-500 mt-1">Please try again</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto mb-3 flex items-center justify-center">
          <Search className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-700 font-medium">No results found</p>
        <p className="text-xs text-gray-500 mt-1">Try different keywords</p>
      </div>
    );
  }

  return (
    <div className="max-h-[500px] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3">
        <p className="text-xs font-semibold text-gray-500 uppercase">
          Results ({results.length})
        </p>
      </div>
      <div className="divide-y divide-gray-100">
        {results.map((post) => (
          <Link
            href={`/forum/post/${post._id}`}
            key={post._id}
            onClick={onResultClick}
            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shrink-0 mt-1">
              <Search className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 line-clamp-2 mb-1">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span className="font-medium text-gray-700">
                  {post.author?.fullName || "Anonymous"}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
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
          </Link>
        ))}
      </div>
      {results.length >= 5 && (
        <div className="border-t border-gray-100 p-3">
          <Link
            href={`/search?q=${encodeURIComponent(searchTerm)}`}
            onClick={onResultClick}
            className="block text-center text-sm font-medium text-orange-600 hover:bg-orange-50 py-2 rounded-lg transition"
          >
            View all results →
          </Link>
        </div>
      )}
    </div>
  );
};

// User Avatar Component
const UserAvatar: React.FC<{ user: UserInfo | null; size?: number }> = ({
  user,
  size = 32,
}) => (
  <div
    className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center overflow-hidden"
    style={{ width: size, height: size }}
  >
    {user?.avatar ? (
      <Image
        src={user.avatar}
        alt="avatar"
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    ) : (
      <User
        className="text-white"
        style={{ width: size / 2, height: size / 2 }}
      />
    )}
  </div>
);

// ============ MAIN NAVBAR ============
const Navbar: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const pathname = usePathname();
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // Auth check
  useEffect(() => {
    const token = Cookies.get("token");
    const userInfoStr = localStorage.getItem("user_info");

    if (token && userInfoStr) {
      try {
        const userInfo: UserInfo = JSON.parse(userInfoStr);
        if (userInfo._id && userInfo.email) {
          setUser(userInfo);
        }
      } catch {
        Cookies.remove("token");
        localStorage.removeItem("user_info");
      }
    }
    setIsLoading(false);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setShowUserDropdown(false);
      }
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(e.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim().length > 2) {
        fetchSearchResults(searchTerm.trim());
        setShowSearchDropdown(true);
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
        setSearchError(null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setMobileSearchOpen(false);
    setShowSearchDropdown(false);
  }, [pathname]);

  const fetchSearchResults = async (query: string) => {
    setIsSearching(true);
    setSearchError(null);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      const res = await fetch(
        `${apiBaseUrl}/posts/search?q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Search failed");
      setSearchResults(data.data);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Search failed");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user_info");
    setUser(null);
    setShowUserDropdown(false);
    setShowMobileMenu(false);
    window.location.href = "/";
  };

  const closeAllMenus = () => {
    setShowSearchDropdown(false);
    setSearchTerm("");
    setShowMobileMenu(false);
    setMobileSearchOpen(false);
  };

  const getDisplayName = () =>
    user?.firstName || user?.fullName || user?.email.split("@")[0] || "User";

  if (isLoading) {
    return (
      <nav className="h-14 sm:h-16 flex items-center justify-between px-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="w-24 h-6 bg-gray-100 rounded animate-pulse" />
        <div className="w-20 h-6 bg-gray-100 rounded animate-pulse" />
      </nav>
    );
  }

  return (
    <>
      <nav className="h-14 sm:h-16 flex items-center justify-between px-4 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm relative z-50">
        {/* Left: Logo & Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileMenu(true)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
          <Link href="/" className="flex items-center">
            <span className="text-lg font-bold text-orange-600">
              Ngbuka Forum
            </span>
          </Link>
        </div>

        {/* Center: Desktop Search */}
        <div
          ref={searchDropdownRef}
          className="hidden sm:flex flex-1 mx-6 max-w-2xl relative"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search topics, posts, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() =>
                searchTerm.trim().length > 2 && setShowSearchDropdown(true)
              }
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setShowSearchDropdown(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Desktop Search Results Dropdown */}
          {showSearchDropdown && searchTerm.trim().length > 2 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-50">
              <SearchResults
                results={searchResults}
                isSearching={isSearching}
                error={searchError}
                searchTerm={searchTerm}
                onResultClick={closeAllMenus}
              />
            </div>
          )}
        </div>

        {/* Right: Auth & Mobile Search Button */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {mobileSearchOpen ? (
              <X className="h-5 w-5 text-gray-700" />
            ) : (
              <Search className="h-5 w-5 text-gray-700" />
            )}
          </button>

          {/* User Menu */}
          {user ? (
            <div ref={userDropdownRef} className="relative">
              {/* Desktop User Button */}
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <UserAvatar user={user} />
                <span className="text-sm font-medium text-gray-700">
                  Hi, {getDisplayName()}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    showUserDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mobile User Button */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <UserAvatar user={user} />
              </button>

              {/* Desktop User Dropdown */}
              {showUserDropdown && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">
                      {getDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    href="/forum/profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/dashboard/users"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/forum/my-posts"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <MessageCircle className="h-4 w-4" />
                    My Posts
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-lg sm:hidden z-40 p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search topics, posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {searchTerm.trim().length > 2 && (
            <div className="mt-3 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-hidden">
              <SearchResults
                results={searchResults}
                isSearching={isSearching}
                error={searchError}
                searchTerm={searchTerm}
                onResultClick={closeAllMenus}
              />
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 sm:hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              {user && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                  <UserAvatar user={user} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {getDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 space-y-2">
              <Link
                href="/"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <Home className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Home</span>
              </Link>
              <Link
                href="/forum"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <MessageCircle className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Forum</span>
              </Link>

              {user ? (
                <>
                  <Link
                    href="/forum/profile"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                  >
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium">Profile</span>
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/dashboard/users"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                    >
                      <ShieldCheck className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                  )}
                  <Link
                    href="/forum/my-posts"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                  >
                    <MessageCircle className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium">My Posts</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                >
                  <LogIn className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium">Login</span>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
