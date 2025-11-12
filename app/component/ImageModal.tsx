"use client";

import React from "react";
import Image from "next/image";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full max-w-4xl max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
      >
        <Image
          src={imageUrl}
          alt="Full-screen view"
          layout="fill"
          objectFit="contain"
          className="rounded-lg"
        />
      </div>
      <button
        className="absolute top-4 right-4 text-white text-3xl font-bold"
        onClick={onClose}
      >
        &times;
      </button>
    </div>
  );
};

export default ImageModal;
