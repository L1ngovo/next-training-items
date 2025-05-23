import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	transpilePackages: ['antd', '@ant-design', 'rc-*'],
	/* config options here */
	reactStrictMode: true,
};

export default nextConfig;
