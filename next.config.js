module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.suatalk.site/:path*', // Proxy to Backend
      },
    ];
  },
}; 