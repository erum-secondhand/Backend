import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  private verificationCodes = new Map<
    string,
    { code: string; timestamp: Date }
  >();

  async generateVerificationCode(email: string): Promise<string> {
    if (!email.endsWith('@tukorea.ac.kr')) {
      throw new Error('Invalid school email address.');
    }

    const code = crypto.randomBytes(3).toString('hex');
    this.verificationCodes.set(email, { code, timestamp: new Date() });

    await this.sendVerificationEmail(email, code);

    return code;
  }

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: this.configService.get<string>('EMAIL_SERVICE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Email Verification Code',
      text: `Your verification code is: ${code}`,
    };

    await transporter.sendMail(mailOptions);
  }

  verifyEmailCode(email: string, code: string): boolean {
    const storedCodeEntry = this.verificationCodes.get(email);

    if (!storedCodeEntry) {
      return false;
    }

    const now = new Date();
    const timeElapsed =
      (now.getTime() - storedCodeEntry.timestamp.getTime()) / 1000 / 60;

    if (storedCodeEntry.code === code && timeElapsed <= 5) {
      return true;
    }

    return false;
  }
}
