import type { NextConfig } from "next";

const backendOrigin = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "http", hostname: "localhost" },
    ],
    // The backend's local-disk upload fallback (used when Cloudinary env vars
    // aren't set — see backend/src/uploads/uploads.service.ts) serves images
    // from http://localhost:<port>/uploads/*, which Next 16 blocks by default
    // as an SSRF precaution. Safe here: only ever points at our own backend.
    dangerouslyAllowLocalIP: true,
  },
  async rewrites() {
    return [
      {
        // Same-origin proxy so the backend's httpOnly auth cookies work
        // without cross-site cookie restrictions (see README: Architecture).
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
