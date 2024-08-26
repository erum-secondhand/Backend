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
import { CustomResponse, IResponse } from 'src/global/common/response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userMapper: UserMapper,

    private readonly authService: AuthService,
  ) {}

  // 회원가입
  async registerUser(
    dto: UserRegisterDto,
    verificationCode: string,
  ): Promise<IResponse<UserRegisterResultDto>> {
    const { email, studentId, password } = dto;

    const isEmailExist = await this.userRepository.findOne({
      where: { email },
    });
    if (isEmailExist) throw new EmailAlreadyExistsException();

    const isStudentIDExist = await this.userRepository.findOne({
      where: { studentId },
    });
    if (isStudentIDExist) throw new StudentIDAlreadyExistsException();

    if (!this.authService.verifyEmailCode(email, verificationCode)) {
      throw new BadRequestException('유효하지 않거나 만료된 인증 코드입니다.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserEntity = this.userMapper.DtoToEntity(dto);
    newUserEntity.password = hashedPassword;

    const savedUser = await this.userRepository.save(newUserEntity);
    const resultDto = this.userMapper.EntityToDto(savedUser);

    return new CustomResponse<UserRegisterResultDto>(201, 'U001', resultDto);
  }

  // 로그인
  async loginUser(
    dto: UserLoginDto,
    session: Record<string, any>,
  ): Promise<CustomResponse<UserLoginResultDto>> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundUserException();

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new LoginInvalidPasswordException();

    session.userId = user.id;
    session.username = user.name;

    const loginResultDto = new UserLoginResultDto();
    loginResultDto.id = user.id;

    return new CustomResponse<UserLoginResultDto>(200, 'U002', loginResultDto);
  }

  // 로그인 상태 확인
  async getLoginStatus(userId: number): Promise<CustomResponse<any>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundUserException();

    return new CustomResponse(200, 'U005', {
      isLoggedIn: true,
      id: user.id,
      email: user.email,
      name: user.name,
      studentId: user.studentId,
      major: user.major,
    });
  }

  async findUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  // 비밀번호 재설정
  async resetPassword(
    email: string,
    newPassword: string,
  ): Promise<CustomResponse<any>> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundUserException();

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await this.userRepository.save(user);
    return new CustomResponse(
      200,
      'U003',
      '비밀번호가 성공적으로 재설정되었습니다.',
    );
  }
}
