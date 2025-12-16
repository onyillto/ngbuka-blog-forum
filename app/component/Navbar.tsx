"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  Bell,
  MailOpen,
  Eye,
} from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import NotificationViewerModal from "./NotificationViewerModal";
import NotificationItem from "../(Landing)/forum/notifications/NotificationItem";
import DesktopUserMenu from "./DesktopUserMenu";
import MobileMenu from "./MobileMenu";
import { formatTimeAgo } from "./utils";

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

interface Notification {
  _id: string;
  user: string;
  type: "post_deleted" | "new_comment" | "new_like" | string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  sender?: string;
}
// ** NOTIFICATION INTEGRATION END **

// ** NOTIFICATION COMPONENT START **
const NotificationDropdown: React.FC<{
  notifications: Notification[];
  onOpenModal: (notification: Notification) => void;
  onMarkAllRead: () => void;
  onMarkOneRead: (id: string) => void;
  // 🚨 CHANGE 1: Renamed for clarity and simplification
  onCloseDropdown: () => void;
}> = ({
  notifications,
  onOpenModal,
  onMarkAllRead,
  onMarkOneRead,
  onCloseDropdown, // 🚨 Using the new prop name
}) => {
  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Bell className="h-6 w-6 mx-auto mb-2" />
        <p className="text-sm">No new notifications.</p>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-h-[500px] w-80 sm:w-96 flex flex-col">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-800">
          Notifications ({unreadCount} unread)
        </p>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-medium text-orange-600 hover:text-orange-700 transition"
          >
            Mark all read
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {notifications.map((n) => (
          <NotificationItem
            key={n._id}
            notification={n}
            onMarkAsRead={onMarkOneRead}
            onOpenModal={onOpenModal}
          />
        ))}
      </div>
      {/* <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 px-4 py-2.5">
        <Link
          href="/forum/notification"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="block text-center text-sm font-medium text-orange-600 hover:text-orange-700 transition"
        >
          View all notifications
        </Link>
      </div> */}
    </div>
  );
};
// ** NOTIFICATION COMPONENT END **

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
        width={size} // Use the size prop for width
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

interface SearchResultsProps {
  results: Post[];
  isSearching: boolean;
  error: string | null;
  searchTerm: string;
  onResultClick: () => void;
}

