import { IsNotEmpty } from 'class-validator';

export class UserRegisterDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  studentId: string;

  @IsNotEmpty()
  major: string;
}
