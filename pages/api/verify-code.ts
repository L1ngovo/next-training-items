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
  
  const isValid = smsMock.verify(phone, code);
  
  if (isValid) {
    smsMock.cleanup();
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ error: '验证码无效或已过期' });
  }
}