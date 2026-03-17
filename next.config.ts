import { redirect } from 'next/dist/server/api-utils';

module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/music/main',
        permanent: true,
      },
    ];
  },
};
