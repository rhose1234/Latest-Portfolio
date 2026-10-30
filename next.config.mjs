const nextConfig = {
  reactStrictMode: true,
  // Resized images stay in the browser's cache for a week
  images: { minimumCacheTTL: 60 * 60 * 24 * 7 },
  // The rate card now lives on the UGC page; old links still land there
  async redirects() {
    return [{ source: "/rate-card", destination: "/ugc", permanent: true }];
  },
};
export default nextConfig;
