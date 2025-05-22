import { NextApiRequest, NextApiResponse } from 'next';
import { smsMock } from '../../lib/smsMock';

interface RequestBody {
  phone: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body as RequestBody;

  try {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境接入真实短信服务
      return res.status(200).json({ success: true });
    }

    const code = smsMock.send(phone);
    
    const response = {
      success: true,
      debugCode: process.env.NODE_ENV === 'development' ? code : undefined
    };

    res.status(200).json(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('过于频繁')) {
        return res.status(429).json({
          code: 'TOO_MANY_REQUESTS',
          error: error.message
        });
      }
      return res.status(400).json({
        code: 'BAD_REQUEST',
        error: error.message
      });
    }
    res.status(500).json({ code: 'INTERNAL_ERROR', error: '未知错误' });
  }
}