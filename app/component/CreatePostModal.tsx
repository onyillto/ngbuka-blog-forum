"use client";

import { useState, useRef, ChangeEvent, FormEvent, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
}

export interface PostPayload {
  title: string;
  content: string;
  categoryId: string;
  tags: string;
  images: File[];
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PostPayload) => void;
  isSaving?: boolean;
  error?: string | null;
  initialCategoryId?: string;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  error: saveError,
  initialCategoryId,
}: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
        const response = await fetch(`${apiBaseUrl}/categories`);
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    if (isOpen) {
      fetchCategories();
      if (initialCategoryId) {
        setCategoryId(initialCategoryId);
      }
    }
  }, [isOpen, initialCategoryId]);

  if (!isOpen) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = [...images, ...files];
      setImages(newImages);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!content.trim()) newErrors.content = "Content is required.";
    if (!categoryId) newErrors.categoryId = "Category is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({ title, content, categoryId, tags, images });
  };

  return (
    <>
      {/* Backdrop - ONLY ONE */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[99]"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Post
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.title ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="e.g., Best SUVs for 2025"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Content Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-2.5 rounded-lg border resize-none ${
                    errors.content ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Share more details about your post..."
                />
                {errors.content && (
                  <p className="text-sm text-red-600 mt-1">{errors.content}</p>
                )}
              </div>

              {/* Category and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.categoryId ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.categoryId}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                    placeholder="e.g., SUV, 2025 (comma-separated)"
                  />
                </div>
              </div>

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={preview}
                        alt={`Preview ${index}`}
                        width={100}
                        height={100}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 group-hover:opacity-100 opacity-0 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition"
                  >
                    <Upload size={24} />
                    <span className="text-xs mt-1">Upload</span>
                  </button>
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-400 flex items-center"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? "Posting..." : "Create Post"}
              </button>
            </div>
          </form>

          {/* Error Message */}
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
