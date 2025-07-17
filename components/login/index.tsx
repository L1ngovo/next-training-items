import React, { useState } from 'react';
import style from './style.module.scss';
import CountDown from '../countdown';
import { message } from 'antd';

interface LoginProps {
	isShow: boolean;
	onClose: () => void;
}

const Login = (props: LoginProps) => {
	const { isShow } = props;
	const [form, setForm] = useState({
		phoneNum: '',
		verifyCode: '',
	});

	const [hasVerifyCode, setHasVerifyCode] = useState(false);

	const handleClose = () => {};

	const handleGetVerifyCode = () => {
		setHasVerifyCode(true);
	};

	const handleCountDownEnd = () => {
		setHasVerifyCode(false);
	};

	const handleLogin = async () => {
		try {
			const res = await fetch('api/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form.phoneNum),
			});
			const result = await res.json();
			if (res.ok) {
				message.success('登录成功');
			} else {
				message.error(result.message);
			}
		} catch (error) {
			message.error('登录失败');
		}
	};

	const handleOtherLogin = async () => {
		console.log(1111);
		const id = '5570988546';
		try {
			const res = await fetch('api/users/user');
			console.log(res);
			// const result = await res.json();
			// if (res.ok) {
			// 	message.success('登录成功');
			// } else {
			// 	message.error(result.message);
			// }
		} catch (error) {
			message.error('登录失败');
		}
	};

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value,
		});
	};

	return isShow ? (
		<div className={style.loginArea}>
			<div className={style.loginContainer}>
				<div className={style.loginHeader}>
					<div>手机号登录</div>
					<div className={style.closeBtn} onClick={handleClose}>
						x
					</div>
				</div>
				<input
					name="phoneNum"
					type="text"
					placeholder="请输入手机号"
					value={form.phoneNum}
					onChange={handleFormChange}
				/>
				<div className={style.loginCode}>
					<input
						name="verifyCode"
						type="text"
						placeholder="请输入验证码"
						value={form.verifyCode}
						onChange={handleFormChange}
					/>
					<span
						className={style.getCode}
						onClick={handleGetVerifyCode}
					>
						{hasVerifyCode ? (
							<CountDown
								time={10}
								onTimeOut={handleCountDownEnd}
							/>
						) : (
							'获取验证码'
						)}
					</span>
				</div>
				<div className={style.loginBtn} onClick={handleLogin}>
					登录
				</div>
				<div className={style.loginOther} onClick={handleOtherLogin}>
					使用三方登录
				</div>
				<div className={style.loginPolicy}>
					登录即视为同意<a href="">《隐私协议》</a>
				</div>
			</div>
		</div>
	) : null;
};
export default Login;
