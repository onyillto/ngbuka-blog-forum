/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        // This single entry allows both http and https
        hostname: "res.cloudinary.com",
        pathname: "/diemc336d/**", // More specific pathname for your Cloudinary account
      },
    ],
  },
};

module.exports = nextConfig;
