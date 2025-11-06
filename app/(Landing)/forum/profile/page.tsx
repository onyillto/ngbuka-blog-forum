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
  dealerLicense: string;
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
    commentsLast30Days: number;
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isEditModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEditModalOpen]);

  const fetchUserPosts = async (userId: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      const response = await fetch(`${apiBaseUrl}/user/${userId}/posts`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch posts.");
      }

      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              posts: {
                data: result.data,
                total: result.pagination.total,
                showing: result.data.length,
              },
            }
          : null
      );
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
      // Optionally set a specific error for posts
      // setPostError("Could not load posts.");
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

        // Updated: Call the new endpoint /user/profile/:id using the _id from localStorage
        const response = await fetch(`${apiBaseUrl}/user/profile/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch profile data.");
        }

        // Compute fullName if not present
        const dataWithFullName = {
          ...result.data,
          fullName: `${result.data.firstName} ${result.data.lastName}`,
        };

        setProfileData(dataWithFullName);
        // Chain the post fetch to run after profile is successfully fetched
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
    formData.append("dealerLicense", data.dealerLicense);
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
        dealerLicense: updatedUser.dealerLicense,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">
        {pageError}
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No profile data available.</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 py-8 ${
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
          dealerLicense: profileData.dealerLicense,
          city: profileData.city,
          state: profileData.state,
          bio: profileData.bio,
        }}
      />
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
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
          <div className="px-8 pb-6">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end gap-4">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-purple-400 overflow-hidden flex items-center justify-center text-white text-4xl font-bold shadow-lg">
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
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profileData.fullName ||
                        `${profileData.firstName} ${profileData.lastName}`}
                    </h1>
                    {profileData.isVerified && (
                      <CheckCircle
                        size={20}
                        className="text-blue-600"
                        fill="currentColor"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {profileData.level}
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium capitalize">
                      {profileData.role}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <MapPin size={16} />
                      <span>
                        {profileData.city}, {profileData.state}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition"
              >
                <Edit2 size={18} />
                <span className="font-medium">Edit Profile</span>
              </button>
            </div>

            {/* Stats Cards - Enhanced */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {/* Reputation Card */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Star size={22} className="text-white" />
                  </div>
                  <div className="flex items-center text-blue-600 text-sm font-semibold bg-blue-50 px-2.5 py-1 rounded-full">
                    {profileData.level}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Reputation Score
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {profileData.reputation}
                  </p>
                </div>
              </div>

              {/* Total Posts Card */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 md:col-span-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText size={22} className="text-white" />
                  </div>
                  <Eye size={18} className="text-purple-600 ml-auto" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Posts Published
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {profileData.statistics?.posts?.total ||
                      profileData.postCount ||
                      0}
                  </p>
                  <p className="text-sm text-purple-600 font-medium flex items-center">
                    <Eye size={14} className="mr-1" />
                    {profileData.statistics?.posts?.totalViews || 0} total views
                  </p>
                </div>
              </div>

              {/* Total Likes Card */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Heart size={22} className="text-white" />
                  </div>
                  <TrendingUp size={18} className="text-emerald-600 ml-auto" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Likes Received
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {profileData.statistics?.engagement?.totalLikes || 0}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm text-emerald-600 font-medium">
                      {profileData.statistics?.engagement?.engagementRate || 0}%
                    </span>
                    <span className="text-xs text-gray-400">
                      engagement rate
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity Card */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 md:col-span-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Activity size={22} className="text-white" />
                  </div>
                  <Calendar size={18} className="text-orange-600 ml-auto" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Recent Activity
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {profileData.recentActivity?.totalActivityLast30Days || 0}
                  </p>
                  <p className="text-sm text-orange-600 font-medium flex items-center">
                    {profileData.recentActivity?.postsLast30Days || 0} new posts
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-2 italic">
                  Last 30 days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                  activeTab === "posts"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FileText size={18} className="inline mr-2" />
                Posts ({profileData.posts?.total || profileData.postCount || 0})
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                  activeTab === "about"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <IdCard size={18} className="inline mr-2" />
                About
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                  activeTab === "stats"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <TrendingUp size={18} className="inline mr-2" />
                Statistics
              </button>
              <button
                onClick={() => setActiveTab("verification")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                  activeTab === "verification"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <CheckCircle size={18} className="inline mr-2" />
                Verification
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    My Posts (
                    {profileData.posts?.total || profileData.postCount || 0})
                  </h3>
                </div>

                {!profileData.posts?.data ||
                profileData.posts.data.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText
                      size={48}
                      className="mx-auto text-gray-300 mb-4"
                    />
                    <p className="text-gray-500">No posts yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {profileData.posts.data.map((post) => (
                      <Link
                        href={`/forum/post/${post._id}`}
                        key={post._id}
                        className="block border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 group"
                      >
                        <div className="flex gap-4 p-4">
                          {/* Post Image */}
                          {post.images && post.images.length > 0 && (
                            <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
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
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                {post.category?.name || "Uncategorized"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(post.createdAt)}
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                              {post.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {post.content}
                            </p>

                            {/* Post Stats */}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Eye size={16} />
                                <span>{post.views || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart size={16} />
                                <span>{post.likes?.length || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare size={16} />
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
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    About Me
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {profileData.bio || "No bio available."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                      <div className="bg-gray-100 p-2.5 rounded-lg">
                        <Mail size={20} className="text-gray-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">
                          Email Address
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {profileData.email}
                        </p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                      <div className="bg-gray-100 p-2.5 rounded-lg">
                        <Phone size={20} className="text-gray-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">
                          Phone Number
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {profileData.phoneNumber || "Not provided"}
                        </p>
                      </div>
                    </div>

                    {profileData.dealerLicense && (
                      <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                        <div className="bg-gray-100 p-2.5 rounded-lg">
                          <IdCard size={20} className="text-gray-700" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">
                            Dealer License
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {profileData.dealerLicense}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                      <div className="bg-gray-100 p-2.5 rounded-lg">
                        <Calendar size={20} className="text-gray-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">
                          Member Since
                        </p>
                        <p className="text-sm font-medium text-gray-900">
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
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Content Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Posts Stats */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Post Performance
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Total Posts
                          </span>
                          <span className="font-semibold">
                            {profileData.statistics?.posts?.total ||
                              profileData.postCount ||
                              0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Total Views
                          </span>
                          <span className="font-semibold">
                            {profileData.statistics?.posts?.totalViews || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Total Likes
                          </span>
                          <span className="font-semibold">
                            {profileData.statistics?.posts?.totalLikes || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Avg Views
                          </span>
                          <span className="font-semibold">
                            {profileData.statistics?.posts?.avgViewsPerPost ||
                              0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Comments Stats */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Comment Activity
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Comments Made
                          </span>
                          <span className="font-semibold">
                            {profileData.statistics?.comments?.total ||
                              profileData.commentCount ||
                              0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Comments Received
                          </span>
                          <span className="font-semibold">
                            {profileData.statistics?.comments?.received || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Likes on Comments
                          </span>
                          <span className="font-semibold">
                            {profileData.statistics?.comments?.totalLikes || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Engagement Stats */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Engagement
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Total Interactions
                          </span>
                          <span className="font-semibold">
                            {profileData.statistics?.engagement
                              ?.totalInteractions || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Engagement Rate
                          </span>
                          <span className="font-semibold">
                            {profileData.statistics?.engagement
                              ?.engagementRate || 0}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            30-Day Activity
                          </span>
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
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Verification Status
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Account verification and status information
                  </p>

                  <div
                    className={`rounded-xl p-6 flex items-start gap-3 ${
                      profileData.isVerified
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {profileData.isVerified ? (
                      <>
                        <CheckCircle
                          size={24}
                          className="text-green-600 flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">
                            Account Verified
                          </p>
                          <p className="text-sm text-gray-600">
                            This account has been verified by the platform.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle
                          size={24}
                          className="text-gray-600 flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">
                            Account Not Verified
                          </p>
                          <p className="text-sm text-gray-600">
                            This account has not been verified yet.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Verification Details
                  </h3>

                  <div className="space-y-4">
                    {/* Email Verification */}
                    <div className="border border-gray-200 rounded-xl p-5 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 mb-1">
                          Email Verification
                        </p>
                        <p className="text-sm text-gray-600">
                          {profileData.email}
                        </p>
                      </div>
                      <span
                        className={`text-sm px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                          profileData.isEmailVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {profileData.isEmailVerified && (
                          <CheckCircle size={16} />
                        )}
                        {profileData.isEmailVerified
                          ? "Verified"
                          : "Not Verified"}
                      </span>
                    </div>

                    {/* Account Verification */}
                    <div className="border border-gray-200 rounded-xl p-5 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 mb-1">
                          Account Verification
                        </p>
                        <p className="text-sm text-gray-600">
                          Platform verification status
                        </p>
                      </div>
                      <span
                        className={`text-sm px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                          profileData.isVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {profileData.isVerified && <CheckCircle size={16} />}
                        {profileData.isVerified ? "Verified" : "Not Verified"}
                      </span>
                    </div>

                    {/* Dealer License */}
                    {profileData.dealerLicense && (
                      <div className="border border-gray-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 mb-1">
                            Dealer License
                          </p>
                          <p className="text-sm text-gray-600">
                            {profileData.dealerLicense}
                          </p>
                        </div>
                        <span className="bg-green-100 text-green-700 text-sm px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                          <CheckCircle size={16} />
                          Active
                        </span>
                      </div>
                    )}
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
