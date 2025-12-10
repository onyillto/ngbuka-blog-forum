"use client";

import { toast } from "sonner";
import { ShareIcon } from "../../../../component/Icons";

interface ShareButtonProps {
  title: string;
  postId: string;
}

const ShareButton = ({ title, postId }: ShareButtonProps) => {
  const handleShare = () => {
    const postUrl = `${window.location.origin}/forum/post/${postId}`;

    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this post on Ngbuka Forum: "${title}"`,
        url: postUrl,
      });
    } else {
      navigator.clipboard.writeText(postUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center space-x-2 text-gray-600 hover:text-blue-800 transition-colors"
    >
      <ShareIcon className="w-5 h-5" />
      <span className="text-sm font-medium">Share</span>
    </button>
  );
};

export default ShareButton;
