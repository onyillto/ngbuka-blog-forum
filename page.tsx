"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import CreatePostModal, {
  PostPayload,
} from "../ngbuka-blog-forum/app/component/CreatePostModal";
import {
  MessageIcon,
  HeartIcon,
  PlusIcon,
  Loader2,
} from "../ngbuka-blog-forum/app/component/Icons";
import { FileText, ServerCrash } from "lucide-react";

interface Author {
  _id: string;
  fullName: string;
  avatar?: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
  postCount: number;
}

interface Post {
  _id: string;
  title: string;
  author: Author | null;
  category: { _id: string; name: string };
  commentCount: number;
  likes: string[];
  views: number;
  createdAt: string;
  isPinned: boolean;
  images: string[];
}

const LIMIT = 10;

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

const CategoryPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const observerRef = useRef<HTMLDivElement>(null);

  const fetchCategoryDetails = useCallback(async () => {
    setLoadingCategory(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      const response = await fetch(`${apiBaseUrl}/categories/slug/${slug}`);
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch category details.");
      }
      setCategory(result.data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoadingCategory(false);
    }
  }, [slug]);

  const fetchPosts = useCallback(
    async (page: number, append = false) => {
      if (!append) setLoadingPosts(true);
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
        const response = await fetch(
          `${apiBaseUrl}/posts?categorySlug=${slug}&page=${page}&limit=${LIMIT}&sort=-createdAt`
        );
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch posts.");
        }

        setPosts((prev) => (append ? [...prev, ...result.data] : result.data));
        setHasMore(
          result.data.length === LIMIT && result.pagination?.pages > page
        );
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoadingPosts(false);
        setLoadingMore(false);
      }
    },
    [slug]
  );

  useEffect(() => {
    fetchCategoryDetails();
    fetchPosts(1, false);
  }, [fetchCategoryDetails, fetchPosts]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || loadingPosts) return;
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    fetchPosts(nextPage, true);
    setCurrentPage(nextPage);
  }, [currentPage, hasMore, loadingMore, loadingPosts, fetchPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loadMore]);

  const handleSavePost = async (postData: PostPayload) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      const token = Cookies.get("token");
      let imageUrls: string[] = [];

      if (postData.images.length > 0) {
        const imageFormData = new FormData();
        postData.images.forEach((image) =>
          imageFormData.append("images", image)
        );
        const imageUploadResponse = await fetch(
          `${apiBaseUrl}/posts/upload-images`,
          {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: imageFormData,
          }
        );
        const imageResult = await imageUploadResponse.json();
        if (!imageUploadResponse.ok || !imageResult.success)
          throw new Error(imageResult.message || "Failed to upload images.");
        if (imageResult.data?.urls) imageUrls = imageResult.data.urls;
      }

      const finalPostPayload = {
        ...postData,
        images: imageUrls,
        tags: postData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
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
      if (!postResponse.ok || !result.success)
        throw new Error(result.message || "Failed to create post.");

      await fetchPosts(1, false);
      setCreatePostModalOpen(false);
    } catch (error: unknown) {
      setSaveError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderPostSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  );

  const PostCard = ({ post }: { post: Post }) => (
    <Link
      href={`/forum/post/${post._id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 rounded-full bg-gray-200">
            {post.author?.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.fullName}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-gray-600 font-semibold">
                {post.author?.fullName?.charAt(0) || "A"}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {post.author?.fullName || "Anonymous"}
            </p>
            <p className="text-xs text-gray-500">
              {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-800 transition-colors mb-3 line-clamp-2">
        {post.title}
      </h3>
      {post.images && post.images.length > 0 && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-gray-100">
          <Image
            src={post.images[0]}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <MessageIcon className="w-4 h-4 mr-1.5 text-gray-400" />
            <span>{post.commentCount}</span>
          </div>
          <div className="flex items-center">
            <HeartIcon className="w-4 h-4 mr-1.5 text-gray-400" />
            <span>{post.likes.length}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">{post.views}</span>
            <span className="ml-1 text-xs">views</span>
          </div>
        </div>
        <div className="text-blue-800 group-hover:text-blue-900 font-medium flex items-center">
          <span>Read More</span>
          <span className="ml-1 transform group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {loadingCategory ? (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 animate-pulse">
            <div className="h-16 w-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        ) : category ? (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
            <div className="text-6xl mx-auto mb-4">{category.icon}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {category.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>
        ) : null}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Discussions</h2>
          <button
            onClick={() => setCreatePostModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" /> New Post
          </button>
        </div>

        <div className="space-y-6">
          {loadingPosts ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-${index}`}>{renderPostSkeleton()}</div>
            ))
          ) : error ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-red-200">
              <ServerCrash className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                Failed to Load Posts
              </h3>
              <p className="text-red-600">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Posts Yet
              </h3>
              <p className="text-gray-600">
                Be the first to start a discussion in this category!
              </p>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          )}
          {loadingMore &&
            Array.from({ length: 3 }).map((_, index) => (
              <div key={`loading-more-${index}`}>{renderPostSkeleton()}</div>
            ))}
          {hasMore && !loadingMore && (
            <div ref={observerRef} className="p-4 text-center text-gray-500">
              <Loader2 className="mx-auto h-6 w-6 animate-spin" />
            </div>
          )}
        </div>
      </main>

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setCreatePostModalOpen(false)}
        onSave={handleSavePost}
        isSaving={isSaving}
        error={saveError}
        initialCategoryId={category?._id}
      />
    </div>
  );
};

export default CategoryPage;
