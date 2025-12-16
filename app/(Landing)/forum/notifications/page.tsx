"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Bell, Loader2 } from "lucide-react";
import NotificationItem from "./NotificationItem";
import NotificationViewerModal from "@/app/component/NotificationViewerModal";
import { Notification } from "./types";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);
      const token = Cookies.get("token");

      if (!token) {
        setError("You must be logged in to view notifications.");
        setIsLoading(false);
        return;
      }

      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_BaseURL;
        const response = await fetch(`${apiBaseUrl}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch notifications.");
        }

        const result = await response.json();
        if (result.success && result.data?.notifications) {
          setNotifications(result.data.notifications);
        } else {
          throw new Error("Invalid data format from server.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkOneRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
    );
    // The API call is optimistic and doesn't block UI.
    // In a real app, you might add more robust error handling here.
    const token = Cookies.get("token");
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_BaseURL ;
    await fetch(`${apiBaseUrl}/notifications/${notificationId}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const handleOpenModal = (notification: Notification) => {
    setSelectedNotification(notification);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      );
    }

    if (error) {
      return <div className="p-8 text-center text-red-600">{error}</div>;
    }

    if (notifications.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500">
          <Bell className="h-8 w-8 mx-auto mb-3" />
          <p>You have no notifications.</p>
        </div>
      );
    }

    return (
      <div className="divide-y divide-gray-200">
        {notifications.map((n) => (
          <NotificationItem
            key={n._id}
            notification={n}
            onMarkAsRead={handleMarkOneRead}
            onOpenModal={handleOpenModal}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="max-w-4xl mx-auto my-8 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 p-5 border-b">
          All Notifications
        </h1>
        {renderContent()}
      </div>
      {selectedNotification && (
        <NotificationViewerModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </>
  );
};

export default NotificationsPage;
