/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    emotion: true
  },
  reactStrictMode: true,
  styledComponents: true,
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
