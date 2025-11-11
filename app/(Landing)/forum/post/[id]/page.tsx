// app/(Landing)/forum/post/[id]/page.tsx
import { notFound } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import PostInteractionWrapper from "./PostInteractionWrapper";
import PostImageViewer from "./PostImageViewer";

interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  reputation: number;
  bio: string;
  level: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: Author;
  category: Category;
  tags: string[];
  views: number;
  likes: string[];
  commentCount: number;
  isPinned: boolean;
  isLocked: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
  stats: {
    likeCount: number;
    hasLiked: boolean;
    commentCount: number;
    views: number;
  };
}

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getPost(id: string): Promise<Post | null> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BaseURL}/posts/id/${id}`
    );
    if (response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function PostDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div>
        <Link
          href="/forum/home"
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors pt-4 px-4 sm:px-6 lg:px-8"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Forum
        </Link>

        <div className="mb-4 px-4 sm:px-6 lg:px-8">
          <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-4 py-1 text-sm font-medium">
            {post.category.name}
          </span>
        </div>

        <div className="bg-white overflow-hidden mx-0 sm:mx-auto sm:max-w-4xl lg:max-w-6xl rounded-none sm:rounded-xl shadow-none sm:shadow-lg">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.firstName || "Author Avatar"}
                    width={48}
                    height={48}
                    className="rounded-full object-cover border-2 border-gray-200"
                  />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">
                      {post.author.firstName} {post.author.lastName}
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                      {post.author.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    • {post.stats.views}{" "}
                    {post.stats.views === 1 ? "view" : "views"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span className="text-sm">{post.stats.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="text-sm">{post.stats.commentCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            {post.images && post.images.length > 0 && (
              <div className="mb-6">
                <PostImageViewer images={post.images} />
              </div>
            )}
            <div className="mb-6">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
            <PostInteractionWrapper
              postId={post._id}
              initialStats={post.stats}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
