import { Injectable, BadRequestException, Session } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserRegisterRequestDto } from './dto/user-register-request.dto';
import { UserMapper } from './mapper/user.mapper';
import { AuthService } from './auth/auth.service';
import { EmailAlreadyExistsException } from './userException/EmailAlreadyExistsException';
import { StudentIDAlreadyExistsException } from './userException/StudentIDAlreadyExistsException';
import { UserLoginRequestDto } from './dto/user-login-request.dto';
import { UserLoginResponseDto } from './dto/user-login-response.dto';
import { NotFoundUserException } from './userException/NotFoundUserException';
import { LoginInvalidPasswordException } from './userException/LoginInvalidPasswordException';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userMapper: UserMapper,

    private readonly authService: AuthService,
  ) {}

  async registerUser(
    userRegisterRequestDto: UserRegisterRequestDto,
    verificationCode: string,
  ): Promise<User> {
    const { email, studentId, password } = userRegisterRequestDto;

    const isEmailExist = await this.userRepository.findOne({
      where: { email },
    });
    if (isEmailExist) throw new EmailAlreadyExistsException();

    const isStudentIDExist = await this.userRepository.findOne({
      where: { studentId },
    });
    if (isStudentIDExist) throw new StudentIDAlreadyExistsException();

    if (!this.authService.verifyEmailCode(email, verificationCode)) {
      throw new BadRequestException('Invalid or expired verification code.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    userRegisterRequestDto.password = hashedPassword;

    const newUserEntity = this.userMapper.DtoToEntity(userRegisterRequestDto);
    return await this.userRepository.save(newUserEntity);
  }

  async loginUser(
    userLoginRequestDto: UserLoginRequestDto,
    session: Record<string, any>,
  ): Promise<UserLoginResponseDto> {
    const { email, password } = userLoginRequestDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundUserException();

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new LoginInvalidPasswordException();

    session.userId = user.id;
    session.username = user.name;

    return { id: user.id, message: `${user.name}님 안녕하세요!` };
  }
}
