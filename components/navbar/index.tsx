import { NextPage } from 'next';
import Link from 'next/link';
import { navbarRoutes } from './router';
import style from './style.module.scss';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import Login from '../login';
import { useState } from 'react';

const Navbar: NextPage = ({}) => {
	const { pathname } = useRouter();

	const [isShowLogin, setIsSHowLogin] = useState(false);

	const handleEditor = () => {};

	const handleLogin = () => {
		setIsSHowLogin(true);
	};

	const handleClose = () => {
		setIsSHowLogin(false);
	};

	return (
		<div className={style.navbar}>
			<section className={style.logo}>BLOG</section>
			<section className={style.links}>
				{navbarRoutes?.map((nav) => {
					return (
						<Link
							href={nav?.path}
							key={nav?.name}
							className={
								pathname === nav?.path ? style.active : ''
							}
						>
							{nav?.name}
						</Link>
					);
				})}
			</section>
			<section className={style.options}>
				<Button onClick={handleEditor}>创作</Button>
				<Button onClick={handleLogin}>登录</Button>
			</section>
			<Login isShow={isShowLogin} onClick={handleClose}></Login>
		</div>
	);
};
export default Navbar;
