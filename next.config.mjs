import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true
    },
    images: {
        remotePatterns: [
            {
                hostname: "avatars.githubusercontent.com"
            }
    ]
    }
};

export default nextConfig;
