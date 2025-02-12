/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "img.doodcdn.co",
            },
            {
                hostname: "placehold.co",
            },
        ],
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    env: {
        DOODSTREAM_BASE_URL: process.env.DOODSTREAM_BASE_URL,
        DOODSTREAM_API_KEY: process.env.DOODSTREAM_API_KEY,
        SITENAME: process.env.SITENAME,
        DEFAULT_PER_PAGE: process.env.DEFAULT_PER_PAGE,
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
