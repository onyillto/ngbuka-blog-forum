"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { Loader2, MessageSquare, Send, User } from "lucide-react";

interface Author {
  _id: string;
  fullName: string;
  avatar?: string;
}

interface Comment {
  _id: string;
  content: string;
  author: Author;
  createdAt: string;
}

interface UserInfo {
  _id: string;
  avatar?: string;
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

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const userInfoStr = localStorage.getItem("user_info");
    if (userInfoStr) {
      try {
        setCurrentUser(JSON.parse(userInfoStr));
      } catch (e) {
        console.error("Failed to parse user info", e);
      }
    }

    const fetchComments = async () => {
      setLoading(true);
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
        const response = await fetch(`${apiBaseUrl}/posts/${postId}/comments`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch comments.");
        }
        setComments(data.data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setIsSubmitting(true);
    const token = Cookies.get("token");

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      const response = await fetch(`${apiBaseUrl}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to post comment.");
      }

      setComments((prev) => [data.data, ...prev]);
      setNewComment("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Could not post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderComments = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Loading replies...</p>
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-500 py-8">{error}</p>;
    }

    if (comments.length === 0) {
      return (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No Replies Yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Be the first to reply to this post.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex items-start space-x-4">
            <div className="relative w-10 h-10 rounded-full bg-gray-200 flex-shrink-0">
              {comment.author.avatar ? (
                <Image
                  src={comment.author.avatar}
                  alt={comment.author.fullName}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-gray-500 m-2" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-gray-900">
                  {comment.author.fullName}
                </span>
                <span className="text-xs text-gray-400">
                  • {formatTimeAgo(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Replies ({comments.length})
      </h2>

      {/* Comment Form */}
      {currentUser && (
        <form
          onSubmit={handleCommentSubmit}
          className="mb-8 flex items-start space-x-4"
        >
          <div className="relative w-10 h-10 rounded-full bg-gray-200 shrink-0">
            {currentUser.avatar ? (
              <Image
                src={currentUser.avatar}
                alt="Your avatar"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-gray-500 m-2" />
            )}
          </div>
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a reply..."
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              rows={3}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      {renderComments()}
    </section>
  );
}
