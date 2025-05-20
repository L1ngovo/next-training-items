import { FormEvent, useState } from 'react';

interface Props {
	phone: string;
	onSuccess: () => void;
}

export default function VerifyCodeForm({ phone, onSuccess }: Props) {
	const [code, setCode] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			const res = await fetch('/api/verify-code', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ phone, code }),
			});

			if (res.ok) {
				onSuccess();
			} else {
				const error = await res.json();
				alert(error.error || '验证失败');
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<input
				type="text"
				placeholder="输入6位验证码"
				value={code}
				onChange={(e) =>
					setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
				}
				className="w-full p-2 border rounded"
			/>
			<button
				type="submit"
				disabled={submitting}
				className="w-full py-2 bg-green-500 text-white rounded disabled:opacity-50"
			>
				{submitting ? '验证中...' : '验证'}
			</button>
		</form>
	);
}
