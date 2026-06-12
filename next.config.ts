import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do NOT use output: "standalone" - we use dev mode with custom server
  // which handles cross-origin iframe requests properly
  reactStrictMode: false,
  allowedDevOrigins: [
    // Space-Z platform domains
    ".space-z.ai",
    "space-z.ai",
    ".space.chatglm.site",
    "space.chatglm.site",
    // Alibaba Cloud FC domains
    ".fc.devsapp.net",
    "fc.devsapp.net",
    ".devsapp.net",
    "devsapp.net",
    ".aliyuncs.com",
    "aliyuncs.com",
    ".fc.aliyuncs.com",
    "fc.aliyuncs.com",
    // Z.ai domains
    ".z.ai",
    "z.ai",
    // Local
    "localhost",
    "127.0.0.1",
    // Common cloud provider domains
    ".cn-hongkong.fc.devsapp.net",
    "cn-hongkong.fc.devsapp.net",
  ],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *;",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
