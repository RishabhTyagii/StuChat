import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yourbaazartest.s3.ap-south-1.amazonaws.com",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
