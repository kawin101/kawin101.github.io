const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // output: isProd ? 'export' : undefined, // Disabled to support API routes (History, Logging)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
