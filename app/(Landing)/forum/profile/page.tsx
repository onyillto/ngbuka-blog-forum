"use client";

import { useState, useEffect } from "react";
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
  const [profileData, setProfileData] = useState<ProfileData>({
    // Initial empty state or default data
    firstName: "John",
    lastName: "Doe",
    email: "achomaduonyinye@gmail.com",
    phone: "07011136719",
    dealerLicense: "DL-12345",
    location: { city: "New York", state: "NY" },
    role: "Dealer",
    bio: "Experienced car dealer with 10 years in the industry, specializing in luxury vehicles.",
    stats: { reputation: 0, posts: 0, comments: 0 },
    memberSince: "October 23, 2025 at 09:01 AM",
    lastSeen: "October 23, 2025 at 09:56 AM",
    verification: { email: false, account: false, dealerLicense: true },
  });

  const handleSaveProfile = (data: ProfileFormData) => {
    console.log("Saving profile data:", data);
    // Here you would typically make an API call to save the data
    setProfileData((prev) => ({
      ...prev,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phoneNumber,
      dealerLicense: data.dealerLicense,
      location: {
        city: data.city,
        state: data.state,
      },
      bio: data.bio,
      // You might need to handle image uploads and update URLs here
    }));
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
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
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="relative h-64 bg-gradient-to-r from-gray-800 to-gray-600">
            <Image
              src="/api/placeholder/1200/300"
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
                      src="/api/placeholder/128/128"
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
