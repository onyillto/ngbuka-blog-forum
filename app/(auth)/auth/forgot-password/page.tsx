'use client'
import React, { useState } from "react";
import { Car, Shield, Users, CheckCircle, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }
    console.log("Password reset email sent to:", email);
    setIsSubmitted(true);
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
              <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
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
              <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
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
              <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
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

        {/* Right Side - Forgot Password Form */}
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

          {/* Forgot Password Form */}
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            {!isSubmitted ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-slate-400">
                    Enter your email address and we&apos;ll send you a link to
                    reset your password.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="dealer@example.com"
                        className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    Send Reset Link
                  </button>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => (window.location.href = "/auth/signin")}
                      className="text-slate-400 hover:text-white text-sm"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Success Message
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-500" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  Check Your Email
                </h2>
                <p className="text-slate-400 mb-6">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="text-white font-medium">{email}</span>
                </p>

                <div className="bg-slate-700/30 rounded-lg p-4 mb-6 text-left">
                  <p className="text-slate-300 text-sm mb-2">
                    Didn&apos;t receive the email?
                  </p>
                  <ul className="text-slate-400 text-sm space-y-1">
                    <li>• Check your spam folder</li>
                    <li>• Verify the email address is correct</li>
                    <li>• Wait a few minutes and check again</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    Resend Email
                  </button>

                  <button
                    onClick={() => (window.location.href = "/auth")}
                    className="w-full text-slate-400 hover:text-white text-sm"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
