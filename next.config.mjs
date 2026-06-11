/** @type {import('next').NextConfig} */
const nextConfig = {
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
