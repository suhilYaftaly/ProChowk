/** @type {import('next').NextConfig} */
const nextConfig = {
    serverRuntimeConfig: {
      exposeErrors: process.env.NODE_ENV === 'development',
    },
  };
  
  module.exports = nextConfig;
