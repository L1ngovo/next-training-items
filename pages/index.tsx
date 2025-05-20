import SendCodeButton from '@/components/SendCodeButton';
import VerifyCodeForm from '@/components/VerifyCodeForm';
import type { NextPage } from 'next';

const Home: NextPage = () => {
	return (
		<div>
			<h1>首页</h1>
			<SendCodeButton />
			<VerifyCodeForm />
		</div>
	);
};

export default Home;
