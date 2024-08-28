import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserMapper } from './mapper/user.mapper';
import { AuthModule } from './auth/auth.module';
import { ChatRoom } from '../chat/entity/chat-room.entity';
import { Message } from '../chat/entity/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Message, User]), AuthModule],
  controllers: [UserController],
  providers: [UserService, UserMapper],
})
export class UserModule {}
