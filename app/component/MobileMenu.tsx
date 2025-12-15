import React from "react";
import Link from "next/link";
import {
  X,
  Home,
  Bell,
  User,
  ShieldCheck,
  MessageCircle,
  LogOut,
  LogIn,
} from "lucide-react";

interface UserInfo {
  _id: string;
  email: string;
  role?: "user" | "dealer" | "admin" | "moderator";
}

interface UserAvatarProps {
  user: UserInfo | null;
  size?: number;
}

// We need the UserAvatar component here as well.
const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 32 }) => (
  <div
    className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center overflow-hidden"
    style={{ width: size, height: size }}
  >
    {/* This is a simplified version. If you have Image component, you can use it here. */}
    <User
      className="text-white"
      style={{ width: size / 2, height: size / 2 }}
    />
  </div>
);

interface MobileMenuProps {
  user: UserInfo | null;
  displayName: string;
  unreadCount: number;
  onClose: () => void;
  onLogout: () => void;
  onOpenNotifications: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  user,
  displayName,
  unreadCount,
  onClose,
  onLogout,
  onOpenNotifications,
}) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 sm:hidden"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-72 sm:w-80 bg-white shadow-2xl z-50 sm:hidden overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          {user && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
              <UserAvatar user={user} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
          >
            <Home className="h-5 w-5 text-gray-500 shrink-0" />
            <span className="text-sm font-medium text-gray-700">Home</span>
          </Link>

          {user && (
            <div
              onClick={onOpenNotifications}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 relative cursor-pointer"
            >
              <Bell className="h-5 w-5 text-gray-500 shrink-0" />
              <span className="text-sm font-medium">Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          )}

          {user ? (
            <>
              <Link
                href="/forum/profile"
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <User className="h-5 w-5 text-gray-500 shrink-0" />
                <span className="text-sm font-medium">Profile</span>
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/dashboard/users"
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                >
                  <ShieldCheck className="h-5 w-5 text-gray-500 shrink-0" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
              )}
              <Link
                href="/forum/my-posts"
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <MessageCircle className="h-5 w-5 text-gray-500 shrink-0" />
                <span className="text-sm font-medium">My Posts</span>
              </Link>
              <Link
                href="/forum/notifications"
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <MessageCircle className="h-5 w-5 text-gray-500 shrink-0" />
                <span className="text-sm font-medium">All Notifications</span>
              </Link>
              <button
                onClick={onLogout}
                className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              onClick={onClose}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
            >
              <LogIn className="h-5 w-5 text-gray-500 shrink-0" />
              <span className="text-sm font-medium">Login</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
