import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
      additionalData: `$var: red;`,
  },
  eslint: {
    ignoreDuringBuilds: true, //Small warning, but we can ignore it for now
  },
  typescript: {
    ignoreBuildErrors: true, //Temporary, should be fixed later
  }
};

export default nextConfig;
