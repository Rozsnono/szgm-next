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
                destination: 'http://localhost:8000/api/:path*',
            },
        ];
    },
};
