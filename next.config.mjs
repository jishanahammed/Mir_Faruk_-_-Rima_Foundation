/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  devIndicators: false,
  reactCompiler: true,
  images: {
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/api/asset", search: "**" },
    ],
  },
};

export default nextConfig;
