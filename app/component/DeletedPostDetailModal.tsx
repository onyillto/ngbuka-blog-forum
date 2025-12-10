// DeletedPostDetailModal.tsx
"use client";

import NextImage from "next/image";
import React from "react";
import {
  XIcon,
  User,
  Clock,
  MessageSquare,
  Eye,
  Heart,
  Tag,
  Folder,
  Trash2,
  Image,
} from "lucide-react";

// Re-use the interface from the list component
interface DeletedPost {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    level: string;
  };
  category: string;
  tags: string[];
  views: number;
  likes: string[];
  commentCount: number;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
  deletedBy: {
    _id: string;
    fullName: string;
    level: string;
  };
  deletedAt: string;
  images: string[];
}

interface DeletedPostDetailModalProps {
  post: DeletedPost;
  onClose: () => void;
}

const DeletedPostDetailModal: React.FC<DeletedPostDetailModalProps> = ({
  post,
  onClose,
}) => {
  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-red-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-red-700 flex items-center">
            <Trash2 className="w-5 h-5 mr-2" />
            Deleted Post Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <h3 className="text-2xl font-semibold text-gray-900">{post.title}</h3>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <DetailItem
              icon={User}
              label="Original Author"
              value={post.author.fullName}
              color="text-gray-600"
            />
            <DetailItem
              icon={Clock}
              label="Posted On"
              value={formatDateTime(post.createdAt)}
              color="text-gray-600"
            />
            <DetailItem
              icon={Folder}
              label="Category"
              value={post.category}
              color="text-blue-600"
            />
            <DetailItem
              icon={Trash2}
              label="Deleted By"
              value={post.deletedBy.fullName}
              color="text-red-600"
            />
          </div>

          {/* Deletion Info */}
          <div className="p-4 bg-red-100 rounded-lg border border-red-300 flex items-center">
            <Clock className="w-5 h-5 mr-3 text-red-700" />
            <p className="text-sm font-medium text-red-800">
              **Deletion Timestamp:** {formatDateTime(post.deletedAt)}
            </p>
          </div>

          {/* Content */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">
              Content
            </h4>
            <div className="prose max-w-none text-gray-700 p-3 bg-gray-50 rounded-md border border-gray-100 whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          {/* Metrics & Tags */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">
                Metrics
              </h4>
              <div className="space-y-2">
                <MetricItem icon={Eye} label="Views" value={post.views} />
                <MetricItem
                  icon={Heart}
                  label="Likes"
                  value={post.likes.length}
                />
                <MetricItem
                  icon={MessageSquare}
                  label="Comments"
                  value={post.commentCount}
                />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center text-xs font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Images Section */}
          {post.images && post.images.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Attached Images ({post.images.length})
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {post.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-video overflow-hidden rounded-lg shadow-md border-2 border-gray-100"
                  >
                    <NextImage
                      src={image}
                      alt={`Post image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer (Actions) */}
        <div className="flex justify-end p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          {/* Example Action Buttons (Functionality not included, just UI) */}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 mr-3 transition-colors"
          >
            Close
          </button>
          {/* <button
             onClick={() => { }}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Restore Post
          </button> */}
        </div>
      </div>
    </div>
  );
};

// --- Helper Components for clean UI ---
const DetailItem = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) => (
  <div className="flex flex-col">
    <span className="text-xs font-medium text-gray-500">{label}</span>
    <span className={`flex items-center text-sm mt-0.5 ${color}`}>
      <Icon className={`w-4 h-4 mr-1 ${color}`} />
      <span className="truncate">{value}</span>
    </span>
  </div>
);

const MetricItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) => (
  <div className="flex items-center text-gray-700">
    <Icon className="w-5 h-5 mr-3 text-blue-500" />
    <span className="font-semibold">{value}</span>
    <span className="ml-2 text-sm text-gray-500">{label}</span>
  </div>
);

export default DeletedPostDetailModal;
