"use client";

import Link from "next/link";
import CreatePostModal, { PostPayload } from "./CreatePostModal";
import Cookies from "js-cookie";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageIcon, HeartIcon, PlusIcon, Loader2 } from "./Icons";

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
  slug?: string;
  author: Author | null;
  category: Category;
  commentCount: number;
  likes: string[];
  hasLiked?: boolean; // Add this to track liked status
  views: number;
  createdAt: string;
  isPinned: boolean;
  images: string[];
}

const LIMIT = 5;

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

export const TrendingDiscussions = ({
  filterCategories,
}: {
  filterCategories?: string[];
}) => {
  const [discussions, setDiscussions] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  const observerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(
    async (page: number, append = false) => {
      try {
        setError(null); // Reset error on new fetch
        if (!append) setLoading(true);

        const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
        let url = `${apiBaseUrl}/posts?page=${page}&limit=${LIMIT}`;

        if (filterCategories && filterCategories.length > 0) {
          url += `&category=${filterCategories.join(",")}&sort=-createdAt`;
        } else {
          url += `&sort=-views`;
        }
        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch posts.");
        }

        if (append) {
          setDiscussions((prev) => [...prev, ...result.data]);
        } else {
          // Check if the current user has liked each post
          const postsWithLikeStatus = result.data.map((post: Post) => ({
            ...post,
            hasLiked: currentUserId
              ? post.likes.includes(currentUserId)
              : false,
          }));
          setDiscussions(postsWithLikeStatus);
        }

        setHasMore(
          result.data.length === LIMIT && result.pagination?.pages > page
        );
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filterCategories, currentUserId]
  );

  useEffect(() => {
    // Get current user ID from localStorage to determine liked status
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setCurrentUserId(user._id);
      } catch (e) {
        console.error("Failed to parse user info:", e);
      }
    }

    fetchPosts(1, false);
  }, [fetchPosts]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    await fetchPosts(nextPage, true);
    setCurrentPage(nextPage);
  }, [currentPage, hasMore, loadingMore, loading, fetchPosts]);

  useEffect(() => {
    const node = observerRef.current; // Capture the current ref value
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [loadMore]);

  const handleLikeClick = async (e: React.MouseEvent, discussionId: string) => {
    e.preventDefault(); // Prevent the Link from navigating
    e.stopPropagation(); // Stop the event from bubbling up

    const token = Cookies.get("token");
    if (!token) {
      // Optionally, redirect to login or show a message
      console.log("User not logged in. Cannot like post.");
      return;
    }

    // Optimistic UI update
    setDiscussions((prevDiscussions) =>
      prevDiscussions.map((disc) => {
        if (disc._id === discussionId) {
          const wasLiked = disc.hasLiked;
          return {
            ...disc,
            hasLiked: !wasLiked,
            likes: wasLiked
              ? disc.likes.filter((id) => id !== currentUserId)
              : [...disc.likes, currentUserId!],
          };
        }
        return disc;
      })
    );

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      await fetch(`${apiBaseUrl}/posts/${discussionId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      // The UI is already updated, so we don't need to do anything on success.
      // You could re-fetch for consistency, but it's not necessary for a good UX.
    } catch (error) {
      console.error("Failed to like post:", error);
      // Revert the optimistic update on error
      setDiscussions((prevDiscussions) =>
        prevDiscussions.map((disc) => {
          if (disc._id === discussionId) {
            const wasLiked = !disc.hasLiked; // Revert the hasLiked status
            return {
              ...disc,
              hasLiked: wasLiked,
              likes: wasLiked
                ? disc.likes.filter((id) => id !== currentUserId)
                : [...disc.likes, currentUserId!],
            };
          }
          return disc;
        })
      );
    }
  };

  const handleNewPostClick = () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Please Login to create a post");
      router.push("/auth/signin"); // Optional: still redirect after showing the message
    } else {
      setCreatePostModalOpen(true);
    }
  };

  const handleSavePost = async (postData: PostPayload) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      let imageUrls: string[] = [];

      // Step 1: Upload images if any exist
      if (postData.images.length > 0) {
        const token = Cookies.get("token");

        const imageFormData = new FormData();
        postData.images.forEach((image) => {
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

        console.log(
          "Image upload response status:",
          imageUploadResponse.status
        );

        const imageResult = await imageUploadResponse.json();
        console.log("Image upload response body:", imageResult);

        if (!imageUploadResponse.ok || !imageResult.success) {
          throw new Error(imageResult.message || "Failed to upload images.");
        }

        // Correctly handle the { data: { urls: [...] } } response structure
        if (imageResult.data && Array.isArray(imageResult.data.urls)) {
          imageUrls = imageResult.data.urls.filter(Boolean); // Filter out any potential null/undefined values
        }
      }

      // Step 2: Create the post with image URLs
      const finalPostPayload = {
        title: postData.title,
        content: postData.content,
        categoryId: postData.categoryId,
        tags: postData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        images: imageUrls,
      };

      console.log(
        "Sending post payload:",
        JSON.stringify(finalPostPayload, null, 2)
      );

      const token = Cookies.get("token");
      const postResponse = await fetch(`${apiBaseUrl}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(finalPostPayload),
      });

      console.log("Post response status:", postResponse.status);
      console.log("Post response statusText:", postResponse.statusText);

      const result = await postResponse.json();
      console.log("Post response body:", result);

      if (!postResponse.ok || !result.success) {
        throw new Error(result.message || "Failed to create post.");
      }

      // Refresh first page to include the new post
      setCurrentPage(1);
      await fetchPosts(1, false);
      setCreatePostModalOpen(false);
    } catch (error: unknown) {
      console.error("Error in handleSavePost:", error);
      setSaveError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderSkeleton = () => (
    <div className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="flex items-center space-x-4 pt-3 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <MessageIcon className="mr-2 text-green-600" />
          {filterCategories && filterCategories.length > 0
            ? "Filtered Discussions"
            : "Hot Discussions"}
        </h2>
        <div className="flex items-center space-x-2">
          {/* <button className="text-sm text-blue-800 hover:text-blue-900 font-medium">
            View all
          </button> */}
          <button
            onClick={handleNewPostClick}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            New Post
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: LIMIT }).map((_, index) => (
            <div key={`skeleton-${index}`}>{renderSkeleton()}</div>
          ))
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : discussions.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-semibold text-gray-800">
              No Discussions Found
            </h3>
            <p className="text-gray-500 mt-2">
              {filterCategories && filterCategories.length > 0
                ? "Try adjusting your category filters to find what you're looking for."
                : "There are no discussions available at the moment."}
            </p>
          </div>
        ) : (
          discussions.map((discussion) => (
            <Link
              href={`/forum/post/${discussion._id}`}
              key={discussion._id}
              className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group"
            >
              {/* Header with badges and author */}
              <div className="p-4 pb-2">
                {/* Category badges */}
                <div className="flex items-center mb-3">
                  {discussion.isPinned && (
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full mr-2">
                      PINNED
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                    {discussion.category?.name || "Uncategorized"}
                  </span>
                </div>

                {/* Author Section - Now at Top */}
                <div className="flex items-center mb-3">
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center text-white font-semibold mr-3">
                    {discussion.author && discussion.author.avatar ? (
                      <Image
                        src={discussion.author.avatar}
                        alt={discussion.author.fullName}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm">
                        {discussion.author?.fullName?.charAt(0).toUpperCase() ||
                          "A"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {discussion.author?.fullName || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(discussion.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Featured Image - Full Width */}
              {discussion.images && discussion.images.length > 0 && (
                <div className="w-full h-64 grid grid-cols-2 grid-rows-2 gap-1">
                  {discussion.images.slice(0, 3).map((image, index) => {
                    const isFirst = index === 0;
                    const imageCount = discussion.images.length;

                    // Ensure the image is a valid, non-empty string before rendering to prevent "Invalid URL" errors.
                    if (
                      typeof image !== "string" ||
                      !image.startsWith("http")
                    ) {
                      return null;
                    }

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
                          alt={discussion.title || `Post image ${index + 1}`}
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

              {/* Title & Stats */}
              <div className="p-4">
                {/* Title - Now Below Image */}
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-800 transition-colors line-clamp-2 mb-4">
                  {discussion.title}
                </h3>

                {/* Stats Section */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MessageIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                      <span className="font-medium">
                        {discussion.commentCount}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleLikeClick(e, discussion._id)}
                      className="flex items-center group/like"
                    >
                      <HeartIcon
                        className={`w-4 h-4 mr-1.5 transition-colors ${
                          discussion.hasLiked
                            ? "text-red-500"
                            : "text-gray-400 group-hover/like:text-red-400"
                        }`}
                        filled={discussion.hasLiked}
                      />
                      <span className="font-medium">
                        {discussion.likes.length}
                      </span>
                    </button>
                    <div className="flex items-center text-gray-500">
                      <span className="font-medium">{discussion.views}</span>
                      <span className="ml-1 text-xs">views</span>
                    </div>
                  </div>
                  <div className="text-blue-800 group-hover:text-blue-900 text-sm font-medium flex items-center">
                    <span>View Post</span>
                    <span className="ml-1 transform group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
        {loadingMore && (
          <>
            {Array.from({ length: LIMIT }).map((_, index) => (
              <div key={`loading-more-${index}`}>{renderSkeleton()}</div>
            ))}
          </>
        )}
        {hasMore && !loadingMore && (
          <div ref={observerRef} className="p-4 text-center text-gray-500">
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            <p className="text-sm mt-1">Loading more...</p>
          </div>
        )}
      </div>
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setCreatePostModalOpen(false)}
        onSave={handleSavePost}
        isSaving={isSaving}
        error={saveError}
      />
    </div>
  );
};
