/** @type {import('next').NextConfig} */
module.exports = {
    transpilePackages: ['ui'],
    images: {
        unoptimized: true,
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://szgm-next-server-production.up.railway.app/api/:path*',
            },
        ];
    },
};
