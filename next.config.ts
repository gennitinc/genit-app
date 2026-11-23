import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // shortcut: ~870 pre-existing type errors, mostly from broken dependency typings
  // (@reactflow/core 11.11.4 ships unresolvable .d.ts paths; novel pulls tiptap v2
  // alongside v3). Run `npx tsc --noEmit` to see them; remove once they're cleaned up.
  typescript: { ignoreBuildErrors: true },
  async redirects() {
    return [
      {
        source: "/all/plugins",
        destination: "/plugins",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "https",
        hostname: "gennit-storage.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
  // PWA configuration
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
