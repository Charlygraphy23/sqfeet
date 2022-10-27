/** @type {import('next').NextConfig} */

const withCss = require('next-sass');
const withPurgeCss = require('next-purgecss');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withBundleAnalyzer(nextConfig);
