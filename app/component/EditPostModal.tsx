"use client";

import React, { useState, useEffect } from "react";
// Import Lucide icons
import {
  XIcon,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Tag,
  BookOpen,
  ChevronDown,
} from "lucide-react";

// Assuming PostPayload and Category are defined in external files or shared types
interface PostPayload {
  title: string;
  content: string;
  categoryId: string;
  tags: string;
  images: File[];
  // If you need to handle existing images for deletion/retention,
  // you might need an additional array in PostPayload, e.g., imagesToDelete: string[]
}

interface Category {
  _id: string;
  name: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  category: { _id: string; name: string };
  tags: string[];
  images: string[]; // URLs of existing images
}

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Note: The onSave function signature should ideally also handle imagesToDelete or similar
  onSave: (postData: PostPayload, postId: string) => void;
  isSaving: boolean;
  error: string | null;
  post: Post | null;
}

// --- Component Redesign ---

const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isSaving,
  error,
  post,
}) => {
  // --- Existing State and Effects (Functionality untouched) ---
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategoryId(post.category._id);
      setTags(post.tags.join(", "));
      // NOTE: Here is a functional adjustment for robustness in image handling, but the core functionality remains.
      // We assume post.images are existing URLs, and we set them as initial previews.
      setImagePreviews(post.images);
      setImages([]); // Reset file inputs for new uploads
    }
  }, [post]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
        // Check for apiBaseUrl existence as a guard
        if (!apiBaseUrl) {
          console.error("NEXT_PUBLIC_BaseURL is not defined");
          return;
        }
        const response = await fetch(`${apiBaseUrl}/categories`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      // Concatenate new previews to existing ones (which may include existing image URLs)
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    // Determine if the image being removed is an existing one (URL) or a new file (Blob URL)
    const isExistingImage = post && index < post.images.length;

    // Remove from imagePreviews
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);

    // If it was a newly added file, remove it from the 'images' File array as well.
    // This part is crucial for correct payload submission.
    if (!isExistingImage) {
      // Calculate the index in the 'images' state array.
      // It's the current index MINUS the number of initial existing images.
      const fileIndex = index - (post?.images.length || 0);
      setImages((prev) => prev.filter((_, i) => i !== fileIndex));
      // NOTE: A robust backend would need to know which existing URLs were removed.
      // This current state management ONLY sends NEW files. The simplified logic
      // here is kept to respect the original component's state structure.
      // For a true "Edit Post" feature, you'd need an `imagesToDelete` state.
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    // NOTE: The image handling here is functionally preserved but simplified.
    // It only sends *new* files (`images`), assuming the backend retains
    // existing images unless they are explicitly marked for deletion (which
    // is not handled robustly in the original component's state).
    const postData: PostPayload = {
      title,
      content,
      categoryId,
      // Convert tags back to a comma-separated string for the payload
      tags,
      images, // Sending only new image Files
    };
    onSave(postData, post._id);
  };

  if (!isOpen) return null;

  // --- UI Redesign (Tailwind CSS Styling Changes) ---

  // Enhanced styling for a professional, clean, and modern look.
  const inputClass =
    "w-full border border-gray-300 bg-gray-50 text-gray-800 rounded-xl px-4 py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition duration-150 shadow-sm";
  const labelClass =
    "block text-sm font-semibold text-gray-700 mb-1 flex items-center";
  const buttonPrimary =
    "px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition duration-150 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg";
  const buttonSecondary =
    "px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition duration-150 ease-in-out";
  const modalContainerClass =
    "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4";

  return (
    <div className={modalContainerClass}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col transform transition-all duration-300 ease-out scale-100 opacity-100">
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
            Edit Post:{" "}
            <span className="ml-2 font-light italic truncate max-w-[200px] md:max-w-none">
              {post?.title}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-800 p-2 rounded-full transition-colors hover:bg-gray-100"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body - Scrollable Area */}
        <form
          onSubmit={handleSubmit}
          className="flex-grow overflow-y-auto p-8 custom-scrollbar"
        >
          <div className="space-y-7">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className={labelClass}>
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="Enter a compelling title"
                required
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label htmlFor="content" className={labelClass}>
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className={`${inputClass} resize-none`}
                placeholder="Write your post content here..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Select */}
              <div>
                <label htmlFor="category" className={labelClass}>
                  Category
                </label>
                <div className="relative">
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={`${inputClass} appearance-none pr-10`}
                    required
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
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <label htmlFor="tags" className={labelClass}>
                  <Tag className="w-4 h-4 mr-1" />
                  Tags{" "}
                  <span className="text-gray-400 ml-1 font-normal">
                    (comma-separated)
                  </span>
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className={inputClass}
                  placeholder="e.g., react, javascript, ui, design"
                />
              </div>
            </div>

            {/* Images Section */}
            <div>
              <label className={labelClass}>Images</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {/* Image Previews with Removal */}
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover rounded-xl border-2 border-gray-100 shadow-md transition-all duration-200 group-hover:border-red-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
                      aria-label="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Image Upload Button */}
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer aspect-square flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-inner"
                >
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <span className="text-xs font-medium">Add Image(s)</span>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </form>

        {/* Footer with Actions */}
        <div className="flex items-center justify-end p-5 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className={buttonSecondary + " mr-3"}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving}
            className={buttonPrimary + " flex items-center"}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
