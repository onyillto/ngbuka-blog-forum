"use client";

import Link from "next/link";
import {
  Bell,
  MessageCircle,
  ShieldCheck,
  Clock,
  MailOpen,
} from "lucide-react";
import { Notification } from "./types"; // Assuming types are moved to a central file
import { formatTimeAgo } from "../../../component/utils";

const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onOpenModal: (notification: Notification) => void;
  onDropdownClose?: () => void; // Optional for page use
}> = ({ notification: n, onMarkAsRead, onOpenModal, onDropdownClose }) => {
  const baseClasses = `flex items-start gap-3 px-4 py-3 transition relative group cursor-pointer ${
    n.isRead ? "bg-white text-gray-700" : "bg-orange-50 font-medium"
  } hover:bg-gray-100`;

  const handleClickAction = () => {
    if (!n.isRead) {
      onMarkAsRead(n._id);
    }

    // Always open the modal to display information
    onOpenModal(n);

    if (onDropdownClose) {
      onDropdownClose();
    }
  };

  const content = (
    <>
      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
        {n.type === "new_like" && <Bell className="h-4 w-4 text-orange-600" />}
        {n.type === "new_comment" && (
          <MessageCircle className="h-4 w-4 text-orange-600" />
        )}
        {(n.type === "post_deleted" || n.type === "admin_message") && (
          <ShieldCheck className="h-4 w-4 text-orange-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm line-clamp-2">{n.message}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
          <Clock className="h-3 w-3" />
          <span>{formatTimeAgo(n.createdAt)}</span>
        </div>
      </div>
    </>
  );

  const readButton = !n.isRead && (
    <div className="absolute top-2 right-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onMarkAsRead(n._id);
        }}
        className="p-1.5 rounded-full bg-white/50 text-gray-500 hover:bg-gray-200 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition"
        title="Mark as read"
      >
        <MailOpen className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div onClick={handleClickAction} className={baseClasses}>
      {content}
      {readButton}
    </div>
  );
};

export default NotificationItem;
