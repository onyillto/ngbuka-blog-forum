"use client";
import React, { useState } from "react";
import { Car, Shield, Users, CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

function AutoEscrowAuth() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("signup");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    rememberMe: false,
  });

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Email is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    setEmailError(
      isValid
        ? null
        : "Please enter a valid email address (e.g., user@example.com)."
    );
    return isValid;
  };

  const getFriendlyErrorMessage = (message: string): string => {
    // Default message for unknown errors
    let friendlyMessage = "An unexpected error occurred. Please try again.";

    if (!message) return friendlyMessage;

    const lowerCaseMessage = message.toLowerCase();

    if (
      lowerCaseMessage.includes("invalid credentials") ||
      lowerCaseMessage.includes("user not found")
    ) {
      friendlyMessage =
        "Incorrect email or password. Please check your details and try again.";
    } else if (lowerCaseMessage.includes("already exists")) {
      friendlyMessage =
        "An account with this email already exists. Please sign in or use a different email.";
    } else if (lowerCaseMessage.includes("google sign-in failed")) {
      friendlyMessage =
        "Could not complete Google Sign-In. Please try again in a moment.";
    } else if (lowerCaseMessage.includes("password must be")) {
      friendlyMessage =
        "Your password is not strong enough. Please follow the requirements below.";
    }
    return friendlyMessage;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "email") {
      validateEmail(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateEmail(formData.email)) {
      setLoading(false);
      return;
    }

    const isSignUp = activeTab === "signup";
    const endpoint = isSignUp ? "/auth/signup" : "/auth/signin";
    const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;

    const payload = isSignUp
      ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }
      : {
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "An unknown error occurred.");
      }

      // Store token in cookie
      if (data.data.token) {
        const cookieOptions = {
          expires: formData.rememberMe ? 30 : 7, // 30 days if remembered, else 7 days
          // Only set the secure flag in production
          secure: process.env.NODE_ENV === "production",
        };
        Cookies.set("token", data.data.token, cookieOptions);
      }
      // Store user info in localStorage
      if (data.data.user) {
        localStorage.setItem("user_info", JSON.stringify(data.data.user));
      }

      // Redirect to a dashboard or home page on success
      router.push("/forum/home");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(getFriendlyErrorMessage(err.message));
      } else {
        setError(getFriendlyErrorMessage("An unexpected error occurred."));
      }
      console.error("Authentication error:", err);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Right Side - Auth Forms */}
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

          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <>
              {/* Tab Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setActiveTab("signin")}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    activeTab === "signin"
                      ? "bg-slate-700 text-white"
                      : "bg-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab("signup")}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    activeTab === "signup"
                      ? "bg-orange-500 text-white"
                      : "bg-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Forms */}
              {activeTab === "signup" ? (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Join Our Community
                  </h2>
                  <p className="text-slate-400 mb-6">
                    Create your dealer account to start networking
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white text-sm mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-white text-sm mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white text-sm mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="dealer@example.com"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      {emailError && (
                        <p className="text-red-400 text-sm mt-1">
                          {emailError}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white text-sm mb-2">
                        Password
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
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white text-sm mb-2">
                        Confirm Password
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
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
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

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded bg-slate-700 border-slate-600"
                      />
                      <label className="text-slate-300 text-sm">
                        I agree to the{" "}
                        <Link
                          href="/termsofservice"
                          className="text-orange-500 hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacypolicy"
                          className="text-orange-500 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm text-center">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:bg-orange-400 disabled:cursor-not-allowed"
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-slate-400 mb-6">
                    Sign in to access the AutoEscrow dealer community
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-white text-sm mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="dealer@example.com"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      {emailError && (
                        <p className="text-red-400 text-sm mt-1">
                          {emailError}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white text-sm mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter your password"
                          className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="w-5 h-5 rounded bg-slate-700 border-slate-600"
                        />
                        <label className="text-slate-300 text-sm">
                          Remember me
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push("/auth/forgot-password")}
                        className="text-orange-500 text-sm hover:text-orange-400"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm text-center">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                      {loading ? "Signing In..." : "Sign In"}
                    </button>
                  </form>
                </div>
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AutoEscrowAuthPage() {
  return <AutoEscrowAuth />;
}
