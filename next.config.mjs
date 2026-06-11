/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['route.tsx', 'route.ts', 'route.js', 'page.tsx', 'page.ts', 'page.js'],
  async redirects() {
    return [
      {
        source: '/confirmation/:id',
        destination: '/booked/:id',
        permanent: false
      }
    ];
  }
};
export default nextConfig;
