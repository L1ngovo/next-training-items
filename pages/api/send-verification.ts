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
    // 生产环境逻辑（示例）
    if (process.env.NODE_ENV === 'production') {
      // 这里添加真实短信服务调用
      return res.status(200).json({ success: true });
    }

    const code = smsMock.send(phone);
    
    const response: {
      success: boolean;
      debugCode?: number;
    } = { success: true };

    if (process.env.NODE_ENV === 'development') {
      response.debugCode = code;
    }

    res.status(200).json(response);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '未知错误';
    res.status(500).json({ error: message });
  }
}