"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  Loader2,
  Users,
  Search,
  
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Eye,
  UserX,
  
  X,
  ShieldCheck,
  ShieldX,
  Calendar,
  MessageSquare,
  FileText,
  TrendingUp,
  UserCheck,
 
  RefreshCcw,
  Download,
} from "lucide-react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: "user" | "dealer" | "admin";
  avatar?: string;
  postCount: number;
  commentCount: number;
  isVerified: boolean;
  isBanned: boolean;
  isCurrentlyBanned: boolean;
  level: string;
  reputation: number;
  createdAt: string;
  lastSeen: string;
  city?: string;
  state?: string;
  dealerLicense?: string;
  banReason?: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ApiResponse {
  success: boolean;
  data: User[];
  pagination: Pagination;
  message?: string;
}

type FilterType = "all" | "user" | "dealer" | "admin" | "banned" | "verified";

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 7)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (days > 1) return `${days}d ago`;
  if (days === 1) return "Yesterday";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours}h ago`;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchUsers = useCallback(
    async (page: number) => {
      setIsLoading(true);
      setError(null);

      const token = Cookies.get("token");
      if (!token) {
        toast.error("Authentication required. Please log in.");
        router.push("/auth/signin");
        return;
      }

      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
        const response = await fetch(
          `${apiBaseUrl}/user?page=${page}&limit=20&sort=-createdAt`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result: ApiResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch users.");
        }

        setUsers(result.data);
        setFilteredUsers(result.data);
        setPagination(result.pagination);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        if (errorMessage.includes("Not authorized")) {
          toast.error("Your session has expired. Please log in again.");
          router.push("/auth/signin");
        } else {
          setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...users];

    // Apply role filter
    if (activeFilter !== "all") {
      if (activeFilter === "banned") {
        filtered = filtered.filter((user) => user.isBanned);
      } else if (activeFilter === "verified") {
        filtered = filtered.filter((user) => user.isVerified);
      } else {
        filtered = filtered.filter((user) => user.role === activeFilter);
      }
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, activeFilter, searchQuery]);

  const handleBanUser = async (userId: string) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      const response = await fetch(`${apiBaseUrl}/user/${userId}/ban`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to ban user.");
      }

      toast.success("User has been banned successfully.");
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, isBanned: true } : u))
      );
      setActiveDropdown(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to ban user.");
      console.error("Ban user error:", err);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      const response = await fetch(`${apiBaseUrl}/user/${userId}/unban`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to unban user.");
      }

      toast.success("User has been unbanned successfully.");
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, isBanned: false } : u))
      );
      setActiveDropdown(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to unban user.");
      console.error("Unban user error:", err);
    }
  };

  const handleViewProfile = (userId: string) => {
    router.push(`/dashboard/users/${userId}`);
    setActiveDropdown(null);
  };

  const toggleDropdown = (userId: string) => {
    setActiveDropdown(activeDropdown === userId ? null : userId);
  };

  const ActionButton = ({
    onClick,
    icon: Icon,
    label,
    className = "",
  }: {
    onClick: () => void;
    icon: React.ElementType;
    label: string;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${className}`}
    >
      <Icon className="mr-3 h-4 w-4" /> {label}
    </button>
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (pagination?.pages || 1)) {
      setCurrentPage(newPage);
    }
  };

  // Calculate stats
  const stats = {
    total: pagination?.total || 0,
    admins: users.filter((u) => u.role === "admin").length,
    dealers: users.filter((u) => u.role === "dealer").length,
    banned: users.filter((u) => u.isBanned).length,
    verified: users.filter((u) => u.isVerified).length,
  };

  const filterOptions = [
    { id: "all" as FilterType, label: "All Users", count: stats.total },
    { id: "admin" as FilterType, label: "Admins", count: stats.admins },
    { id: "dealer" as FilterType, label: "Dealers", count: stats.dealers },
    { id: "verified" as FilterType, label: "Verified", count: stats.verified },
    { id: "banned" as FilterType, label: "Banned", count: stats.banned },
  ];

  const renderPagination = () => {
    if (!pagination || pagination.pages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {pagination.total}
            </span>{" "}
            results
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.pages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-[1600px] mx-auto p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Users className="text-white h-8 w-8" />
                </div>
                User Management
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and monitor all platform users
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchUsers(currentPage)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-white transition-colors shadow-sm"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-white transition-colors shadow-sm">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Admins
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.admins}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <ShieldCheck className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Dealers
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.dealers}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Verified
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.verified}
                  </p>
                </div>
                <div className="p-3 bg-teal-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Banned
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.banned}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <ShieldX className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setActiveFilter(option.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeFilter === option.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      activeFilter === option.id
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role & Level
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Last Seen
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
                      <p className="mt-3 text-sm text-gray-500 font-medium">
                        Loading users...
                      </p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
                      <p className="mt-3 text-sm text-red-600 font-medium">
                        {error}
                      </p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <Users className="mx-auto h-10 w-10 text-gray-400" />
                      <p className="mt-3 text-sm text-gray-500 font-medium">
                        No users found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      {/* User Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 flex-shrink-0">
                            <Image
                              src={
                                user.avatar ||
                                `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&size=128`
                              }
                              alt={user.fullName}
                              fill
                              className="rounded-full object-cover ring-2 ring-gray-100"
                            />
                            {user.isVerified && (
                              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                                <CheckCircle className="h-3.5 w-3.5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {user.fullName}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {user.email}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              ID: {user._id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Level Column */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold w-fit ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "dealer"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role === "admin" && (
                              <ShieldCheck className="h-3 w-3 mr-1" />
                            )}
                            {user.role.toUpperCase()}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 w-fit">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {user.level}
                          </span>
                        </div>
                      </td>

                      {/* Location Column */}
                      <td className="px-6 py-4">
                        {user.city && user.state ? (
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium">
                              {user.city}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {user.state}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>

                      {/* Activity Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">
                              {user.postCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-900">
                              {user.commentCount}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {user.reputation} reputation
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {user.isBanned ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-800 w-fit">
                              <ShieldX className="h-3 w-3 mr-1" />
                              Banned
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-800 w-fit">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </span>
                          )}
                          {user.isVerified && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-50 text-teal-700 w-fit">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              Verified
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Last Seen Column */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900 font-medium">
                            {formatRelativeTime(user.lastSeen)}
                          </div>
                          <div className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" />
                            Joined{" "}
                            {new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", year: "numeric" }
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => toggleDropdown(user._id)}
                            className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="More options"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          {activeDropdown === user._id && (
                            <div
                              ref={dropdownRef}
                              className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 border border-gray-100"
                            >
                              <div className="py-1">
                                <ActionButton
                                  onClick={() => handleViewProfile(user._id)}
                                  icon={Eye}
                                  label="View Profile"
                                />
                                {user.isBanned ? (
                                  <ActionButton
                                    onClick={() => handleUnbanUser(user._id)}
                                    icon={CheckCircle}
                                    label="Unban User"
                                    className="text-green-600 hover:bg-green-50"
                                  />
                                ) : (
                                  <ActionButton
                                    onClick={() => handleBanUser(user._id)}
                                    icon={UserX}
                                    label="Ban User"
                                    className="text-red-600 hover:bg-red-50"
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
