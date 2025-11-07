import React from "react";
import Link from "next/link";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Welcome to Ngbuka Forum. By using our platform, you agree to comply
            with all terms, policies, and guidelines outlined in the following
            documents.
          </p>
        </div>

        {/* Policy Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Disclaimer Card */}
          <Link href="/disclaimer" className="group">
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-600 h-full">
              <div className="flex items-center mb-4">
                <svg
                  className="w-8 h-8 text-blue-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800">
                  Disclaimer
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Important information about liability, third-party interactions,
                and fraud protection.
              </p>
              <div className="text-blue-600 group-hover:underline font-medium flex items-center">
                Read Full Disclaimer
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Privacy Policy Card */}
          <Link href="/privacypolicy" className="group">
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 border-t-4 border-green-600 h-full">
              <div className="flex items-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800">
                  Privacy Policy
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Learn how we collect, use, and protect your personal information
                under NDPR.
              </p>
              <div className="text-green-600 group-hover:underline font-medium flex items-center">
                Read Privacy Policy
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Guidelines Card */}
          <Link href="/guidelines" className="group">
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 border-t-4 border-purple-600 h-full">
              <div className="flex items-center mb-4">
                <svg
                  className="w-8 h-8 text-purple-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800">
                  Community Guidelines
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Rules and expectations for respectful, safe, and productive
                forum participation.
              </p>
              <div className="text-purple-600 group-hover:underline font-medium flex items-center">
                Read Guidelines
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Key Points Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Key Points to Remember
          </h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Respect & Safety First
                </h3>
                <p className="text-gray-600">
                  Treat all members with respect. No harassment, hate speech, or
                  harmful content.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Your Data is Protected
                </h3>
                <p className="text-gray-600">
                  We follow NDPR guidelines and never share your data with third
                  parties for marketing.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  No Solicitation
                </h3>
                <p className="text-gray-600">
                  Asking for money or donations is strictly prohibited on the
                  platform.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-yellow-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Fraud Protection
                </h3>
                <p className="text-gray-600">
                  We will never ask for your banking details, passwords, or
                  request money from you.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-red-600 font-bold">5</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  You&apos;re Responsible
                </h3>
                <p className="text-gray-600">
                  You&apos;re responsible for your posts and any arrangements
                  made with other members.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Agreement Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your Agreement
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            By creating an account or using Ngbuka Forum, you acknowledge that
            you have read, understood, and agree to be bound by:
          </p>
          <ul className="space-y-2 text-gray-700 mb-6">
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-600 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>All terms stated in our Disclaimer</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-600 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>The Privacy Policy and data protection practices</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-600 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>All Community Guidelines and rules</span>
            </li>
          </ul>
          <p className="text-sm text-gray-600 italic">
            These terms may be updated from time to time. Continued use of the
            platform constitutes acceptance of any changes.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          <p className="mt-2">
            Questions? Contact us through our official website
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
