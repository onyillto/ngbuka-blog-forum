"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileFormData) => void;
  isSaving?: boolean;
  error?: string | null;
  initialData?: ProfileFormData;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dealerLicense: string;
  city: string;
  state: string;
  bio: string;
  avatar?: File;
  coverImage?: File;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  error: saveError,
  initialData,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<
    ProfileFormData & { avatarPreview?: string; coverPreview?: string }
  >({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    phoneNumber: initialData?.phoneNumber || "",
    dealerLicense: initialData?.dealerLicense || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    bio: initialData?.bio || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileFormData, string>>
  >({});
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ProfileFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          [type === "avatar" ? "avatar" : "coverImage"]:
            "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [type === "avatar" ? "avatar" : "coverImage"]:
            "File size must be less than 5MB",
        }));
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      if (type === "avatar") {
        setFormData((prev) => ({
          ...prev,
          avatar: file, // Now correctly updates the state
          avatarPreview: previewUrl,
        }));
        setErrors((prev) => ({ ...prev, avatar: undefined }));
      } else {
        setFormData((prev) => ({
          ...prev,
          coverImage: file, // Now correctly updates the state
          coverPreview: previewUrl,
        }));
        setErrors((prev) => ({ ...prev, coverImage: undefined }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // onSave is now async, handled by the parent
      onSave(formData);
    }
  };

  const handleCancel = () => {
    // Clean up preview URLs
    if (formData.avatarPreview && formData.avatar) {
      URL.revokeObjectURL(formData.avatarPreview);
    }
    if (formData.coverPreview && formData.coverImage) {
      URL.revokeObjectURL(formData.coverPreview);
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Profile
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Update your profile information and click save when you're done.
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form Content */}
          <form
            onSubmit={handleSubmit}
            className="overflow-y-auto max-h-[calc(90vh-140px)]"
          >
            <div className="px-6 py-6 space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.firstName
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    } focus:ring-2 focus:ring-opacity-50 transition`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.lastName
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    } focus:ring-2 focus:ring-opacity-50 transition`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.phoneNumber
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  } focus:ring-2 focus:ring-opacity-50 transition`}
                  placeholder="07011136719"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Dealer License */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dealer License
                </label>
                <input
                  type="text"
                  name="dealerLicense"
                  value={formData.dealerLicense}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition"
                  placeholder="DL-12345"
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.city
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    } focus:ring-2 focus:ring-opacity-50 transition`}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.state
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    } focus:ring-2 focus:ring-opacity-50 transition`}
                    placeholder="NY"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  {formData.avatarPreview && (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                      <Image
                        src={formData.avatarPreview}
                        alt="Avatar preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "avatar")}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2"
                    >
                      <Upload size={18} />
                      {formData.avatarPreview
                        ? "Change Picture"
                        : "Upload Picture"}
                    </button>
                    {errors.avatar && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.avatar}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Recommended: Square image, at least 400x400px, max 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="space-y-3">
                  {formData.coverPreview && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={formData.coverPreview}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "cover")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2"
                  >
                    <ImageIcon size={18} />
                    {formData.coverPreview ? "Change Cover" : "Upload Cover"}
                  </button>
                  {errors.coverImage && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.coverImage}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Recommended: 1200x300px or wider, max 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
          {saveError && (
            <div className="px-6 py-3 bg-red-50 border-t border-red-200">
              <p className="text-sm text-red-600 text-center">
                Error: {saveError}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
