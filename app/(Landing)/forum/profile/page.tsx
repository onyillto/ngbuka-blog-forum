"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import EditProfileModal, {
  ProfileFormData,
} from "../../../component/EditPRofile";
import Image from "next/image";
import {
  Mail,
  Phone,
  IdCard,
  Star,
  FileText,
  MessageSquare,
  Calendar,
  MapPin,
  Camera,
  Edit2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  coverImage?: string;
  dealerLicense: string;
  location: {
    city: string;
    state: string;
  };
  role: string;
  bio: string;
  stats: {
    reputation: number;
    posts: number;
    comments: number;
  };
  memberSince: string;
  lastSeen: string;
  verification: {
    email: boolean;
    account: boolean;
    dealerLicense: boolean;
  };
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<
    "about" | "details" | "verification"
  >("about");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

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

        const apiData = result.data;

        // Map API data to local state structure
        setProfileData({
          firstName: apiData.firstName,
          lastName: apiData.lastName,
          email: apiData.email,
          phone: apiData.phoneNumber,
          avatar: apiData.avatar || "/api/placeholder/128/128",
          coverImage: apiData.coverImage || "/api/placeholder/1200/300",
          dealerLicense: apiData.dealerLicense,
          location: { city: apiData.city, state: apiData.state },
          role: apiData.role,
          bio: apiData.bio,
          stats: {
            reputation: apiData.reputation,
            posts: apiData.postCount,
            comments: apiData.commentCount,
          },
          memberSince: new Date(apiData.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          lastSeen: new Date(apiData.lastSeen).toLocaleString(),
          verification: {
            email: apiData.isEmailVerified,
            account: apiData.isVerified,
            dealerLicense: true,
          }, // Assuming dealerLicense logic is separate
        });
      } catch (error: unknown) {
        setPageError(error instanceof Error ? error.message : 'An unknown error occurred');
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

      // Assuming the API returns the updated user object
      const updatedUser = result.data; // The user object is directly in result.data
      // Update localStorage and local state, merging with existing data
      setProfileData((prev) => ({
        ...prev!, // We know prev is not null here
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phoneNumber, // remap phone number
        avatar: updatedUser.avatar,
        coverImage: updatedUser.coverImage,
        bio: updatedUser.bio,
        location: { city: updatedUser.city, state: updatedUser.state },
        dealerLicense: updatedUser.dealerLicense,
      }));
      localStorage.setItem("user_info", JSON.stringify(updatedUser));

      setIsEditModalOpen(false);
    } catch (error: unknown) {
      setSaveError(error instanceof Error ? error.message : 'An unknown error occurred');
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
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

  // This check is important now that profileData can be null
  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        isSaving={isSaving}
        error={saveError}
        initialData={{
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phoneNumber: profileData.phone,
          dealerLicense: profileData.dealerLicense,
          city: profileData.location.city,
          state: profileData.location.state,
          bio: profileData.bio,
          // You can pass avatar and cover image URLs if available
          // avatarPreview: profileData.avatarUrl,
          // coverPreview: profileData.coverUrl,
        }}
      />
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="relative h-64 bg-gradient-to-r from-gray-800 to-gray-600">
            <Image
              src={profileData.coverImage || "/api/placeholder/1200/300"}
              alt="Cover"
              fill
              className="object-cover"
            />
            <button className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition">
              <Camera size={18} />
              <span className="text-sm font-medium">Change Cover</span>
            </button>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-6">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end gap-4">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                    <Image
                      src={profileData.avatar || "/api/placeholder/128/128"}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition">
                    <Camera size={16} />
                  </button>
                </div>

                {/* Name and Location */}
                <div className="mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {profileData.role}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <MapPin size={16} />
                      <span>
                        {profileData.location.city},{" "}
                        {profileData.location.state}
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

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                <div className="bg-gray-100 p-2.5 rounded-lg">
                  <Mail size={20} className="text-gray-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email Address</p>
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
                  <p className="text-xs text-gray-500 mb-0.5">Phone Number</p>
                  <p className="text-sm font-medium text-gray-900">
                    {profileData.phone}
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                <div className="bg-gray-100 p-2.5 rounded-lg">
                  <IdCard size={20} className="text-gray-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Dealer License</p>
                  <p className="text-sm font-medium text-gray-900">
                    {profileData.dealerLicense}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg mb-3">
                  <Star size={20} className="text-gray-700" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Reputation</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profileData.stats.reputation}
                </p>
                <p className="text-xs text-gray-500 mt-1">Points earned</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg mb-3">
                  <FileText size={20} className="text-gray-700" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Posts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profileData.stats.posts}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total posts</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg mb-3">
                  <MessageSquare size={20} className="text-gray-700" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Comments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profileData.stats.comments}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total comments</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg mb-3">
                  <Calendar size={20} className="text-gray-700" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Member Since</p>
                <p className="text-2xl font-bold text-gray-900">Oct 2025</p>
                <p className="text-xs text-gray-500 mt-1">Join date</p>
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
                onClick={() => setActiveTab("about")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                  activeTab === "about"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FileText size={18} className="inline mr-2" />
                About
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                  activeTab === "details"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <IdCard size={18} className="inline mr-2" />
                Details
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
            {/* About Tab */}
            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    User biography and information
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {profileData.bio}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Account Status
                  </h3>
                  <span className="inline-block bg-gray-900 text-white text-sm px-4 py-2 rounded-lg font-medium">
                    {profileData.role}
                  </span>
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Contact & Location Details
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    User contact information and location
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Email Address
                      </label>
                      <p className="text-gray-900">{profileData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Phone Number
                      </label>
                      <p className="text-gray-900">{profileData.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        City
                      </label>
                      <p className="text-gray-900">
                        {profileData.location.city}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        State
                      </label>
                      <p className="text-gray-900">
                        {profileData.location.state}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Dealer License
                      </label>
                      <p className="text-gray-900">
                        {profileData.dealerLicense}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Activity Information
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Member Since
                      </label>
                      <p className="text-gray-900">{profileData.memberSince}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Last Seen
                      </label>
                      <p className="text-gray-900">{profileData.lastSeen}</p>
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

                  <div className="bg-gray-50 rounded-xl p-6 flex items-start gap-3">
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
                      <span className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg font-medium">
                        Not Verified
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
                      <span className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg font-medium">
                        Not Verified
                      </span>
                    </div>

                    {/* Dealer License */}
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
