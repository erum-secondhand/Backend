import { IsNotEmpty, IsString } from 'class-validator';

export class UserResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
