import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entity/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { UserController } from 'src/modules/user/user.controller';
import { UserMapper } from 'src/modules/user/mapper/user.mapper';
import { AuthModule } from 'src/modules/user/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UserController],
  providers: [UserService, UserMapper],
})
export class UserModule {}
