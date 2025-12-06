"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import {
  Heart,
  MessageSquare,
  Send,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  isDeleted?: boolean;
  deletedAt?: string;
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

interface CurrentUser {
  id: string;
  role: string;
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

const CommentComponent = ({
  comment,
  onReply,
  onDelete,
  currentUser,
  isReply = false,
}: {
  comment: Comment;
  onReply: (content: string, parentId: string) => void;
  onDelete: (commentId: string) => void;
  currentUser: CurrentUser | null;
  isReply?: boolean;
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    onReply(replyContent, comment._id);
    setReplyContent("");
    setShowReplyForm(false);
  };

  const canDelete = currentUser && currentUser.id === comment.author._id;

  if (comment.isDeleted) {
    return (
      <div className="flex space-x-3 sm:space-x-4 w-full min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-sm text-gray-500 italic break-words">
              Comment deleted by user.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-x-3 sm:space-x-4 w-full min-w-0">
      <Image
        src={comment.author.avatar}
        alt={comment.author.firstName}
        width={40}
        height={40}
        className="rounded-full h-8 w-8 sm:h-10 sm:w-10 object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0 w-full">
        <div className="bg-gray-100 rounded-lg p-3 w-full overflow-hidden">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-semibold text-sm text-gray-800 break-words min-w-0">
              {comment.author.firstName} {comment.author.lastName}
            </span>
            <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-1 break-words overflow-wrap-anywhere">
            {comment.content}
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-2 sm:gap-4 mt-1">
          {!isReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center whitespace-nowrap"
            >
              <CornerDownRight size={14} className="mr-1 flex-shrink-0" />
              Reply
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(comment._id)}
              className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center whitespace-nowrap"
            >
              <Trash2 size={14} className="mr-1 flex-shrink-0" /> Delete
            </button>
          )}
        </div>

        {/* Toggle for nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center"
            >
              {showReplies ? (
                <ChevronUp size={14} className="mr-1 flex-shrink-0" />
              ) : (
                <ChevronDown size={14} className="mr-1 flex-shrink-0" />
              )}
              {showReplies ? "Hide" : "View"} {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}
            </button>
          </div>
        )}

        {showReplyForm && (
          <form
            onSubmit={handleReplySubmit}
            className="mt-2 flex space-x-2 w-full"
          >
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Reply..."
              className="flex-1 min-w-0 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition flex-shrink-0"
            >
              <Send size={16} className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Conditionally render nested replies */}
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4 pl-3 sm:pl-6 border-l-2 border-gray-200 w-full overflow-hidden">
            {comment.replies.map((reply) => (
              <CommentComponent
                key={reply._id}
                comment={reply}
                onReply={onReply}
                onDelete={onDelete}
                currentUser={currentUser}
                isReply={true}
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
  const router = useRouter();
  const [stats, setStats] = useState(initialStats);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setIsLoadingComments(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BaseURL}/comment/${postId}/comments`
      );
      if (response.data.success && response.data.data) {
        const commentData = response.data.data;
        setComments(commentData.comments || []);
        setStats((prevStats) => ({
          ...prevStats,
          commentCount: commentData.total || prevStats.commentCount,
        }));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  }, [postId]);

  useEffect(() => {
    const userInfoStr = localStorage.getItem("user_info");
    if (userInfoStr) {
      try {
        const user = JSON.parse(userInfoStr);
        setCurrentUser({ id: user._id, role: user.role, avatar: user.avatar });
      } catch (e) {
        console.error("Failed to parse user info", e);
      }
    }

    fetchComments();
  }, [fetchComments]);

  const handlePostComment = async (
    content: string,
    parentCommentId?: string
  ) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Please log in to comment.");
      router.push("/auth/signin");
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
      fetchComments();
      toast.success("Comment posted successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Failed to post comment.";
      if (errorMessage.includes("Not authorized")) {
        toast.error("Your session has expired. Please log in again.");
        router.push("/auth/signin");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const openDeleteModal = (commentId: string) => {
    setCommentToDelete(commentId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteComment = async () => {
    if (isDeleting || !commentToDelete) return;

    const token = Cookies.get("token");
    if (!token || !commentToDelete) {
      toast.error("Please log in to delete comments.");
      router.push("/auth/signin");
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BaseURL}/comment/${commentToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchComments();
      toast.success("Comment deleted successfully.");
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Failed to delete comment.";
      if (errorMessage.includes("Not authorized")) {
        toast.error("Your session has expired. Please log in again.");
        router.push("/auth/signin");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setCommentToDelete(null);
    }
  };

  const handleLike = async () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Please log in to like a post.");
      router.push("/auth/signin");
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
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Failed to like post.";
      if (errorMessage.includes("Not authorized")) {
        toast.error("Your session has expired. Please log in again.");
      }
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
      <div className="flex items-center flex-wrap gap-4 sm:gap-6 py-4 border-t border-b border-gray-200 w-full">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors ${
            stats.hasLiked ? "text-red-500" : ""
          }`}
        >
          <Heart
            fill={stats.hasLiked ? "currentColor" : "none"}
            className="flex-shrink-0"
          />
          <span className="font-semibold whitespace-nowrap">
            {stats.likeCount} Likes
          </span>
        </button>
        <div className="flex items-center space-x-2 text-gray-600">
          <MessageSquare className="flex-shrink-0" />
          <span className="font-semibold whitespace-nowrap">
            {stats.commentCount} Comments
          </span>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8 w-full overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({stats.commentCount})
        </h2>

        {/* New Comment Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePostComment(newComment);
          }}
          className="flex space-x-2 sm:space-x-4 mb-8 w-full"
        >
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 min-w-0 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-900 transition whitespace-nowrap flex-shrink-0 text-sm sm:text-base"
          >
            Post
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-6 w-full overflow-hidden">
          {isLoadingComments ? (
            <p>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <CommentComponent
                key={comment._id}
                comment={comment}
                onReply={handlePostComment}
                onDelete={openDeleteModal}
                currentUser={currentUser}
              />
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first!</p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-start gap-4">
              <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                <AlertTriangle
                  className="h-6 w-6 text-red-600 flex-shrink-0"
                  aria-hidden="true"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900 break-words"
                  id="modal-title"
                >
                  Delete Comment
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 break-words">
                    Are you sure you want to delete this comment? This action
                    cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteComment}
                disabled={isDeleting}
                className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin flex-shrink-0" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
