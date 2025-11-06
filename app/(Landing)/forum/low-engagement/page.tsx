"use client";

import Link from "next/link";
import CreatePostModal, {
  PostPayload,
} from "../../../component/CreatePostModal";
import Cookies from "js-cookie";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  MessageIcon,
  HeartIcon,
  PlusIcon,
  Loader2,
} from "../../../component/Icons";
import { Eye } from "lucide-react";

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
  hasLiked?: boolean;
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

const UnreadPage = () => {
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

  const observerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(
    async (page: number, append = false) => {
      try {
        if (!append) setLoading(true);

        const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
        // Fetch posts with less than 2 likes, sorted by newest first
        const url = `${apiBaseUrl}/posts?page=${page}&limit=${LIMIT}&sort=-createdAt&likes[lt]=2`;
        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch posts.");
        }

        if (append) {
          setDiscussions((prev) => [...prev, ...result.data]);
        } else {
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
    [currentUserId]
  );

  useEffect(() => {
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
    const currentObserverRef = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [loadMore]);

  const handleLikeClick = async (e: React.MouseEvent, discussionId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const token = Cookies.get("token");
    if (!token) {
      console.log("User not logged in. Cannot like post.");
      return;
    }

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
    } catch (error) {
      console.error("Failed to like post:", error);
      setDiscussions((prevDiscussions) =>
        prevDiscussions.map((disc) => {
          if (disc._id === discussionId) {
            const wasLiked = !disc.hasLiked;
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

  const handleSavePost = async (postData: PostPayload) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      let imageUrls: string[] = [];

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

        const imageResult = await imageUploadResponse.json();

        if (!imageUploadResponse.ok || !imageResult.success) {
          throw new Error(imageResult.message || "Failed to upload images.");
        }

        if (imageResult.data && Array.isArray(imageResult.data.urls)) {
          imageUrls = imageResult.data.urls.filter(Boolean);
        }
      }

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

      const token = Cookies.get("token");
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
          <Eye className="mr-2 text-orange-600 w-5 h-5" />
          Unread Discussions
        </h2>
        <div className="flex items-center space-x-2">
          {/* <button className="text-sm text-blue-800 hover:text-blue-900 font-medium">
            View all
          </button> */}
          <button
            onClick={() => setCreatePostModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center"
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
          <div className="text-center py-12">
            <Eye className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              No unread posts found
            </p>
            <p className="text-gray-400 text-sm mt-2">
              All posts have been engaged with!
            </p>
          </div>
        ) : (
          discussions.map((discussion) => (
            <Link
              href={`/forum/post/${discussion._id}`}
              key={discussion._id}
              className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group"
            >
              <div className="p-4 pb-2">
                <div className="flex items-center mb-3">
                  {discussion.isPinned && (
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full mr-2">
                      PINNED
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                    {discussion.category?.name || "Uncategorized"}
                  </span>
                  <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full ml-2">
                    Low Engagement
                  </span>
                </div>

                <div className="flex items-center mb-3">
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-800 flex items-center justify-center text-white font-semibold mr-3">
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

              {discussion.images && discussion.images.length > 0 && (
                <div className="w-full h-64 grid grid-cols-2 grid-rows-2 gap-1">
                  {discussion.images.slice(0, 3).map((image, index) => {
                    const isFirst = index === 0;
                    const imageCount = discussion.images.length;

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

              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-800 transition-colors line-clamp-2 mb-4">
                  {discussion.title}
                </h3>

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
                    <span>Be the First</span>
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

export default UnreadPage;
