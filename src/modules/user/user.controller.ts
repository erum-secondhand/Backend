import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Get,
  Res,
  Session,
  Put,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { UserRegisterRequestDto } from './dto/request/user-register-request.dto';
import { UserLoginRequestDto } from './dto/request/user-login-request.dto';
import { AuthService } from './auth/auth.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  async registerUser(
    @Body() registerUserRequestDto: UserRegisterRequestDto,
    @Body('verificationCode') verificationCode: string,
    @Res() res: Response,
  ) {
    if (
      !(await this.authService.verifyEmailCode(
        registerUserRequestDto.email,
        verificationCode,
      ))
    ) {
      throw new BadRequestException('Invalid or expired verification code.');
    }

    const newUser = await this.userService.registerUser(
      registerUserRequestDto,
      verificationCode,
    );
    res.status(HttpStatus.CREATED).json(newUser);
  }

  @Post('/login')
  async loginUser(
    @Body() userLoginRequestDto: UserLoginRequestDto,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const response = await this.userService.loginUser(
      userLoginRequestDto,
      session,
    );
    res.status(HttpStatus.OK).json(response);
  }

  @Get('/status')
  async getLoginStatus(
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    if (session.userId) {
      const user = await this.userService.findUserById(session.userId);
      if (user) {
        return res.status(HttpStatus.OK).json({
          isLoggedIn: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            studentId: user.studentId,
            major: user.major,
          },
        });
      }
    }
    return res.status(HttpStatus.OK).json({ isLoggedIn: false });
  }

  @Post('/logout')
  async logoutUser(
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const name = session.username;
    session.destroy((err) => {
      if (err) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Logout failed' });
      }
      res.status(HttpStatus.OK).json({ message: `${name}님 안녕히가세요!` });
    });
  }

  @Put('/reset-password')
  async resetPassword(@Body() resetDto: ResetPasswordDto, @Res() res: Response) {
    try {
      const success = await this.userService.resetPassword(resetDto.email, resetDto.newPassword);
      if (success) {
        res.status(HttpStatus.OK).json({ message: '비밀번호가 성공적으로 재설정되었습니다.' });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: '비밀번호 재설정에 실패했습니다.' });
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: '서버 오류로 비밀번호 재설정에 실패했습니다.' });
    }
  }
}
