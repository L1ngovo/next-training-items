import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { db } = await connectToDatabase();

    if (req.method === 'POST') {
      const result = await db
        .collection<{ title: string; content: string }>('posts')
        .insertOne(req.body);
      return res.status(201).json(result);
    }

    const posts = await db
      .collection('posts')
      .find({})
      .toArray();
    
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database operation failed' });
  }
}