import { useState } from 'react';

interface Props {
	phone: string;
	onSuccess?: () => void;
}

export default function SendCodeButton({ phone, onSuccess }: Props) {
	const [loading, setLoading] = useState(false);

	const handleSend = async () => {
		setLoading(true);
		try {
			const res = await fetch('/api/send-verification', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ phone }),
			});

			const data = await res.json();

			if (process.env.NODE_ENV === 'development' && data.debugCode) {
				alert(`开发模式验证码：${data.debugCode}`);
			}

			onSuccess?.();
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={handleSend}
			disabled={loading}
			className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
		>
			{loading ? '发送中...' : '获取验证码'}
		</button>
	);
}
