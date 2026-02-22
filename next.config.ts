import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static HTML export for the entire app
  output: "export",

  // Required when using `output: "export"` with the App Router
  images: {
    unoptimized: true,
  },

  reactCompiler: true,
};

export default nextConfig;
