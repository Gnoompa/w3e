/** @type {import('next').NextConfig} */

const withOptimizedImages = require('next-optimized-images');


const nextConfig = withOptimizedImages({
  handleImages: ['png', 'svg'],
  images: {
    disableStaticImages: true
} ,
  compiler: {
    emotion: true
  },
  reactStrictMode: true,
  styledComponents: true,
  typescript: {
    ignoreBuildErrors: true
  },
  env: {
    MORALIS_APP_ID: "nqUifo7bhYwPUOb9YonrC6eJ1eLndO2lCHKXZqmz",
    MORALIS_SERVER_URL: "https://lhy1mjmm823t.usemoralis.com:2053/server",
    MAINNET: "polygon",
    TESTNET: "mumbai",
    TICKERO_CONTRACT: "0xC657e5FC36b8A11075d59968FDe28fC1f46c6CBD"
  }
})

module.exports = nextConfig
