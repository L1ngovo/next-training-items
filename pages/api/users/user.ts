import { connectToDatabase } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { id } = req.query;
	const { db } = await connectToDatabase();

	const user = await db.collection('UserInfo').findOne({ id: 5570988546 });
	if (!user) {
		return res.status(404).json({ error: '用户不存在' });
	}

	return res.status(200).json(user);
}
