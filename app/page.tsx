"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Icons
const CarIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-6 h-6 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 14c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9c0-3.3 2.7-6 6-6h2c3.3 0 6 2.7 6 6v5z"
    />
    <circle cx="9" cy="17" r="2" />
    <circle cx="15" cy="17" r="2" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-5 h-5 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-6 h-6 ${className || ""}`}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

const MessageIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-6 h-6 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-6 h-6 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ToolsIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-6 h-6 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-6 h-6 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
);

// Car data with theme colors
// Car data with theme colors
const carsData = [
  {
    id: 1,
    brand: "Toyota",
    model: "Camry Hybrid",
    year: "2024",
    category: "Sedan",
    description:
      "Reliable hybrid sedan with exceptional fuel efficiency and Toyota's renowned durability. Perfect for daily commuting.",
    features: ["Hybrid Engine", "Safety Sense 2.0", "Spacious Interior"],
    color: "from-orange-400 to-orange-600",
    image: "🚗",
    price: "$28,400",
    imageUrl: "/car2.jpg",
  },
  {
    id: 2,
    brand: "BMW",
    model: "X3 M40i",
    year: "2024",
    category: "SUV",
    description:
      "Luxury performance SUV combining BMW's driving dynamics with practical utility. Premium materials throughout.",
    features: ["Turbo Engine", "All-Wheel Drive", "Premium Audio"],
    color: "from-indigo-700 to-indigo-900",
    image: "/car.jpg",
    price: "$56,300",
    imageUrl: "/car.jpg",
  },
  {
    id: 3,
    brand: "Honda",
    model: "Civic Type R",
    year: "2024",
    category: "Sport",
    description:
      "Track-ready hot hatch with aggressive styling and race-tuned suspension. Built for driving enthusiasts.",
    features: ["Manual Transmission", "Track Mode", "Brembo Brakes"],
    color: "from-orange-500 to-orange-700",
    image: "🏎️",
    price: "$43,735",
    imageUrl: "/car.jpg",
  },
  {
    id: 4,
    brand: "Tesla",
    model: "Model 3",
    year: "2024",
    category: "Electric",
    description:
      "Revolutionary electric sedan with autopilot capabilities and over-the-air updates. Zero emissions driving.",
    features: ["Autopilot", "Supercharging", "OTA Updates"],
    color: "from-indigo-600 to-indigo-800",
    image: "⚡",
    price: "$38,990",
    imageUrl: "/car.jpg",
  },
  {
    id: 5,
    brand: "Ford",
    model: "F-150 Lightning",
    year: "2024",
    category: "Truck",
    description:
      "America's best-selling truck goes electric with impressive towing capacity and innovative features.",
    features: ["Electric Powertrain", "11,000 lbs Towing", "Pro Power Onboard"],
    color: "from-orange-600 to-orange-800",
    image: "🛻",
    price: "$59,974",
    imageUrl: "/car.jpg",
  },
  {
    id: 6,
    brand: "Porsche",
    model: "911 Turbo S",
    year: "2024",
    category: "Sports Car",
    description:
      "Iconic sports car with legendary performance and timeless design. The ultimate driving machine.",
    features: ["Turbo Engine", "PDK Transmission", "Sport Chrono"],
    color: "from-orange-500 to-orange-700",
    image: "🏁",
    price: "$230,400",
    imageUrl: "/car.jpg",
  },
];

// Car Card Component
type Car = {
  id: number;
  brand: string;
  model: string;
  year: string;
  category: string;
  description: string;
  features: string[];
  color: string;
  image: string;
  price: string;
  imageUrl: string;
};
const CarCard = ({ car, isActive }: { car: Car; isActive: boolean }) => {
  const [imageSrc, setImageSrc] = useState(car.imageUrl);

  return (
    <div
      className={`flex-shrink-0 w-96 h-80 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-700 ${
        isActive ? "scale-105" : "scale-95 opacity-80"
      }`}
    >
      <div className="h-full bg-white relative overflow-hidden group">
        {/* Car Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageSrc}
            alt={`${car.brand} ${car.model}`}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            fill
            sizes="400px"
            onError={() => {
              // Fallback to placeholder if image fails to load
              setImageSrc(
                `https://via.placeholder.com/400x300/1A1A7A/FFFFFF?text=${car.brand}+${car.model}`
              );
            }}
          />

          {/* Gradient Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t ${car.color} opacity-20`}
          ></div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
              {car.category}
            </span>
          </div>

          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-black/70 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full">
              {car.price}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-32">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {car.brand} {car.model}
            </h3>
            <span className="text-sm text-gray-500 font-medium">
              {car.year}
            </span>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
            {car.description}
          </p>

          <div className="flex flex-wrap gap-1">
            {car.features.slice(0, 2).map((feature: string, index: number) => (
              <span
                key={index}
                className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full border border-orange-100"
              >
                {feature}
              </span>
            ))}
            {car.features.length > 2 && (
              <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-full border border-gray-200">
                +{car.features.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Hover Overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-6 w-full">
            <button className="w-full bg-white text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
              View Details
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

// Hero Section with Sliding Cars
const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carsData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-orange-900 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1A1A7A 0%, #2D2D9A 50%, #FF8E05 100%)",
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-transparent to-orange-500/5 rounded-full animate-spin-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <CarIcon className="w-12 h-12 text-orange-400 mr-4" />
            <h1 className="text-5xl md:text-7xl font-bold text-white">
              Ngbuka <span className="text-orange-400">Forum</span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of car enthusiasts sharing knowledge, solving
            problems, and celebrating automotive passion
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/forum/home"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <MessageIcon className="w-6 h-6 mr-2" />
              Join Discussions
            </Link>

          </div>
        </div>

        {/* Sliding Cars Section */}
        <div className="relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Car Models
            </h2>
            <p className="text-gray-300 text-lg">
              Discover and discuss the latest automotive innovations
            </p>
          </div>

          {/* Car Slider */}
          <div className="relative overflow-hidden">
            <div
              className="flex gap-8 transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (384 + 32)}px)`,
                width: `${carsData.length * (384 + 32)}px`,
              }}
            >
              {carsData.map((car, index) => (
                <CarCard
                  key={car.id}
                  car={car}
                  isActive={index === currentIndex}
                />
              ))}
            </div>
          </div>

          {/* Slider Controls */}
          <div className="flex justify-center mt-8 space-x-2">
            {carsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-orange-400 w-8"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="flex justify-center mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white text-sm">
                Auto-advancing every 4 seconds
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 text-6xl opacity-20 animate-bounce">
        🚗
      </div>
      <div className="absolute top-3/4 right-10 text-4xl opacity-20 animate-bounce delay-1000">
        🔧
      </div>
      <div className="absolute bottom-1/4 left-1/3 text-5xl opacity-20 animate-bounce delay-500">
        ⚡
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <MessageIcon className="w-8 h-8" />,
      title: "Community Discussions",
      description:
        "Connect with fellow car enthusiasts, share experiences, and get expert advice on any automotive topic.",
      color: "from-orange-400 to-orange-600",
    },
    {
      icon: <SearchIcon className="w-8 h-8" />,
      title: "Problem Solutions",
      description:
        "Find solutions to car problems with our comprehensive database of resolved issues and expert recommendations.",
      color: "from-indigo-500 to-indigo-700",
    },
    {
      icon: <ToolsIcon className="w-8 h-8" />,
      title: "Technical Support",
      description:
        "Get technical assistance from certified mechanics and experienced DIY enthusiasts in our community.",
      color: "from-orange-500 to-orange-700",
    },
    {
      icon: <UsersIcon className="w-8 h-8" />,
      title: "Expert Network",
      description:
        "Access a network of automotive professionals, from mechanics to engineers, ready to help with complex issues.",
      color: "from-indigo-600 to-indigo-800",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "#1A1A7A" }}
          >
            Why Choose Ngbuka Forum?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;re more than just a forum - we&apos;re a comprehensive
            automotive community designed to help you with every aspect of car
            ownership
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#1A1A7A" }}
              >
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Section
const StatsSection = () => {
  const stats = [
    { number: "50K+", label: "Active Members", icon: "👥" },
    { number: "200K+", label: "Discussions", icon: "💬" },
    { number: "150K+", label: "Problems Solved", icon: "✅" },
    { number: "24/7", label: "Community Support", icon: "🛠️" },
  ];

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1A1A7A 0%, #FF8E05 100%)",
      }}
    >
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-white/5 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join a Thriving Community
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See why thousands of car enthusiasts trust Ngbuka Forum for their
            automotive needs
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                {stat.number}
              </div>
              <div className="text-gray-300 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => (
  <section className="py-20 text-white" style={{ backgroundColor: "#1A1A7A" }}>
    <div className="container mx-auto px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Join the Community?
        </h2>
        <p className="text-xl text-gray-300 mb-10 leading-relaxed">
          Whether you&apos;re a car owner with questions, a mechanic sharing
          expertise, or an enthusiast passionate about automobiles, Ngbuka Forum
          is your home for all things automotive.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/auth/signin"
            className="text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
            style={{ backgroundColor: "#FF8E05" }} // Initial background color
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#E87D04")
            } // Change on hover
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#FF8E05")
            } // Revert on mouse leave
          >
            <MessageIcon className="w-6 h-6 mr-3" />
            Start Discussing Now
            <ArrowRightIcon className="w-5 h-5 ml-3" />
          </Link>
          
        </div>

        <div className="mt-12 text-sm text-gray-400">
          <p>Free to join • No spam • Helpful community • Expert advice</p>
        </div>
      </div>
    </div>
  </section>
);

// Main Landing Page Component
const NgbukaLandingPage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </div>
  );
};

export default NgbukaLandingPage;
