import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatMapper } from './mapper/chat.mapper';
import { ChatRoom } from './entity/chat-room.entity';
import { Message } from './entity/chat.entity';
import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Message, User]), UserModule],
  controllers: [ChatController],
  providers: [ChatService, ChatMapper, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}