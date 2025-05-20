interface VerificationRecord {
  code: number;
  expires: number;
  created: string;
}

class SMSMock {
  private verificationStore = new Map<string, VerificationRecord>();
  private sendHistory = new Map<string, number>();

  send(phone: string): number {
    // 频率限制检查
    const lastSent = this.sendHistory.get(phone);
    if (lastSent && Date.now() - lastSent < 60000) {
      throw new Error('操作过于频繁，请1分钟后再试');
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    const expires = Date.now() + 300000; // 5分钟有效期

    this.verificationStore.set(phone, {
      code,
      expires,
      created: new Date().toISOString()
    });

    this.sendHistory.set(phone, Date.now());

    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV SMS] 验证码发送至 ${phone}: ${code}`);
    }

    return code;
  }

  verify(phone: string, inputCode: string): boolean {
    const record = this.verificationStore.get(phone);
    if (!record) return false;

    // 清理过期记录
    if (Date.now() > record.expires) {
      this.verificationStore.delete(phone);
      return false;
    }

    return record.code === parseInt(inputCode, 10);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [phone, record] of this.verificationStore) {
      if (now > record.expires) {
        this.verificationStore.delete(phone);
        this.sendHistory.delete(phone);
      }
    }
  }

  // 开发环境调试用
  getDebugCode(phone: string): number | undefined {
    return this.verificationStore.get(phone)?.code;
  }
}

export const smsMock = new SMSMock();

// 每小时自动清理
setInterval(() => smsMock.cleanup(), 3600000);