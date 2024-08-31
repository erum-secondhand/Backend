import { IsNotEmpty, IsString } from 'class-validator';

export class UserVerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  verificationCode: string;
}
