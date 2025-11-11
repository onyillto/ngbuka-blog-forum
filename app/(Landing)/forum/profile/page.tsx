"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import EditProfileModal, {
  ProfileFormData,
} from "../../../component/EditPRofile";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  IdCard,
  Star,
  FileText,
  MessageSquare,
  Calendar,
  MapPin,
  Edit2,
  CheckCircle,
  AlertCircle,
  Eye,
  Heart,
  TrendingUp,
  Activity,
} from "lucide-react";

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  views: number;
  likes: string[];
  commentCount: number;
  images: string[];
  createdAt: string;
  category: {
    name: string;
    slug: string;
  };
}

interface ProfileData {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  coverImage?: string;
  city: string;
  state: string;
  role: string;
  bio: string;
  reputation: number;
  level: string;
  postCount: number;
  commentCount: number;
  isVerified: boolean;
  isEmailVerified: boolean;
  isBanned: boolean;
  bannedUntil: Date | null;
  lastSeen: string;
  createdAt: string;
  posts?: {
    data: Post[];
    total: number;
    showing: number;
  };
  statistics?: {
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
    };
    engagement: {
      totalLikes: number;
      totalInteractions: number;
      engagementRate: number;
    };
  };
  recentActivity?: {
    postsLast30Days: number;
    commentsLast30Days?: number;
    totalActivityLast30Days: number;
  };
  topPosts?: Post[];
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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<
    "posts" | "about" | "stats" | "verification"
  >("posts");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (isEditModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEditModalOpen]);

  const fetchUserPosts = async (userId: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      let allPosts: Post[] = [];
      let page = 1;
      const limit = 100;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(
          `${apiBaseUrl}/user/${userId}/posts?page=${page}&limit=${limit}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts.");
        }
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch posts.");
        }

        allPosts = [...allPosts, ...result.data];
        hasMore = result.data.length === limit;
        page++;
      }

      const totalPosts = allPosts.length;
      const totalViews = allPosts.reduce(
        (sum, post) => sum + (post.views || 0),
        0
      );
      const totalLikes = allPosts.reduce(
        (sum, post) => sum + (post.likes?.length || 0),
        0
      );
      const totalComments = allPosts.reduce(
        (sum, post) => sum + (post.commentCount || 0),
        0
      );
      const avgViewsPerPost =
        totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0;
      const avgLikesPerPost =
        totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0;
      const engagementRate =
        totalViews > 0
          ? Math.round(((totalLikes + totalComments) / totalViews) * 100)
          : 0;
      const totalInteractions = totalLikes + totalComments;

      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              posts: {
                data: allPosts,
                total: totalPosts,
                showing: totalPosts,
              },
              statistics: {
                ...prev.statistics,
                posts: {
                  ...prev.statistics?.posts,
                  total: totalPosts,
                  totalViews,
                  totalLikes,
                  avgViewsPerPost,
                  avgLikesPerPost,
                },
                comments: {
                  // Provide defaults to satisfy the type
                  total: prev.statistics?.comments?.total || 0,
                  totalLikes: prev.statistics?.comments?.totalLikes || 0,
                  // Spread any other existing properties
                  ...(prev.statistics?.comments || {}),
                  received: totalComments,
                },
                engagement: {
                  ...prev.statistics?.engagement,
                  totalLikes,
                  totalInteractions,
                  engagementRate,
                },
              },
              recentActivity: {
                ...prev.recentActivity,
                totalActivityLast30Days: totalComments,
                postsLast30Days: 0,
                commentsLast30Days: totalComments,
              },
            }
          : null
      );
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setPageError(null);

      const userInfo = localStorage.getItem("user_info");
      if (!userInfo) {
        setPageError("User not found. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userInfo);
        const token = Cookies.get("token");
        const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;

        const response = await fetch(`${apiBaseUrl}/user/profile/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch profile data.");
        }

        const dataWithFullName = {
          ...result.data,
          fullName: `${result.data.firstName} ${result.data.lastName}`,
        };

        setProfileData(dataWithFullName);
        await fetchUserPosts(user._id);
      } catch (error: unknown) {
        setPageError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (data: ProfileFormData) => {
    setIsSaving(true);
    setSaveError(null);

    const userInfo = localStorage.getItem("user_info");
    if (!userInfo) {
      setSaveError("User not found. Please log in again.");
      setIsSaving(false);
      return;
    }
    const user = JSON.parse(userInfo);
    const token = Cookies.get("token");
    const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("bio", data.bio);
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    if (data.coverImage) {
      formData.append("coverImage", data.coverImage);
    }

    try {
      const response = await fetch(`${apiBaseUrl}/user/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update profile.");
      }

      const updatedUser = result.data;
      setProfileData((prev) => ({
        ...prev!,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        fullName: `${updatedUser.firstName} ${updatedUser.lastName}`,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        avatar: updatedUser.avatar,
        coverImage: updatedUser.coverImage,
        bio: updatedUser.bio,
        city: updatedUser.city,
        state: updatedUser.state,
      }));
      localStorage.setItem("user_info", JSON.stringify(updatedUser));

      setIsEditModalOpen(false);
    } catch (error: unknown) {
      setSaveError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500 px-4">
        {pageError}
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <p className="text-gray-600">No profile data available.</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 py-4 sm:py-8 ${
        isEditModalOpen ? "overflow-hidden" : ""
      }`}
    >
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        isSaving={isSaving}
        error={saveError}
        initialData={{
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phoneNumber: profileData.phoneNumber,
          city: profileData.city,
          state: profileData.state,
          bio: profileData.bio,
        }}
      />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden mb-4 sm:mb-6">
          {/* Cover Photo */}
          <div className="relative h-32 sm:h-48 md:h-64 bg-gradient-to-r from-blue-900 to-purple-600">
            {profileData.coverImage ? (
              <Image
                src={profileData.coverImage}
                alt="Cover"
                fill
                className="object-cover"
                priority
              />
            ) : null}
          </div>

          {/* Profile Info */}
          <div className="px-3 sm:px-6 lg:px-8 pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 sm:-mt-16 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 mb-4 sm:mb-0">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-purple-400 overflow-hidden flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold shadow-lg">
                    {profileData.avatar ? (
                      <Image
                        src={profileData.avatar}
                        alt="Profile"
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <span>
                        {profileData.firstName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Name and Location */}
                <div className="mb-0 sm:mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {profileData.fullName ||
                        `${profileData.firstName} ${profileData.lastName}`}
                    </h1>
                    {profileData.isVerified && (
                      <CheckCircle
                        size={18}
                        className="text-blue-900 flex-shrink-0"
                        fill="currentColor"
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                    <span className="bg-gradient-to-r from-blue-900 to-purple-600 text-white text-xs px-2.5 sm:px-3 py-1 rounded-full font-medium">
                      {profileData.level}
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-2.5 sm:px-3 py-1 rounded-full font-medium capitalize">
                      {profileData.role}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm">
                      <MapPin size={14} className="flex-shrink-0" />
                      <span className="truncate">
                        {profileData.city}, {profileData.state}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition w-full sm:w-auto"
              >
                <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="font-medium text-sm sm:text-base">
                  Edit Profile
                </span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-8">
              {/* Reputation Card */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-2 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <Star
                      size={18}
                      className="text-white sm:w-[22px] sm:h-[22px]"
                    />
                  </div>
                  {/* <div className="flex items-center text-blue-900 text-xs font-semibold bg-blue-50 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                    {profileData.level}
                  </div> */}
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Reputation
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    {profileData.level}
                  </p>
                </div>
              </div>

              {/* Total Posts Card */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-2 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <FileText
                      size={18}
                      className="text-white sm:w-[22px] sm:h-[22px]"
                    />
                  </div>
                  <Eye
                    size={16}
                    className="text-purple-600 ml-auto sm:w-[18px] sm:h-[18px]"
                  />
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Posts
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    {profileData.statistics?.posts?.total ||
                      profileData.postCount ||
                      0}
                  </p>
                  <p className="text-xs sm:text-sm text-purple-600 font-medium flex items-center">
                    <Eye size={12} className="mr-1 sm:w-[14px] sm:h-[14px]" />
                    {profileData.statistics?.posts?.totalViews || 0}
                  </p>
                </div>
              </div>

              {/* Total Likes Card */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-2 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <Heart
                      size={18}
                      className="text-white sm:w-[22px] sm:h-[22px]"
                    />
                  </div>
                  <TrendingUp
                    size={16}
                    className="text-emerald-600 ml-auto sm:w-[18px] sm:h-[18px]"
                  />
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Likes
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    {profileData.statistics?.engagement?.totalLikes || 0}
                  </p>
                  <div className="flex items-center justify-between pt-1 sm:pt-2 border-t border-gray-100">
                    <span className="text-xs sm:text-sm text-emerald-600 font-medium">
                      {profileData.statistics?.engagement?.engagementRate || 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity Card */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-2 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <Activity
                      size={18}
                      className="text-white sm:w-[22px] sm:h-[22px]"
                    />
                  </div>
                  <Calendar
                    size={16}
                    className="text-orange-600 ml-auto sm:w-[18px] sm:h-[18px]"
                  />
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Activity
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    {profileData.recentActivity?.totalActivityLast30Days || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-orange-600 font-medium">
                    {profileData.recentActivity?.commentsLast30Days || 0}{" "}
                    comments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex min-w-max sm:min-w-0">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                  activeTab === "posts"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FileText
                  size={16}
                  className="inline mr-1 sm:mr-2 sm:w-[18px] sm:h-[18px]"
                />
                Posts ({profileData.posts?.total || profileData.postCount || 0})
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                  activeTab === "about"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <IdCard
                  size={16}
                  className="inline mr-1 sm:mr-2 sm:w-[18px] sm:h-[18px]"
                />
                About
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                  activeTab === "stats"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <TrendingUp
                  size={16}
                  className="inline mr-1 sm:mr-2 sm:w-[18px] sm:h-[18px]"
                />
                Stats
              </button>
              <button
                onClick={() => setActiveTab("verification")}
                className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                  activeTab === "verification"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <CheckCircle
                  size={16}
                  className="inline mr-1 sm:mr-2 sm:w-[18px] sm:h-[18px]"
                />
                Status
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    My Posts (
                    {profileData.posts?.total || profileData.postCount || 0})
                  </h3>
                </div>

                {!profileData.posts?.data ||
                profileData.posts.data.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <FileText
                      size={40}
                      className="mx-auto text-gray-300 mb-3 sm:mb-4 sm:w-12 sm:h-12"
                    />
                    <p className="text-sm sm:text-base text-gray-500">
                      No posts yet
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {profileData.posts.data.map((post) => (
                      <Link
                        href={`/forum/post/${post._id}`}
                        key={post._id}
                        className="block border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 group"
                      >
                        <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
                          {/* Post Image */}
                          {post.images && post.images.length > 0 && (
                            <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={post.images[0]}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}

                          {/* Post Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                {post.category?.name || "Uncategorized"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(post.createdAt)}
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-2 mb-2">
                              {post.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2 sm:mb-3">
                              {post.content}
                            </p>

                            {/* Post Stats */}
                            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Eye size={14} className="sm:w-4 sm:h-4" />
                                <span>{post.views || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart size={14} className="sm:w-4 sm:h-4" />
                                <span>{post.likes?.length || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare
                                  size={14}
                                  className="sm:w-4 sm:h-4"
                                />
                                <span>{post.commentCount || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* About Tab */}
            {activeTab === "about" && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    About Me
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6">
                    {profileData.bio || "No bio available."}
                  </p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-3">
                      <div className="bg-gray-100 p-2 sm:p-2.5 rounded-lg flex-shrink-0">
                        <Mail
                          size={18}
                          className="text-gray-700 sm:w-5 sm:h-5"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">
                          Email Address
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {profileData.email}
                        </p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-3">
                      <div className="bg-gray-100 p-2 sm:p-2.5 rounded-lg flex-shrink-0">
                        <Phone
                          size={18}
                          className="text-gray-700 sm:w-5 sm:h-5"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">
                          Phone Number
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {profileData.phoneNumber || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-3">
                      <div className="bg-gray-100 p-2 sm:p-2.5 rounded-lg flex-shrink-0">
                        <Calendar
                          size={18}
                          className="text-gray-700 sm:w-5 sm:h-5"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">
                          Member Since
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {new Date(profileData.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === "stats" && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                    Content Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Posts Stats */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-200">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">
                        Post Performance
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Total Posts</span>
                          <span className="font-semibold">
                            {profileData.statistics?.posts?.total ||
                              profileData.postCount ||
                              0}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Total Views</span>
                          <span className="font-semibold">
                            {profileData.statistics?.posts?.totalViews || 0}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Total Likes</span>
                          <span className="font-semibold">
                            {profileData.statistics?.posts?.totalLikes || 0}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Avg Views</span>
                          <span className="font-semibold">
                            {profileData.statistics?.posts?.avgViewsPerPost ||
                              0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Comments Stats */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-200">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">
                        Comment Activity
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Comments Made</span>
                          <span className="font-semibold">
                            {profileData.statistics?.comments?.total ||
                              profileData.commentCount ||
                              0}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">
                            Comments Received
                          </span>
                          <span className="font-semibold">
                            {profileData.statistics?.comments?.received || 0}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">
                            Likes on Comments
                          </span>
                          <span className="font-semibold">
                            {profileData.statistics?.comments?.totalLikes || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Engagement Stats */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-green-200">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">
                        Engagement
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">
                            Total Interactions
                          </span>
                          <span className="font-semibold">
                            {profileData.statistics?.engagement
                              ?.totalInteractions || 0}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Engagement Rate</span>
                          <span className="font-semibold">
                            {profileData.statistics?.engagement
                              ?.engagementRate || 0}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">30-Day Activity</span>
                          <span className="font-semibold">
                            {profileData.recentActivity
                              ?.totalActivityLast30Days || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Tab */}
            {activeTab === "verification" && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Verification Status
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                    Account verification and status information
                  </p>

                  <div
                    className={`rounded-lg sm:rounded-xl p-4 sm:p-6 flex items-start gap-3 ${
                      profileData.isVerified
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {profileData.isVerified ? (
                      <>
                        <CheckCircle
                          size={20}
                          className="text-green-600 flex-shrink-0 mt-0.5 sm:w-6 sm:h-6"
                        />
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                            Account Verified
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            This account has been verified by the platform.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle
                          size={20}
                          className="text-gray-600 flex-shrink-0 mt-0.5 sm:w-6 sm:h-6"
                        />
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                            Account Not Verified
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            This account has not been verified yet.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                    Verification Details
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    {/* Email Verification */}
                    <div className="border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-medium text-gray-900 mb-1">
                          Email Verification
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {profileData.email}
                        </p>
                      </div>
                      <span
                        className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap ${
                          profileData.isEmailVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {profileData.isEmailVerified && (
                          <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                        )}
                        {profileData.isEmailVerified
                          ? "Verified"
                          : "Not Verified"}
                      </span>
                    </div>

                    {/* Account Verification */}
                    <div className="border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-medium text-gray-900 mb-1">
                          Account Verification
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Platform verification status
                        </p>
                      </div>
                      <span
                        className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap ${
                          profileData.isVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {profileData.isVerified && (
                          <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                        )}
                        {profileData.isVerified ? "Verified" : "Not Verified"}
                      </span>
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
}
