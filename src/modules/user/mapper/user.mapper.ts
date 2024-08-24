import { Injectable } from '@nestjs/common';
import { UserRegisterRequestDto } from '../dto/request/user-register.dto';
import { User } from '../entity/user.entity';
import { UserRegisterResponseDto } from '../dto/response/user-register-result.dto';

@Injectable()
export class UserMapper {
  DtoToEntity({
    email,
    name,
    studentId,
    major,
  }: UserRegisterRequestDto): User {
    const user = new User();

    user.email = email;
    user.name = name;
    user.studentId = studentId;
    user.major = major;

    return user;
  }

  EntityToDto(user: User): UserRegisterResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      studentId: user.studentId,
      major: user.major,
    };
  }
}
