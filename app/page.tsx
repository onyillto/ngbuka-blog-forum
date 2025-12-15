"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// =======================================================
// INTERFACES AND TYPES
// =======================================================

interface FeaturedCar {
  _id: string;
  brand: string;
  carModel: string;
  year: string;
  category: string;
  description: string;
  price: string;
  imageUrl: string;
}

interface CarDataDisplay extends FeaturedCar {
  // Add properties needed for display/styling
  model: string; // Alias for carModel for existing components
  color: string;
  features: string[];
}

// =======================================================
// CONSTANTS & UTILITIES (Replacing the old static carsData)
// =======================================================

// Map colors and features based on brand/model (Simulated data processing)
const carDisplayProps = (
  car: FeaturedCar
): Pick<CarDataDisplay, "color" | "features" | "model"> => {
  let color = "from-gray-500 to-gray-700";
  let features: string[] = ["Standard Safety", "ABS"];

  // Custom logic to assign colors and features based on known brands
  if (car.brand.toLowerCase() === "tesla") {
    color = "from-indigo-600 to-indigo-800";
    features = ["Autopilot", "Supercharging", "OTA Updates"];
  } else if (car.brand.toLowerCase() === "toyota") {
    color = "from-orange-400 to-orange-600";
    features = ["Hybrid Engine", "Safety Sense", "Reliable"];
  } else if (car.brand.toLowerCase() === "bmw") {
    color = "from-indigo-700 to-indigo-900";
    features = ["Turbo Engine", "All-Wheel Drive", "Premium Audio"];
  }

  return {
    color,
    features,
    model: car.carModel, // Use carModel from the API as 'model'
  };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BaseURL || "http://localhost:5080/api";
const FEATURED_CARS_ENDPOINT = `${API_BASE_URL}/featured-cars`;

// =======================================================
// ICONS (Keep as is)
// =======================================================

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

// =======================================================
// CAR CARD COMPONENT (Updated type definition)
// =======================================================

const CarCard = ({
  car,
  isActive,
}: {
  car: CarDataDisplay;
  isActive: boolean;
}) => {
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
            // Handle Freepik URL or placeholder image failures
            onError={() => {
              // Generate a robust, offline-first SVG placeholder
              const text = `${car.brand} ${car.model}`;
              const svg = `
                <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
                  <rect width="100%" height="100%" fill="#1A1A7A"/>
                  <text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">${text}</text>
                </svg>
              `;
              const placeholderUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
              setImageSrc(placeholderUrl);
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
              ₦{car.price.replace("$", "")}
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
      </div>
    </div>
  );
};

// =======================================================
// NAVBAR COMPONENT (Keep as is)
// =======================================================

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12  flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
              {/* <CarIcon className="w-7 h-7 text-white" /> */}
            </div>
            <div className="flex flex-col">
              {/* <span className="text-2xl font-bold" style={{ color: "#1A1A7A" }}>
                Ngbuka
              </span>
              <span className="text-xs text-orange-500 font-semibold -mt-1">
                FORUM
              </span> */}
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Visit Forum Button - Styled like your button */}
            <Link
              href="/forum/home"
              className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5 active:scale-100 active:translate-y-0 shadow-lg hover:shadow-xl flex items-center justify-center border-2 border-orange-400 hover:border-orange-500"
            >
              <MessageIcon className="w-5 h-5 mr-2" />
              Visit Forum
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// =======================================================
// HERO SECTION (Modified to fetch data)
// =======================================================

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredCars, setFeaturedCars] = useState<CarDataDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch data from the endpoint
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(FEATURED_CARS_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiData = await response.json();

        // 2. Map the API data to the component's required structure
        const processedCars: CarDataDisplay[] = apiData.map(
          (car: FeaturedCar, index: number) => ({
            ...car,
            id: index, // Use index or _id for key, using index here for simplicity
            ...carDisplayProps(car), // Get colors and features
          })
        );

        // Use a Set to filter out duplicates based on _id, then convert back to array
        const uniqueCars = Array.from(
          new Set(processedCars.map((c) => c._id))
        ).map((_id) =>
          processedCars.find((c) => c._id === _id)
        ) as CarDataDisplay[];

        setFeaturedCars(uniqueCars);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch featured cars:", error);
        // Fallback or error handling can go here
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []); // Run only once on mount

  // 3. Auto-advance logic
  useEffect(() => {
    if (featuredCars.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredCars.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [featuredCars]); // Depend on featuredCars to start only when data is loaded

  // 4. Loading state rendering
  if (isLoading) {
    return (
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #1A1A7A 0%, #2D2D9A 50%, #FF8E05 100%)",
        }}
      >
        <div className="text-white text-2xl animate-pulse">
          Loading featured cars...
        </div>
      </section>
    );
  }

  // 5. Empty state rendering
  if (featuredCars.length === 0 && !isLoading) {
    return (
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #1A1A7A 0%, #2D2D9A 50%, #FF8E05 100%)",
        }}
      >
        <div className="text-white text-xl text-center">
          <p className="mb-4">No featured cars found from the API.</p>
          <Link
            href="/forum/home"
            className="text-orange-400 underline hover:text-orange-500"
          >
            Go to Forum Home
          </Link>
        </div>
      </section>
    );
  }

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
        {/* Header (Keep as is) */}
        <div className="text-center mb-16 mt-5">
          <div className="flex items-center justify-center mb-6">
            <CarIcon className="w-12 h-12 text-orange-400 mr-4" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">
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
              className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:-translate-y-1 active:scale-100 active:translate-y-0 shadow-xl hover:shadow-2xl flex items-center justify-center border-2 border-orange-400 hover:border-orange-500"
            >
              <MessageIcon className="w-6 h-6 mr-2" />
              Visit Forum
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
                // Calculate translation based on the number of cars fetched
                transform: `translateX(-${currentIndex * (384 + 32)}px)`,
                width: `${featuredCars.length * (384 + 32)}px`,
              }}
            >
              {featuredCars.map((car, index) => (
                <CarCard
                  key={car._id}
                  car={car}
                  isActive={index === currentIndex}
                />
              ))}
            </div>
          </div>

          {/* Slider Controls */}
          <div className="flex justify-center mt-8 space-x-2">
            {featuredCars.map((_, index) => (
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

      {/* Floating Elements (Keep as is) */}
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

// Features Section (Keep as is)
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

// Stats Section (Keep as is)
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

// CTA Section (Keep as is)
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

// Main Landing Page Component (Keep as is)
const NgbukaLandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </div>
  );
};

export default NgbukaLandingPage;
