import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // 画像最適化は静的エクスポートでは無効化が必要
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
