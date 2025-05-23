import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';

const generateRandomId = (): number => {
	const min = 1000000000; // 10位最小数字
	const max = 9999999999; // 10位最大数字
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		// 验证数据格式
		const phone = req.body;
		const { db } = await connectToDatabase();
		let retryCount = 0;
		const maxRetries = 5;
		while (retryCount < maxRetries) {
			try {
				const id = generateRandomId();
				const newUser = {
					id,
					name: `用户${id}`,
					phone,
					createdAt: new Date(),
				};

				const result = await db
					.collection('UserInfo')
					.insertOne(newUser);

				return res.status(201).json({
					success: true,
					id,
					insertedId: result.insertedId,
				});
			} catch (error) {
				if (error.code === 11000) {
					// MongoDB 唯一键冲突错误
					retryCount++;
					if (retryCount >= maxRetries) {
						return res.status(500).json({
							error: '无法生成唯一ID，请稍后重试',
						});
					}
				} else {
					console.error('数据库错误:', error);
					return res.status(500).json({ error: '服务器内部错误' });
				}
			}
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database operation failed' });
	}
}
