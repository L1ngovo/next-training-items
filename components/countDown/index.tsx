import { useEffect, useRef, useState } from 'react';
import style from './style.module.scss';

interface countDownProps {
	time: number;
	onTimeOut: () => void;
}

const CountDown = (props: countDownProps) => {
	const { time, onTimeOut } = props;
	const [count, setCount] = useState(time || 60);
	const isMounted = useRef(false); // 防止组件卸载后继续执行定时器

	useEffect(() => {
		if (!isMounted.current) {
			isMounted.current = true;
			return;
		}
		const timer = setInterval(() => {
			setCount((count) => {
				if (count === 0) {
					if (onTimeOut) {
						onTimeOut(); // 执行超时回调
					}
					clearInterval(timer);
					return count;
				}
				return count - 1;
			});
			return () => {
				clearInterval(timer);
			};
		}, 1000);
	}, [time, onTimeOut]);

	return <div className={style.countDown}>重新获取({count})</div>;
};
export default CountDown;
