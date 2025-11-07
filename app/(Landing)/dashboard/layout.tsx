"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";

interface UserInfo {
  _id: string;
  role: "user" | "dealer" | "admin";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userInfoStr = localStorage.getItem("user_info");

    if (!userInfoStr) {
      router.replace("/forum/home");
      return;
    }

    try {
      const userInfo: UserInfo = JSON.parse(userInfoStr);
      if (userInfo.role === "admin") {
        setIsAuthorized(true);
      } else {
        router.replace("/forum/home");
      }
    } catch (error) {
      console.error("Failed to parse user info:", error);
      router.replace("/forum/home");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-gray-500 font-medium">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return null; // Or a dedicated "Access Denied" component
}
