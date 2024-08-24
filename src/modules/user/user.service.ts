import { Injectable, BadRequestException, Session } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/modules/user/entity/user.entity';
import { UserMapper } from 'src/modules/user/mapper/user.mapper';
import { AuthService } from 'src/modules/user/auth/auth.service';
import { UserRegisterDto } from 'src/modules/user/dto/request/user-register.dto';
import { UserRegisterResultDto } from 'src/modules/user/dto/response/user-register-result.dto';
import { UserLoginDto } from 'src/modules/user/dto/request/user-login.dto';
import { UserLoginResultDto } from 'src/modules/user/dto/response/user-login-result.dto';
import { EmailAlreadyExistsException } from 'src/modules/user/userException/EmailAlreadyExistsException';
import { StudentIDAlreadyExistsException } from 'src/modules/user/userException/StudentIDAlreadyExistsException';
import { NotFoundUserException } from 'src/modules/user/userException/NotFoundUserException';
import { LoginInvalidPasswordException } from 'src/modules/user/userException/LoginInvalidPasswordException';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userMapper: UserMapper,

    private readonly authService: AuthService,
  ) {}

  async registerUser(
    userRegisterRequestDto: UserRegisterDto,
    verificationCode: string,
  ): Promise<UserRegisterResultDto> {
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

    const newUserEntity = this.userMapper.DtoToEntity(userRegisterRequestDto);
    newUserEntity.password = hashedPassword

    const savedUser = await this.userRepository.save(newUserEntity);

    return this.userMapper.EntityToDto(savedUser);
  }

  async loginUser(
    userLoginRequestDto: UserLoginDto,
    session: Record<string, any>,
  ): Promise<UserLoginResultDto> {
    const { email, password } = userLoginRequestDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundUserException();

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new LoginInvalidPasswordException();

    session.userId = user.id;
    session.username = user.name;

    return { id: user.id, message: `${user.name}님 안녕하세요!` };
  }

  async findUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async resetPassword(email: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await this.userRepository.save(user);
    return true;
  }
}
