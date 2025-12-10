// CreateCategoryModal.tsx (Redesigned UI)
"use client";

import React, { useState, useEffect } from "react";
import { XIcon, Loader2, FolderPlus } from "lucide-react";

export interface CategoryPayload {
  name: string;
  description: string;
}

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryPayload) => void;
  isSaving: boolean;
  error: string | null;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isSaving,
  error,
}) => {
  // --- State and Handlers (Functionality Preserved) ---
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description });
  };

  if (!isOpen) return null;

  // --- Reusable Modern UI Classes ---
  const inputClass =
    "w-full border border-gray-300 bg-white text-gray-800 rounded-xl px-4 py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition duration-150 shadow-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
  const buttonPrimary =
    "px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition duration-150 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md";
  const buttonSecondary =
    "px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition duration-150 ease-in-out";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FolderPlus className="w-5 h-5 mr-2 text-blue-600" />
            Create New Category
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-800 p-2 rounded-full transition-colors hover:bg-gray-100"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Category Name Input */}
          <div>
            <label htmlFor="name" className={labelClass}>
              Category Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="e.g., SUVs & Trucks"
              required
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="A brief explanation of what posts belong here."
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end pt-4 border-t border-gray-100 mt-6 !mb-0 -mx-8 px-8 py-4 bg-gray-50 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className={buttonSecondary + " mr-3"}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={buttonPrimary + " flex items-center"}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
