// DeletedPostsList.tsx
"use client";

import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import {
  Trash2,
  Eye,
  Clock,
  User,
  AlertTriangle,
  FolderOpen,
  ArrowLeft,
} from "lucide-react";
import DeletedPostDetailModal from "../../../../component/DeletedPostDetailModal";

// Define the shape of the data based on your API response
interface DeletedPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    level: string;
  };
  category: string; // Simplified for display
  tags: string[];
  views: number;
  likes: string[];
  commentCount: number;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
  deletedBy: {
    _id: string;
    fullName: string;
    level: string;
  };
  deletedAt: string;
  images: string[];
}

const mockDeletedPosts: DeletedPost[] = [
  // Mock data is now removed
];

const DeletedPostsList: React.FC = () => {
  const [posts, setPosts] = useState<DeletedPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<DeletedPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DeletedPost | null;
    direction: "ascending" | "descending";
  }>({ key: "deletedAt", direction: "descending" });

  // --- Fetching Function ---
  const fetchDeletedPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      const response = await fetch(`${apiBaseUrl}/posts/deleted`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch deleted posts.");
      }

      setPosts(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedPosts();
  }, []);

  // --- Sorting Logic ---
  const sortedPosts = React.useMemo(() => {
    const sortableItems = [...posts];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof DeletedPost];
        const bValue = b[sortConfig.key as keyof DeletedPost];

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [posts, sortConfig]);

  const requestSort = (key: keyof DeletedPost) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // --- UI Handlers ---
  const openPostDetails = (post: DeletedPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const getSortIcon = (key: keyof DeletedPost) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ArrowLeft className="w-3 h-3 ml-1 rotate-90" />
    ) : (
      <ArrowLeft className="w-3 h-3 ml-1 -rotate-90" />
    );
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-blue-900">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading Deleted Posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-300 text-red-700 rounded-lg shadow-md flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2" />
        <p className="font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Trash2 className="w-7 h-7 mr-3 text-red-600" />
                  Deleted Posts Archive
                </h1>
                <p className="text-gray-600 mt-1">
                  Review and manage soft-deleted posts
                </p>
              </div>
            </div>
            <button
              onClick={fetchDeletedPosts}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Sorting Controls */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex space-x-6 text-sm font-medium">
            {[
              { key: "deletedAt" as keyof DeletedPost, label: "Date Deleted" },
              { key: "title" as keyof DeletedPost, label: "Title" },
              { key: "author" as keyof DeletedPost, label: "Author" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => requestSort(option.key)}
                className={`p-2 rounded-md transition-colors flex items-center ${
                  sortConfig.key === option.key
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {option.label}
                {getSortIcon(option.key)}
              </button>
            ))}
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center p-12 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-500">
            <FolderOpen className="w-10 h-10 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">Archive is empty.</p>
            <p className="text-sm">No soft-deleted posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {sortedPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                      {post.title}
                    </h3>
                    <p className="text-sm text-blue-900 mb-3">
                      Category: {post.category} • Tags: {post.tags.join(", ")}
                    </p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        Posted by {post.author.fullName}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-red-500" />
                        Deleted by {post.deletedBy.fullName}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDateTime(post.deletedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="ml-6 flex flex-col items-end space-y-3 pt-1">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {post.views} views
                      </p>
                      <p className="text-sm text-gray-500">
                        {post.commentCount} comments
                      </p>
                    </div>
                    <button
                      onClick={() => openPostDetails(post)}
                      className="p-2 rounded-full bg-blue-100 text-blue-900 hover:bg-blue-200 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedPost && (
        <DeletedPostDetailModal post={selectedPost} onClose={closeModal} />
      )}
    </div>
  );
};

export default DeletedPostsList;
