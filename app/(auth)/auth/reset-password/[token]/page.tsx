"use client";
import React, { useState, useEffect } from "react";
import {
  Car,
  Eye,
  EyeOff,
  Shield,
  Users,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const params = useParams();
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (params.token) {
      setToken(Array.isArray(params.token) ? params.token[0] : params.token);
    }
  }, [params]);

  const handleResetPassword = async () => {
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Reset token is missing. Please use the link from your email.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      const response = await fetch(
        `${apiBaseUrl}/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: formData.password }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setSuccess("Password reset successfully! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-center p-4">
        <p className="text-green-400 text-lg">{success}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=1080&fit=crop)",
          filter: "blur(8px) brightness(0.4)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-16 lg:items-center mx-auto">
        {/* Left Side - Branding & Features - Hidden on mobile */}
        <div className="hidden lg:block flex-1 text-white">
          {/* Logo & Title */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">AutoEscrow Forum</h1>
              <p className="text-slate-300 text-lg">
                Professional Car Dealership Community
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Secure Escrow Services
                </h3>
                <p className="text-slate-400">
                  Protected transactions for dealers and buyers with full escrow
                  support.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Dealer Network</h3>
                <p className="text-slate-400">
                  Connect with verified dealers and automotive professionals
                  nationwide.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Verified Listings
                </h3>
                <p className="text-slate-400">
                  All vehicles and dealers go through our rigorous verification
                  process.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Reset Password Form */}
        <div className="flex-1 max-w-lg w-full mx-auto">
          {/* Mobile Logo - Only visible on mobile */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">AutoEscrow Forum</h1>
              <p className="text-slate-300 text-sm">
                Professional Car Dealership
              </p>
            </div>
          </div>

          {/* Reset Password Form */}
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Reset Password
              </h2>
              <p className="text-slate-400">Enter your new password below.</p>
            </div>

            <div className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-white text-sm mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-white text-sm mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-slate-700/30 rounded-lg p-4 text-sm text-slate-300">
                <p className="font-semibold mb-2">Password must contain:</p>
                <ul className="space-y-1 text-slate-400">
                  <li
                    className={
                      formData.password.length >= 8 ? "text-green-400" : ""
                    }
                  >
                    • At least 8 characters
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(formData.password) ? "text-green-400" : ""
                    }
                  >
                    • One uppercase letter
                  </li>
                  <li
                    className={
                      /[a-z]/.test(formData.password) ? "text-green-400" : ""
                    }
                  >
                    • One lowercase letter
                  </li>
                  <li
                    className={
                      /[0-9]/.test(formData.password) ? "text-green-400" : ""
                    }
                  >
                    • One number
                  </li>
                </ul>
              </div>

              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div
                  className={`text-sm ${
                    formData.password === formData.confirmPassword
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formData.password === formData.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </div>
              )}

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              {/* Reset Button */}
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center disabled:bg-orange-400 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              {/* Back to Sign In */}
              <div className="text-center">
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
