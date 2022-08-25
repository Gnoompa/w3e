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
    nftStorageToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBFODFFMzZFNjJlOTI2YjRlNkU2ODM4ODg5MGJGOUE1MTkyN0IwZkIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MTMyNzUwMzQ5NCwibmFtZSI6IndlYjNldmVudHMifQ.nA8BFI8388ETIYxXDe4a1Yt4x20gArrCIAhq10Wt0nI",
    alchemyId: "SqVfu4nikI9zcQDsZxRzq7pjZ7wyTT4O"
  }
})

module.exports = nextConfig
