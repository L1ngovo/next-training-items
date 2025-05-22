import Layout from '@/components/layout';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { connectToDatabase } from '../lib/mongodb';

if (
	typeof window === 'undefined' && // 服务端环境
	process.env.NODE_ENV === 'development'
) {
	import('../lib/mongodb')
		.then(({ connectToDatabase }) => connectToDatabase())
		.then(({ client }) => {
			console.log('🚀 服务端已连接 MongoDB');
		})
		.catch(console.error);
}

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Layout>
			<Component {...pageProps} />
		</Layout>
	);
}
