"use client";

import React, { useState } from "react";
import Image from "next/image";
import ImageModal from "../../../../component/ImageModal";

interface PostImageViewerProps {
  images: string[];
}

const PostImageViewer: React.FC<PostImageViewerProps> = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (e: React.MouseEvent, image: string) => {
    e.preventDefault();
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className={`grid gap-4 ${
          images.length === 1 ? "grid-cols-1" : "grid-cols-2"
        }`}
      >
        {images.filter(Boolean).map((image, index) => (
          <a
            key={index}
            href={image}
            onClick={(e) => handleImageClick(e, image)}
            className="rounded-lg overflow-hidden bg-gray-100 group"
          >
            <Image
              src={image}
              alt={`Post image ${index + 1}`}
              width={500}
              height={256}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </a>
        ))}
      </div>
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={selectedImage}
      />
    </>
  );
};

export default PostImageViewer;
