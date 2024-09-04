import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'modules/user/entity/user.entity';
import { UserService } from 'modules/user/user.service';
import { UserController } from 'modules/user/user.controller';
import { UserMapper } from 'modules/user/mapper/user.mapper';
import { AuthModule } from 'modules/user/auth/auth.module';
import { ChatRoom } from 'modules/chat/entity/chat-room.entity';
import { Message } from 'modules/chat/entity/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Message, User]), AuthModule],
  controllers: [UserController],
  providers: [UserService, UserMapper],
})
export class UserModule {}
