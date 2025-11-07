"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  Loader2,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Award,
  TrendingUp,
  MessageSquare,
  Eye,
  ThumbsUp,
  FileText,
  BarChart3,
  Shield,
  CheckCircle,
  Clock,
  Hash,
  ArrowLeft,
} from "lucide-react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  reputation: number;
  level: string;
  city?: string;
  state?: string;
  phoneNumber?: string;
  isVerified: boolean;
  isEmailVerified: boolean;
  isBanned: boolean;
  lastSeen: string;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
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
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  post: {
    _id: string;
    title: string;
    slug: string;
  };
  content: string;
  likes: string[];
  createdAt: string;
}

interface Statistics {
  posts: {
    total: number;
    totalViews: number;
    totalLikes: number;
    avgViewsPerPost: number;
    avgLikesPerPost: number;
  };
  comments: {
    total: number;
    totalLikes: number;
    received: number;
    avgPerPost: number;
  };
  engagement: {
    totalLikes: number;
    totalInteractions: number;
  };
}

interface ProfileData {
  user: User;
  posts: {
    data: Post[];
    total: number;
    showing: number;
  };
  comments: {
    data: Comment[];
    total: number;
    showing: number;
  };
  statistics: Statistics;
  recentActivity: {
    postsLast30Days: number;
    commentsLast30Days: number;
    totalActivityLast30Days: number;
  };
  topPosts: Array<{
    _id: string;
    title: string;
    slug: string;
    views: number;
    likes: number;
    comments: number;
    createdAt: string;
  }>;
}

type TabType = "overview" | "posts" | "comments" | "statistics";

const UserProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Please log in to view profile");
        router.push("/auth/signin");
        return;
      }

      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
        const response = await fetch(`${apiBaseUrl}/user/${userId}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch profile");
        }

        setProfileData(result.data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "An error occurred");
        console.error("Profile fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-800" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  const { user, posts, comments, statistics, recentActivity, topPosts } =
    profileData;

  const TabButton = ({ tab, label }: { tab: TabType; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-6 py-3 font-medium text-sm transition-all ${
        activeTab === tab
          ? "text-blue-800 border-b-2 border-blue-800"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {label}
    </button>
  );

  const StatCard = ({
    icon: Icon,
    label,
    value,
    subtext,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    subtext?: string;
  }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-5 w-5 text-blue-800" />
        </div>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-blue-800 to-blue-700">
        {user.coverImage && (
          <Image
            src={user.coverImage}
            alt="Cover"
            fill
            className="object-cover"
          />
        )}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Avatar */}
              <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-lg flex-shrink-0 -mt-16">
                <Image
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&size=200&background=random`
                  }
                  alt={user.fullName}
                  fill
                  className="rounded-full object-cover"
                />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user.fullName}
                  </h1>
                  {user.isVerified && (
                    <CheckCircle className="h-6 w-6 text-blue-800" />
                  )}
                  {user.isBanned && (
                    <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                      Banned
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-900 rounded-full font-medium">
                    <Award className="h-4 w-4" />
                    {user.level}
                  </span>
                  <span className="capitalize px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {user.role}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {user.reputation} Reputation
                  </span>
                </div>

                {user.bio && (
                  <p className="text-gray-700 mb-4 max-w-3xl">{user.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {user.city && user.state && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.city}, {user.state}
                    </span>
                  )}
                  {user.phoneNumber && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {user.phoneNumber}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Last seen{" "}
                    {new Date(user.lastSeen).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200 flex overflow-x-auto">
            <TabButton tab="overview" label="Overview" />
            <TabButton tab="posts" label={`Posts (${posts.total})`} />
            <TabButton tab="comments" label={`Comments (${comments.total})`} />
            <TabButton tab="statistics" label="Statistics" />
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <StatCard
                    icon={FileText}
                    label="Total Posts"
                    value={posts.total}
                  />
                  <StatCard
                    icon={MessageSquare}
                    label="Total Comments"
                    value={comments.total}
                  />
                  <StatCard
                    icon={Eye}
                    label="Total Views"
                    value={statistics.posts.totalViews}
                  />
                  <StatCard
                    icon={ThumbsUp}
                    label="Total Likes"
                    value={statistics.engagement.totalLikes}
                  />
                </div>

                {/* Recent Activity */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-800" />
                    Activity Last 30 Days
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-2xl font-bold text-blue-800">
                        {recentActivity.postsLast30Days}
                      </p>
                      <p className="text-sm text-gray-600">Posts Created</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-800">
                        {recentActivity.commentsLast30Days}
                      </p>
                      <p className="text-sm text-gray-600">Comments Made</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-800">
                        {recentActivity.totalActivityLast30Days}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total Interactions
                      </p>
                    </div>
                  </div>
                </div>

                {/* Top Posts */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    Top Posts
                  </h3>
                  <div className="space-y-3">
                    {topPosts.map((post, index) => (
                      <Link
                        key={post._id}
                        href={`/forum/post/${post._id}`}
                        className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors border border-gray-200"
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-2xl font-bold text-gray-300">
                            #{index + 1}
                          </span>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {post.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                {post.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {post.comments}
                              </span>
                              <span className="text-gray-700">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    Showing {posts.showing} of {posts.total} posts
                  </p>
                </div>

                {posts.data.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-700" />
                    <p className="mt-2 text-gray-600">No posts yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.data.map((post) => (
                      <Link
                        key={post._id}
                        href={`/forum/post/${post._id}`}
                        className="block bg-white hover:bg-gray-50 rounded-lg p-6 border border-gray-200 transition-colors"
                      >
                        <div className="flex gap-4">
                          {post.images[0] && (
                            <div className="relative h-24 w-32 flex-shrink-0 rounded-lg overflow-hidden">
                              <Image
                                src={post.images[0]}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {post.content}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="px-2 py-1 bg-blue-50 text-blue-900 rounded text-xs font-medium">
                                {post.category.name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {post.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                {post.likes.length}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {post.commentCount}
                              </span>
                              <span>
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {post.tags.length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {post.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === "comments" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    Showing {comments.showing} of {comments.total} comments
                  </p>
                </div>

                {comments.data.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-700" />
                    <p className="mt-2 text-gray-600">No comments yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.data.map((comment) => (
                      <Link
                        key={comment._id}
                        href={`/forum/post/${comment.post.slug}`}
                        className="block bg-white hover:bg-gray-50 rounded-lg p-6 border border-gray-200 transition-colors"
                      >
                        <div className="mb-3">
                          <p className="text-sm text-gray-500 mb-1">
                            Comment on:{" "}
                            <span className="font-medium text-blue-800">
                              {comment.post.title}
                            </span>
                          </p>
                        </div>
                        <p className="text-gray-800 mb-3">{comment.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {comment.likes.length}
                          </span>
                          <span>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === "statistics" && (
              <div className="space-y-6">
                {/* Post Statistics */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-800" />
                    Post Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                      icon={FileText}
                      label="Total Posts"
                      value={statistics.posts.total}
                    />
                    <StatCard
                      icon={Eye}
                      label="Total Views"
                      value={statistics.posts.totalViews}
                      subtext={`Avg: ${statistics.posts.avgViewsPerPost} per post`}
                    />
                    <StatCard
                      icon={ThumbsUp}
                      label="Total Likes"
                      value={statistics.posts.totalLikes}
                      subtext={`Avg: ${statistics.posts.avgLikesPerPost} per post`}
                    />
                  </div>
                </div>

                {/* Comment Statistics */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    Comment Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                      icon={MessageSquare}
                      label="Comments Made"
                      value={statistics.comments.total}
                    />
                    <StatCard
                      icon={ThumbsUp}
                      label="Comment Likes"
                      value={statistics.comments.totalLikes}
                    />
                    <StatCard
                      icon={MessageSquare}
                      label="Comments Received"
                      value={statistics.comments.received}
                      subtext={`Avg: ${statistics.comments.avgPerPost} per post`}
                    />
                  </div>
                </div>

                {/* Engagement Statistics */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Overall Engagement
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatCard
                      icon={ThumbsUp}
                      label="Total Likes"
                      value={statistics.engagement.totalLikes}
                    />
                    <StatCard
                      icon={TrendingUp}
                      label="Total Interactions"
                      value={statistics.engagement.totalInteractions}
                    />
                  </div>
                </div>

                {/* Engagement Chart */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Engagement Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Post Views</span>
                        <span className="font-medium">
                          {statistics.posts.totalViews}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-800 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              statistics.engagement.totalInteractions > 0
                                ? (statistics.posts.totalViews /
                                    statistics.engagement.totalInteractions) *
                                    100
                                : 0,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Total Likes</span>
                        <span className="font-medium">
                          {statistics.engagement.totalLikes}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (statistics.engagement.totalLikes /
                                statistics.engagement.totalInteractions) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Comments</span>
                        <span className="font-medium">
                          {statistics.comments.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (statistics.comments.total /
                                statistics.engagement.totalInteractions) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
