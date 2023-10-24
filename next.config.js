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
                destination: 'https://teal-frail-ostrich.cyclic.app/api/:path*',
            },
        ];
    },
};