// Search Results Component
const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isSearching,
  error,
  searchTerm,
  onResultClick,
}) => {
  if (
    isSearching &&
    typeof searchTerm === "string" &&
    searchTerm.trim().length > 2
  ) {
    return <div className="p-4 text-center text-gray-500">Searching...</div>;
  }
  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }
  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No results found for &ldquo;{searchTerm}&quot;.
      </div>
    );
  }

  return (
    <div className="p-2 divide-y divide-gray-100 max-h-80 overflow-y-auto">
      {results.map((post: Post) => (
        <Link
          key={post._id}
          href={`/forum/posts/${post._id}`}
          onClick={onResultClick}
          className="flex flex-col p-2 hover:bg-gray-50 rounded-lg transition"
        >
          <p className="text-sm font-medium text-gray-800 line-clamp-1">
            {post.title}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <span className="flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {post.views} views
            </span>
            <span className="flex items-center">
              <MessageCircle className="h-3 w-3 mr-1" />
              {post.commentCount} comments
            </span>
          </div>
        </Link>
      ))}
      <Link
        href={`/forum/search?q=${encodeURIComponent(searchTerm)}`}
        onClick={onResultClick}
        className="block text-center text-sm font-medium text-orange-600 hover:text-orange-700 py-3 transition border-t mt-2"
      >
        View all results
      </Link>
    </div>
  );
};

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

  // ** NOTIFICATION INTEGRATION START **
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  // ** NOTIFICATION INTEGRATION END **

  const pathname = usePathname();
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Auth check and Notification Fetch
  const fetchAndSetUser = async () => {
    const token = Cookies.get("token");
    const userInfoStr = localStorage.getItem("user_info");
    let storedUser: UserInfo | null = null;

    if (userInfoStr) {
      try {
        storedUser = JSON.parse(userInfoStr);
      } catch (e) {
        console.error("Failed to parse user info from localStorage", e);
      }
    }

    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_BaseURL ;
      let shouldFetchNotifications = false;

      if (token && storedUser?._id) {
        // 1. Fetch Fresh User Profile Data
        const userProfileResponse = await fetch(
          `${apiBaseUrl}/user/profile/${storedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!userProfileResponse.ok) {
          // If token is invalid or expired, log the user out
          if (
            userProfileResponse.status === 401 ||
            userProfileResponse.status === 403
          ) {
            handleLogout(false); // Don't redirect immediately
            throw new Error("Token invalid/expired. Logging out.");
          }
          throw new Error("Failed to fetch fresh profile data.");
        }

        const profileResult = await userProfileResponse.json();
        if (profileResult.success && profileResult.data) {
          setUser(profileResult.data);
          localStorage.setItem("user_info", JSON.stringify(profileResult.data));
          shouldFetchNotifications = true;
        }
      }

      // 2. Fetch Notifications (Requires authentication)
      if (shouldFetchNotifications) {
        const notificationResponse = await fetch(
          `${apiBaseUrl}/notifications`, // Your endpoint
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (notificationResponse.ok) {
          const notificationResult = await notificationResponse.json();
          if (
            notificationResult.success &&
            notificationResult.data?.notifications
          ) {
            setNotifications(notificationResult.data.notifications);
          }
        } else {
          console.warn(
            "Failed to fetch notifications:",
            notificationResponse.statusText
          );
        }
      }
    } catch (error) {
      console.error("Error during auth/notification fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // User Dropdown
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setShowUserDropdown(false);
      }
      // Search Dropdown
      if (
        !searchInputRef.current?.contains(e.target as Node) &&
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(e.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
      // ** NOTIFICATION INTEGRATION START **
      // Use this ref on the button/div containing the button in the main navbar
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(e.target as Node)
      ) {
        setShowNotificationDropdown(false);
      }
      // ** NOTIFICATION INTEGRATION END **
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchAndSetUser();
  }, []);

  // Prevent body scroll on mobile menu or search open
  useEffect(() => {
    if (
      showMobileMenu ||
      mobileSearchOpen ||
      showNotificationDropdown ||
      selectedNotification
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [
    showMobileMenu,
    mobileSearchOpen,
    showNotificationDropdown,
    selectedNotification,
  ]);

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
    setShowNotificationDropdown(false); // Close notifications on route change
    setSelectedNotification(null);
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

  const handleLogout = (shouldRedirect = true) => {
    Cookies.remove("token");
    localStorage.removeItem("user_info");
    setUser(null);
    setNotifications([]); // Clear notifications on logout
    setShowUserDropdown(false);
    setShowMobileMenu(false);
    if (shouldRedirect) {
      window.location.href = "/";
    }
  };

  const closeAllMenus = () => {
    setShowSearchDropdown(false);
    setSearchTerm("");
    setShowMobileMenu(false);
    setMobileSearchOpen(false);
    setShowNotificationDropdown(false); // Close notifications
    setSelectedNotification(null);
  };

  // 🚨 CHANGE 3: Simplified the dropdown close handler.
  const handleCloseNotificationDropdown = () => {
    setShowNotificationDropdown(false);
  };

  const handleOpenNotificationModal = (notification: Notification) => {
    console.log(
      "[3/4] Navbar: handleOpenNotificationModal called. Setting state.",
      notification
    );
    setSelectedNotification(notification);
  };

  // ** NOTIFICATION INTEGRATION START **
  const handleMarkAllRead = async () => {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_BaseURL ;
    const token = Cookies.get("token");

    if (!token) return;

    try {
      const response = await fetch(
        `${apiBaseUrl}/notifications/read`, // Corrected endpoint
        {
          method: "POST", // Corrected method
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Optimistically update the UI
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } else {
        console.error("Failed to mark all notifications as read.");
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleMarkOneRead = async (notificationId: string) => {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_BaseURL;
    const token = Cookies.get("token");

    if (!token) return;

    // Optimistically update the UI first
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
    );

    try {
      const response = await fetch(
        `${apiBaseUrl}/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("API call failed");
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ** NOTIFICATION INTEGRATION END **

  const getDisplayName = () =>
    user?.firstName || user?.fullName || user?.email.split("@")[0] || "User";

  if (isLoading) {
    return (
      <nav className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="w-20 h-6 bg-gray-100 rounded animate-pulse" />
        <div className="w-16 h-6 bg-gray-100 rounded animate-pulse" />
      </nav>
    );
  }

  return (
    <>
      <nav className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm relative z-50">
        {/* Left: Logo & Mobile Menu Button */}
        <div className="flex items-center gap-1 sm:gap-3 flex-1 min-w-0">
          <button
            onClick={() => setShowMobileMenu(true)}
            className="sm:hidden p-1.5 rounded-lg hover:bg-gray-100 transition shrink-0"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
          <Link href="/" className="flex items-center min-w-0 md:hidden">
            <span className="text-base sm:text-lg font-bold text-orange-600 truncate">
              Ngbuka
            </span>
          </Link>
        </div>

        {/* Center: Search (Button on mobile, Input on desktop) */}
        <div
          ref={searchDropdownRef}
          className="flex flex-1 justify-center relative sm:mx-6 max-w-xl lg:max-w-2xl"
        >
          {/* Mobile Search Button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition shrink-0 sm:hidden"
            aria-label="Search"
          >
            {mobileSearchOpen ? (
              <X className="h-5 w-5 text-gray-700" />
            ) : (
              <Search className="h-5 w-5 text-gray-700" />
            )}
          </button>

          {/* Desktop Search Input */}
          <div className="hidden sm:block relative w-full">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() =>
                searchTerm.trim().length > 2 && setShowSearchDropdown(true)
              }
              className="w-full pl-9 pr-9 py-2 sm:py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
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

        {/* Right: Auth & Notifications */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1 min-w-0">
          {/* ** NOTIFICATION BUTTON ** */}
          {user && (
            <div
              // This ref is crucial for the outside click detection
              ref={notificationDropdownRef}
              className="relative hidden sm:block"
            >
              <button
                onClick={() => setShowNotificationDropdown((prev) => !prev)}
                className="p-2 rounded-full hover:bg-gray-100 transition relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 text-xs font-bold bg-red-600 text-white rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}
          {/* ** NOTIFICATION BUTTON END ** */}

          {/* User Menu */}
          {user ? (
            <div ref={userDropdownRef} className="relative">
              {/* Desktop User Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserDropdown(!showUserDropdown);
                }}
                className="hidden sm:flex items-center gap-2 pl-2 pr-2 sm:pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition max-w-[200px]"
              >
                <UserAvatar user={user} size={28} />
                <span className="text-sm font-medium text-gray-700 truncate hidden md:inline">
                  Hi, {getDisplayName()}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform shrink-0 ${
                    showUserDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mobile User/Menu Button (Delegates to Mobile Menu Overlay) */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="sm:hidden flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition"
                aria-label="Profile"
              >
                <span className="text-sm font-medium text-gray-700 truncate">
                  Hi, {getDisplayName()}
                </span>
                <UserAvatar user={user} size={24} />
              </button>

              {/* Desktop User Dropdown */}
              {showUserDropdown && (
                <DesktopUserMenu
                  user={user}
                  displayName={getDisplayName()}
                  onClose={() => setShowUserDropdown(false)}
                  onLogout={() => handleLogout(true)}
                />
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="flex items-center gap-1 sm:gap-1.5 bg-orange-600 hover:bg-orange-700 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium shadow-sm transition shrink-0"
            >
              <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Login</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-lg sm:hidden z-40 overflow-hidden">
          <div className="relative px-3 py-3">
            <input
              type="text"
              placeholder="Search topics, posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
              autoFocus
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {searchTerm.trim().length > 2 && (
            <div className="bg-white border-t border-gray-200 rounded-t-none rounded-b-xl shadow-lg max-h-96 overflow-hidden">
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
        <MobileMenu
          user={user}
          displayName={getDisplayName()}
          unreadCount={unreadCount}
          onClose={() => setShowMobileMenu(false)}
          onLogout={() => handleLogout(true)}
          onOpenNotifications={() => {
            setShowMobileMenu(false);
            setShowNotificationDropdown(true);
          }}
        />
      )}

      {/* ** GLOBAL NOTIFICATION DROPDOWN OVERLAY (Handles all screen sizes) ** */}
      {showNotificationDropdown && (
        <div
          className="fixed inset-0 z-[60] flex justify-center items-start pt-16 sm:justify-end sm:items-start sm:pt-16 sm:pr-4"
          onClick={(e) => {
            // Only close if click is on the backdrop, not the dropdown content
            if (e.target === e.currentTarget) {
              handleCloseNotificationDropdown();
            }
          }}
        >
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden w-full max-w-sm sm:w-80 md:w-96 mt-2">
            <NotificationDropdown
              notifications={notifications}
              onOpenModal={handleOpenNotificationModal}
              onMarkAllRead={handleMarkAllRead}
              onMarkOneRead={handleMarkOneRead}
              // 🚨 CHANGE 4: Passing the simplified closing function
              onCloseDropdown={handleCloseNotificationDropdown}
            />
          </div>
        </div>
      )}

      {selectedNotification && (
        <NotificationViewerModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </>
  );
};

export default Navbar;
