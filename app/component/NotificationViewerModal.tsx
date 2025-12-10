"use client";

import React, { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import { Notification } from "../../app/(Landing)/forum/notification/types";
import Cookies from "js-cookie";

const NotificationViewerModal: React.FC<{
  notification: Notification;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  const [details, setDetails] = useState<Notification>(notification);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to fetch full details when the modal opens
  useEffect(() => {
    console.log("Notification modal opened for:", notification);

    const fetchDetails = async () => {
      setIsLoading(true);
      const token = Cookies.get("token");
      if (!token) {
        setIsLoading(false);
        return; // No token, can't fetch
      }

      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_BaseURL || "http://localhost:5080/api";
        const response = await fetch(
          `${apiBaseUrl}/notifications/${notification._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setDetails(result.data); // Update with fresh data
          }
        }
      } catch (error) {
        console.error("Failed to fetch notification details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [notification._id]);

  // Effect to handle Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4"
      // Removed onClick={onClose} to prevent closing on backdrop click
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Notification</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            aria-label="Close notification viewer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="p-6 space-y-4">
            <p className="text-gray-800 text-lg">{details.message}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{new Date(details.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationViewerModal;
