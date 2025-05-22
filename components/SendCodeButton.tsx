import { useState, useEffect } from 'react';

interface Props {
	phone: string;
	onSuccess?: () => void;
}

export default function SendCodeButton({ phone, onSuccess }: Props) {
	const [loading, setLoading] = useState(false);
	const [cooldown, setCooldown] = useState(0);

	useEffect(() => {
		if (cooldown > 0) {
			const timer = setInterval(() => {
				setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [cooldown]);

	const handleSend = async () => {
		if (cooldown > 0) return;

		setLoading(true);
		try {
			const response = await fetch('/api/send-verification', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ phone }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || '发送失败');
			}

			setCooldown(10);
			onSuccess?.();

			if (process.env.NODE_ENV === 'development' && data.debugCode) {
				alert(`[开发模式] 验证码：${data.debugCode}`);
			}
		} catch (error) {
			alert(error instanceof Error ? error.message : '请求异常');
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={handleSend}
			disabled={loading || cooldown > 0}
			className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{cooldown > 0
				? `${cooldown}秒后重试`
				: loading
				? '发送中...'
				: '获取验证码'}
		</button>
	);
}
