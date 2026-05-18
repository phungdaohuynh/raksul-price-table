import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  transpilePackages: ["@raksul-price-table/api", "@raksul-price-table/ui"]
};

export default nextConfig;
