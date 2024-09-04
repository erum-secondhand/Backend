import { Body, Controller, Post, Get, Res, Session, Put } from '@nestjs/common';
import { UserService } from 'modules/user/user.service';
import { UserRegisterDto } from 'modules/user/dto/request/user-register.dto';
import { UserRegisterResultDto } from 'modules/user/dto/response/user-register-result.dto';
import { UserLoginDto } from 'modules/user/dto/request/user-login.dto';
import { AuthService } from 'modules/user/auth/auth.service';
import { UserResetPasswordDto } from 'modules/user/dto/request/user-reset-password.dto';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import {
  CustomResponse,
  IResponse,
  ResponseDto,
} from '@global/common/response';
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

  // TODO: response dto 파일 생성 및 ApiOkResponse 추가
  @ApiOperation({
    summary: '로그인 상태 확인',
    operationId: 'getLoginStatus',
    tags: ['user'],
  })
  @Get('status')
  async getLoginStatus(
    @Session() session: Record<string, any>,
  ): Promise<CustomResponse<any>> {
    if (!session.userId) {
      return new CustomResponse(401, 'U004', '사용자가 로그인하지 않았습니다.');
    }
    return this.userService.getLoginStatus(session.userId);
  }

  // TODO: ApiOkResponse 추가
  @ApiOperation({
    summary: '로그아웃',
    operationId: 'logoutUser',
    tags: ['user'],
  })
  @Post('logout')
  async logoutUser(
    @Session() session: Record<string, any>,
  ): Promise<CustomResponse<any>> {
    try {
      const username = session.username;
      session.destroy((err) => {
        if (err) {
          throw new CustomResponse(500, 'U006', '로그아웃에 실패했습니다.');
        }
      });
      return new CustomResponse(200, 'U007', '로그아웃에 성공했습니다.');
    } catch (error) {
      return new CustomResponse(
        500,
        'U008',
        '서버 오류로 로그아웃에 실패했습니다.',
      );
    }
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
