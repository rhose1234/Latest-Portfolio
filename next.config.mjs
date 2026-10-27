const nextConfig = {
  reactStrictMode: true,
  // The rate card now lives on the UGC page; old links still land there
  async redirects() {
    return [{ source: "/rate-card", destination: "/ugc", permanent: true }];
  },
};
export default nextConfig;
