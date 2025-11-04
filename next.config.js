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
        pathname: "/diemc336d/image/upload/**", // Allow all images from your Cloudinary account
      },
    ],
  },
};

module.exports = nextConfig;
