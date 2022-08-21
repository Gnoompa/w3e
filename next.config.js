/** @type {import('next').NextConfig} */

const withOptimizedImages = require('next-optimized-images');


const nextConfig = withOptimizedImages({
  // handleImages: ['png', 'svg'],
  // images: {
  //   disableStaticImages: true,
  //   loader: 'akamai',
  //   path: ''
  // },
  compiler: {
    emotion: true
  },
  reactStrictMode: true,
  styledComponents: true,
  typescript: {
    ignoreBuildErrors: true
  },
  env: {
    alchemyId: "SqVfu4nikI9zcQDsZxRzq7pjZ7wyTT4O"
  }
})

module.exports = nextConfig
