import React from "react";
import Link from "next/link";
import { User, ShieldCheck, MessageCircle, LogOut } from "lucide-react";

interface UserInfo {
  _id: string;
  email: string;
  role?: "user" | "dealer" | "admin" | "moderator";
}

interface DesktopUserMenuProps {
  user: UserInfo;
  displayName: string;
  onClose: () => void;
  onLogout: () => void;
}

const DesktopUserMenu: React.FC<DesktopUserMenuProps> = ({
  user,
  displayName,
  onClose,
  onLogout,
}) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {displayName}
        </p>
        <p className="text-xs text-gray-500 truncate">{user.email}</p>
      </div>
      <Link
        href="/forum/profile"
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
      >
        <User className="h-4 w-4 shrink-0" />
        Profile
      </Link>
      {user.role === "admin" && (
        <Link
          href="/dashboard/users"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
        >
          <ShieldCheck className="h-4 w-4 shrink-0" />
          Dashboard
        </Link>
      )}
      <Link
        href="/forum/my-posts"
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
      >
        <MessageCircle className="h-4 w-4 shrink-0" />
        My Posts
      </Link>
      <Link
        href="/forum/notifcations"
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
      >
        <MessageCircle className="h-4 w-4 shrink-0" />
       All Notifications
      </Link>
      <button
        onClick={onLogout}
        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Logout
      </button>
    </div>
  );
};

export default DesktopUserMenu;
