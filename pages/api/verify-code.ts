import { NextApiRequest, NextApiResponse } from 'next';
import { smsMock } from '../../lib/smsMock';

interface RequestBody {
  phone: string;
  code: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, code } = req.body as RequestBody;
  
  try {
    const isValid = smsMock.verify(phone, code);
    
    if (isValid) {
      smsMock.cleanup();
      return res.status(200).json({ success: true });
    }
    return res.status(401).json({ error: '验证码无效或已过期' });
  } catch (error) {
    res.status(500).json({ error: '验证服务不可用' });
  }
}