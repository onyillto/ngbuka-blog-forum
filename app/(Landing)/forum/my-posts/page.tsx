"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import CreatePostModal, {
  PostPayload,
} from "../../../component/CreatePostModal";
import {
  MessageIcon,
  FireIcon,
  SearchIcon,
  HeartIcon,
  PlusIcon,
  TrashIcon,
} from "../../../component/Icons";
import { Eye, Filter, Loader2, AlertTriangle } from "lucide-react";
import { LogIn } from "lucide-react";
interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    avatar?: string;
  };
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  views: number;
  likes: string[];
  commentCount: number;
  images: string[];
  isPinned: boolean;
  isLocked: boolean;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

const MyPostsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);

    const token = Cookies.get("token");
    const userInfo = localStorage.getItem("user_info");
    if (!userInfo || !token) {
      setError("You must be logged in to view this page.");
      setIsLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userInfo);
      const token = Cookies.get("token");
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;

      const response = await fetch(
        `${apiBaseUrl}/user/${user._id}/posts?page=1&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch posts.");
      }

      setPosts(result.data);
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
  };

  useEffect(() => {
    fetchPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreatePost = async (data: PostPayload) => {
    setIsSavingPost(true);
    setSaveError(null);

    const userInfo = localStorage.getItem("user_info");
    if (!userInfo) {
      setSaveError("User not found. Please log in again.");
      setIsSavingPost(false);
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      const token = Cookies.get("token");
      let imageUrls: string[] = [];

      if (data.images.length > 0) {
        const imageFormData = new FormData();
        data.images.forEach((image) => {
          imageFormData.append("images", image);
        });

        const imageUploadResponse = await fetch(
          `${apiBaseUrl}/posts/upload-images`,
          {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: imageFormData,
          }
        );

        const imageResult = await imageUploadResponse.json();

        if (!imageUploadResponse.ok || !imageResult.success) {
          throw new Error(imageResult.message || "Failed to upload images.");
        }

        if (imageResult.data && Array.isArray(imageResult.data.urls)) {
          imageUrls = imageResult.data.urls.filter(Boolean);
        }
      }

      const finalPostPayload = {
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        tags: data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        images: imageUrls,
      };

      const postResponse = await fetch(`${apiBaseUrl}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(finalPostPayload),
      });

      const result = await postResponse.json();

      if (!postResponse.ok || !result.success) {
        throw new Error(result.message || "Failed to create post.");
      }

      setIsCreateModalOpen(false);
      await fetchPosts();
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSavingPost(false);
    }
  };

  const openDeleteModal = (postId: string) => {
    setPostToDelete(postId);
    setIsDeleteModalOpen(true);
  };

  const handleDeletePost = async () => {
    if (isDeleting || !postToDelete) return;

    const token = Cookies.get("token");
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      router.push("/auth/signin");
      return;
    }

    setIsDeleting(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      const response = await fetch(`${apiBaseUrl}/posts/${postToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete post.");
      }

      toast.success("Post deleted successfully!");
      await fetchPosts(); // Refresh the list
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      if (errorMessage.includes("Not authorized")) {
        toast.error("Your session has expired. Please log in again.");
        router.push("/auth/signin");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    }
  };

  const handleNewPostClick = () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Please Login to create a post");
      router.push("/auth/signin");
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const getUserStats = () => {
    const totalPosts = posts.length;
    const totalReplies = posts.reduce(
      (sum, post) => sum + post.commentCount,
      0
    );
    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
    const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);

    return { totalPosts, totalReplies, totalViews, totalLikes };
  };

  const stats = getUserStats();

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center w-full"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {" "}
      {/* Add overflow-x-hidden */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreatePost}
        isSaving={isSavingPost}
        error={saveError}
      />
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-start">
              <div className="mx-auto  flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Delete Post
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this post? This action
                    cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                {isDeleting && (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {" "}
        {/* Remove px-4 for mobile */}
        {/* Page Header */}
        <div className="mb-8">
          {" "}
          <div className="flex items-center justify-between ">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <MessageIcon className="mr-3 text-green-600" />
                My Posts
              </h1>
              <p className="text-gray-600">
                Manage and track all your forum posts and discussions
              </p>
            </div>
            {/* <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              New Post
            </button> */}
          </div>
        </div>
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {" "}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalPosts}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100">
                <MessageIcon className="text-blue-800" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Comments
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalReplies}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                <MessageIcon className="text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Views</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100">
                <FireIcon className="text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalLikes}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100">
                <HeartIcon className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
        {/* Search and Filter */}
        <div className="bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-lg p-4 sm:p-6 mb-8">
          {/* Adjust padding and remove rounded/shadow on mobile */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <h2 className="text-lg font-semibold text-gray-900">
                All Posts ({filteredPosts.length})
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search my posts..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        {/* Posts List */}
        <div className="space-y-4">
          {" "}
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group relative"
            >
              {/* Header with badges and author */}
              <div className="p-4 pb-2">
                {/* Category badges */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {post.isPinned && (
                      <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full mr-2">
                        PINNED
                      </span>
                    )}
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                      {post.category.name}
                    </span>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openDeleteModal(post._id)}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Author Section */}
                <div className="flex items-center mb-3">
                  <div className="relative w-10 h-10 rounded-full  flex items-center justify-center text-white font-semibold mr-3">
                    {post.author && post.author.avatar ? (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.fullName}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm">
                        {post.author?.fullName?.charAt(0).toUpperCase() || "A"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {post.author?.fullName || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(post.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Featured Image - Full Width with Grid Layout */}
              {post.images && post.images.length > 0 && (
                <div className="w-full h-64 grid grid-cols-2 grid-rows-2 gap-1">
                  {post.images.slice(0, 3).map((image, index) => {
                    const isFirst = index === 0;
                    const imageCount = post.images.length;

                    if (!image) return null;

                    return (
                      <div
                        key={index}
                        className={`relative ${
                          isFirst && imageCount > 1
                            ? "col-span-1 row-span-2"
                            : "col-span-1 row-span-1"
                        } ${imageCount === 1 ? "col-span-2 row-span-2" : ""}`}
                      >
                        <Image
                          src={image}
                          alt={post.title || `Post image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {index === 2 && imageCount > 3 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                              +{imageCount - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Title & Content */}
              <div className="p-4">
                <Link href={`/forum/post/${post._id}`}>
                  <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 cursor-pointer">
                    {post.title}
                  </h4>
                </Link>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {post.content}
                </p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-900 text-xs px-2 py-1 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats Section */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MessageIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                      <span className="font-medium">{post.commentCount}</span>
                    </div>
                    <div className="flex items-center">
                      <HeartIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                      <span className="font-medium">{post.likes.length}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Eye className="w-4 h-4 mr-1.5 text-gray-400" />
                      <span className="font-medium">{post.views}</span>
                    </div>
                  </div>
                  <Link
                    href={`/forum/post/${post._id}`}
                    className="text-blue-600 group-hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    <span>View Post</span>
                    <span className="ml-1 transform group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageIcon className="text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "No posts match your search."
                : "You don't have any posts yet."}
            </p>
            <button
              onClick={handleNewPostClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create Your First Post
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyPostsPage;
