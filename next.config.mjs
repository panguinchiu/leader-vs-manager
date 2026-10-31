/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/leader-vs-manager',
  assetPrefix: '/leader-vs-manager',
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
