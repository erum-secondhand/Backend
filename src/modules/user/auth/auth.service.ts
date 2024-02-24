import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

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

    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              text-align: center;
              font-family: 'Arial', sans-serif;
              color: black;
            }
            .code {
              font-size: 24px;
              color: black;
              border: 1px solid #ddd;
              padding: 10px;
              display: inline-block;
              margin: 10px 0;
              background-color: #f9f9f9;
            }
          </style>
        </head>
        <body>
          <p>안녕하세요! 컴퓨터공학부 학생회 이룸 이메일 인증 서비스입니다 🌟</p>
          <p>귀하의 이메일 인증 코드는 다음과 같습니다:</p>
          <div class="code">${code}</div>
          <p>이 코드는 5분간 유효합니다.</p>
        </body>
      </html>
    `;

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: '📚 전공서적 중고마켓 이용을 위한 이메일 인증 서비스 📚',
      html: htmlContent,
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
