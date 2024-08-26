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
import { Response } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { UserRegisterDto } from 'src/modules/user/dto/request/user-register.dto';
import { UserRegisterResultDto } from 'src/modules/user/dto/response/user-register-result.dto';
import { UserLoginDto } from 'src/modules/user/dto/request/user-login.dto';
import { AuthService } from 'src/modules/user/auth/auth.service';
import { UserResetPasswordDto } from 'src/modules/user/dto/request/user-reset-password.dto';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import {
  CustomResponse,
  IResponse,
  ResponseDto,
} from 'src/global/common/response';
import { UserLoginResultDto } from './dto/response/user-login-result.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: '회원가입',
    operationId: 'registerUser',
    tags: ['user'],
  })
  @ApiOkResponse({
    type: ResponseDto(UserRegisterResultDto, 'UserRegisterResult'),
  })
  @Post('register')
  async registerUser(
    @Body() dto: UserRegisterDto,
    @Body('verificationCode') verificationCode: string,
  ): Promise<IResponse<UserRegisterResultDto>> {
    return this.userService.registerUser(dto, verificationCode);
  }

  @ApiOperation({
    summary: '로그인',
    operationId: 'loginUser',
    tags: ['user'],
  })
  @ApiOkResponse({
    type: ResponseDto(UserLoginResultDto, 'UserLoginResult'),
  })
  @Post('login')
  async loginUser(
    @Body() dto: UserLoginDto,
    @Session() session: Record<string, any>,
  ): Promise<IResponse<UserLoginResultDto>> {
    return this.userService.loginUser(dto, session);
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

  // TODO: response dto 파일 생성 및 ApiOkResponse 추가
  @ApiOperation({
    summary: '비밀번호 재설정',
    operationId: 'resetPassword',
    tags: ['user'],
  })
  @Put('reset-password')
  async resetPassword(
    @Body() dto: UserResetPasswordDto,
  ): Promise<CustomResponse<any>> {
    return this.userService.resetPassword(dto.email, dto.newPassword);
  }
}
