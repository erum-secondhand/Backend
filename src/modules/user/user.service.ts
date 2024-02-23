import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserRegisterRequestDto } from './dto/user-register-request.dto';
import { UserMapper } from './mapper/user.mapper';
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
  ) {}

  async registerUser(
    userRegisterRequestDto: UserRegisterRequestDto,
  ): Promise<User> {
    // 이메일 유효성 체크
    const isEmailExist = await this.userRepository.findOne({
      where: { email: userRegisterRequestDto.email },
    });
    if (isEmailExist) {
      throw new EmailAlreadyExistsException();
    }

    // 학번 유효성 체크
    const isStudentIDExist = await this.userRepository.findOne({
      where: { studentId: userRegisterRequestDto.studentId },
    });
    if (isStudentIDExist) {
      throw new StudentIDAlreadyExistsException();
    }

    // 비밀번호 암호화
    const { password } = userRegisterRequestDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    userRegisterRequestDto.password = hashedPassword;

    const newUserEntity = this.userMapper.DtoToEntity(userRegisterRequestDto);
    return await this.userRepository.save(newUserEntity);
  }

  async loginUser(
    userLoginRequestDto: UserLoginRequestDto,
  ): Promise<UserLoginResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: userLoginRequestDto.email },
    });
    if (!user) {
      throw new NotFoundUserException();
    }

    const { password } = userLoginRequestDto;
    if (user && (await bcrypt.compare(password, user.password))) {
      const response: UserLoginResponseDto = {
        id: user.id,
        message: `${user.name}님 안녕하세요!`,
      };
      return response;
    } else {
      throw new LoginInvalidPasswordException();
    }
  }
}
