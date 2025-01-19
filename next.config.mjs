/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
      { hostname: "w.buildasign.com" },
    ],
  },
};

export default nextConfig;
