/** @type {import('next').NextConfig} */
module.exports = {
    transpilePackages: ['ui'],
    reactStrictMode: true,
	swcMinify: true,
	images: {
		unoptimized: true
	},
	output: "export"
};
