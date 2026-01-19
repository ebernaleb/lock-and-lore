import path from "path";
import type { NextConfig } from "next";

// Force the project root so Vercel/Turbopack don't pick a parent folder
const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
