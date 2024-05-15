/** @type {import('next').NextConfig} */
module.exports = {
    transpilePackages: ['ui'],
    reactStrictMode: true,
	swcMinify: true,
	output: "export",
	images: {
		unoptimized: true
	},
};
