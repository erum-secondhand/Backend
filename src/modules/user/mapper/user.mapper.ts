import { Injectable } from '@nestjs/common';
import { UserRegisterDto } from 'src/modules/user/dto/request/user-register.dto';
import { User } from 'src/modules/user/entity/user.entity';
import { UserRegisterResultDto } from 'src/modules/user/dto/response/user-register-result.dto';

@Injectable()
export class UserMapper {
  DtoToEntity({
    email,
    name,
    studentId,
    major,
  }: UserRegisterDto): User {
    const user = new User();

    user.email = email;
    user.name = name;
    user.studentId = studentId;
    user.major = major;

    return user;
  }

  EntityToDto(user: User): UserRegisterResultDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      studentId: user.studentId,
      major: user.major,
    };
  }
}
