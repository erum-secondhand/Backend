import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserVerifyEmailDto } from '../dto/request/user-verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send')
  async sendVerificationCode(@Body('email') email: string, @Res() res: Response) {
    try {
      await this.authService.generateVerificationCode(email);
      res.status(HttpStatus.OK).json({ message: '인증 코드가 이메일로 전송되었습니다. 이메일을 확인해 주세요.' });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Post('/verify')
  async verifyCode(@Body() verifyDto: UserVerifyEmailDto, @Res() res: Response) {
    if (this.authService.verifyEmailCode(verifyDto.email, verifyDto.verificationCode)) {
      res.status(HttpStatus.OK).json({ message: '이메일이 성공적으로 인증되었습니다.' });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ message: '인증 코드가 유효하지 않거나 만료되었습니다.' });
    }
  }
}
