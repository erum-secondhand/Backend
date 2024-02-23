import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { UserRegisterRequestDto } from './dto/user-register-request.dto';
import { UserMapper } from './mapper/user.mapper';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Post('/register')
  async registerUser(
    @Body() registerUserRequestDto: UserRegisterRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const newUser = await this.userService.registerUser(registerUserRequestDto);
    const response = this.userMapper.EntityToDto(newUser);
    res.status(HttpStatus.CREATED).json(response);
  }
}
