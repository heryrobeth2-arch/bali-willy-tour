import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-f626deb9-464a-4760-a66b-bc556120618f.space-z.ai",
  ],
};

export default nextConfig;
