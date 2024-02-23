import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginRequestDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
