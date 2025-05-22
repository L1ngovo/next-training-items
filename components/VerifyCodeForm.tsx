import { useState, FormEvent } from 'react';

interface Props {
	phone: string;
	onSuccess: () => void;
}

export default function VerifyForm({ phone, onSuccess }: Props) {
	const [code, setCode] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			const response = await fetch('/api/verify-code', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ phone, code }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error);
			}

			onSuccess();
		} catch (error) {
			alert(error instanceof Error ? error.message : '验证失败');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<input
				type="text"
				inputMode="numeric"
				pattern="\d{6}"
				placeholder="请输入6位验证码"
				value={code}
				onChange={(e) =>
					setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
				}
				className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
			/>
			<button
				type="submit"
				disabled={submitting}
				className="w-full py-3 bg-green-600 text-white rounded-md disabled:opacity-50"
			>
				{submitting ? '验证中...' : '立即验证'}
			</button>
		</form>
	);
}
