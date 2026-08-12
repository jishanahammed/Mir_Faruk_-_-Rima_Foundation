/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  devIndicators: false,
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/api/asset", search: "**" },
    ],
    // googleusercontent.com serves Google account profile photos shown after
    // sign-in (see google-signin-button.js / customer-feedback-section.js).
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
