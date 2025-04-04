import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thmhbvhcxkrqgrcdraoy.supabase.co",
        //hostname: "jhfqcqzskcdoulnsmhcv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
