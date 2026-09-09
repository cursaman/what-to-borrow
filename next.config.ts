import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cover.nl.go.kr" }],
  },
};
export default nextConfig;
