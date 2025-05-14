import style from './style.module.scss';

interface LoginProps {
	isShow: boolean;
	onClose: () => void;
}

const Login = (props: LoginProps) => {
	const { isShow } = props;

	const handleClose = () => {};

	const getVerifyCode = () => {};

	const handleLogin = () => {};

	const handleOtherLogin = () => {};

	return isShow ? (
		<div className={style.loginContainer}>
			<div className={style.loginHeader}>
				<div>手机号登录</div>
				<div onClick={handleClose}>x</div>
			</div>
			<input name="phoneNum" type="text" placeholder="请输入手机号" />
			<div className={style.loginCode}>
				<input
					name="verifyCode"
					type="text"
					placeholder="请输入验证码"
				/>
				<span className={style.getCode} onClick={getVerifyCode}>
					获取验证码
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
	) : null;
};
export default Login;
