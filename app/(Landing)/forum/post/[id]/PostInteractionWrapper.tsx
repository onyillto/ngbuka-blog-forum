"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { Heart, MessageSquare, Send, CornerDownRight } from "lucide-react";

interface CommentAuthor {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface Comment {
  _id: string;
  content: string;
  author: CommentAuthor;
  createdAt: string;
  replies: Comment[];
}

interface PostInteractionWrapperProps {
  postId: string;
  initialStats: {
    likeCount: number;
    hasLiked: boolean;
    commentCount: number;
    views: number;
  };
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

const CommentComponent = ({
  comment,
  onReply,
}: {
  comment: Comment;
  onReply: (content: string, parentId: string) => void;
}) => {
  const [replyContent, setReplyContent] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    onReply(replyContent, comment._id);
    setReplyContent("");
    setShowReplyForm(false);
  };

  return (
    <div className="flex space-x-4">
      <Image
        src={comment.author.avatar}
        alt={comment.author.firstName}
        width={40}
        height={40}
        className="rounded-full h-10 w-10 object-cover"
      />
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-gray-800">
              {comment.author.firstName} {comment.author.lastName}
            </span>
            <span className="text-xs text-gray-500">
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
        </div>
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-xs font-semibold text-gray-500 hover:text-gray-800 mt-1 flex items-center"
        >
          <CornerDownRight size={14} className="mr-1" />
          Reply
        </button>

        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-2 flex space-x-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Replying to ${comment.author.firstName}...`}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
            >
              <Send size={16} />
            </button>
          </form>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-200">
            {comment.replies.map((reply) => (
              <CommentComponent
                key={reply._id}
                comment={reply}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function PostInteractionWrapper({
  postId,
  initialStats,
}: PostInteractionWrapperProps) {
  const [stats, setStats] = useState(initialStats);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      setIsLoadingComments(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BaseURL}/comment/${postId}/comments`
      );
      if (response.data.success && response.data.data.comments) {
        setComments(response.data.data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePostComment = async (
    content: string,
    parentCommentId?: string
  ) => {
    const token = Cookies.get("token");
    if (!token) {
      alert("Please log in to comment.");
      return;
    }

    try {
      const payload: { content: string; parentCommentId?: string } = {
        content,
      };
      if (parentCommentId) {
        payload.parentCommentId = parentCommentId;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_BaseURL}/comment/${postId}/comments`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewComment("");
      fetchComments(); // Refetch comments to show the new one
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment.");
    }
  };

  const handleLike = async () => {
    const token = Cookies.get("token");
    if (!token) {
      alert("Please log in to like a post.");
      return;
    }

    // Optimistic update
    setStats((prev) => ({
      ...prev,
      hasLiked: !prev.hasLiked,
      likeCount: prev.hasLiked ? prev.likeCount - 1 : prev.likeCount + 1,
    }));

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BaseURL}/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to like post:", error);
      // Revert optimistic update on failure
      setStats((prev) => ({
        ...prev,
        hasLiked: !prev.hasLiked,
        likeCount: prev.hasLiked ? prev.likeCount - 1 : prev.likeCount + 1,
      }));
    }
  };

  return (
    <>
      <div className="flex items-center space-x-6 py-4 border-t border-b border-gray-200">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors ${
            stats.hasLiked ? "text-red-500" : ""
          }`}
        >
          <Heart fill={stats.hasLiked ? "currentColor" : "none"} />
          <span className="font-semibold">{stats.likeCount} Likes</span>
        </button>
        <div className="flex items-center space-x-2 text-gray-600">
          <MessageSquare />
          <span className="font-semibold">{stats.commentCount} Comments</span>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({stats.commentCount})
        </h2>

        {/* New Comment Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePostComment(newComment);
          }}
          className="flex space-x-4 mb-8"
        >
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Post
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {isLoadingComments ? (
            <p>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <CommentComponent
                key={comment._id}
                comment={comment}
                onReply={handlePostComment}
              />
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first!</p>
          )}
        </div>
      </div>
    </>
  );
}
