interface VerificationRecord {
  code: number;
  expires: number;
  created: string;
}

class SMSMock {
  private verificationStore = new Map<string, VerificationRecord>();
  private sendHistory = new Map<string, number>();
  private sendLocks = new Map<string, boolean>();

  send(phone: string): number {
    if (this.sendLocks.has(phone)) {
      throw new Error('请求处理中，请稍后重试');
    }

    try {
      this.sendLocks.set(phone, true);

      const lastSent = this.sendHistory.get(phone);
      if (lastSent && Date.now() - lastSent < 60000) {
        throw new Error('操作过于频繁，请1分钟后再试');
      }

      const code = Math.floor(100000 + Math.random() * 900000);
      const expires = Date.now() + 300000;

      this.verificationStore.set(phone, {
        code,
        expires,
        created: new Date().toISOString()
      });

      this.sendHistory.set(phone, Date.now());

      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV SMS] ${phone}验证码：${code}`);
      }

      return code;
    } finally {
      this.sendLocks.delete(phone);
    }
  }

  verify(phone: string, inputCode: string): boolean {
    const record = this.verificationStore.get(phone);
    if (!record) return false;

    if (Date.now() > record.expires) {
      this.verificationStore.delete(phone);
      return false;
    }

    return record.code === parseInt(inputCode, 10);
  }

  cleanup(): void {
    const now = Date.now();
    this.verificationStore.forEach((record, phone) => {
      if (now > record.expires) {
        this.verificationStore.delete(phone);
        this.sendHistory.delete(phone);
      }
    });
  }
}

export const smsMock = new SMSMock();
setInterval(() => smsMock.cleanup(), 3600000);