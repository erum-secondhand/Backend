import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from 'src/modules/user/auth/auth.service';
import { AuthController } from 'src/modules/user/auth/auth.controller';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
