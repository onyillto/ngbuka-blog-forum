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
  ChevronDown,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  ShieldX,
  Eye,
  UserPlus,
  UserX,
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
  createdAt: string;
  lastSeen: string;
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

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 1) return `${days} days ago`;
  if (days === 1) return "Yesterday";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours} hours ago`;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes > 0) return `${minutes} minutes ago`;
  return "Just now";
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
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
          `${apiBaseUrl}/user?page=${page}&limit=10&sort=-createdAt`,
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

      // Update local state
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

      // Update local state
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
      className={`w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${className}`}
    >
      <Icon className="mr-3 h-4 w-4" /> {label}
    </button>
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (pagination?.pages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const renderPagination = () => {
    if (!pagination || pagination.total <= pagination.limit) return null;

    const pageNumbers = [];
    for (let i = 1; i <= pagination.pages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-6 px-6 pb-4">
        <span className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold">
            {(pagination.page - 1) * pagination.limit + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold">
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span>{" "}
          of <span className="font-semibold">{pagination.total}</span> users
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.pages}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="text-blue-900" />
            User Management
          </h1>
          <p className="text-gray-600 mt-1">
            View, manage, and monitor all users on the platform.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              Filter <ChevronDown className="h-4 w-4" />
            </button>
            {/* <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <UserPlus className="h-4 w-4" /> Add User
            </button> */}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Loading users...
                      </p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <Users className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        No users found
                      </p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 flex-shrink-0">
                            <Image
                              src={
                                user.avatar ||
                                `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
                              }
                              alt={user.fullName}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {user.isVerified && (
                            <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </span>
                          )}
                          {user.isBanned && (
                            <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              <ShieldX className="h-3 w-3 mr-1" />
                              Banned
                            </span>
                          )}
                          {!user.isVerified && !user.isBanned && (
                            <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => toggleDropdown(user._id)}
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            aria-label="More options"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          {activeDropdown === user._id && (
                            <div
                              ref={dropdownRef}
                              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                            >
                              <div
                                className="py-1"
                                role="menu"
                                aria-orientation="vertical"
                              >
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
