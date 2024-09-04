import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from 'modules/chat/chat.controller';
import { ChatMapper } from 'modules/chat/mapper/chat.mapper';
import { ChatRoom } from 'modules/chat/entity/chat-room.entity';
import { Message } from 'modules/chat/entity/chat.entity';
import { User } from 'modules/user/entity/user.entity';
import { Book } from 'modules/book/entity/book.entity';
import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, Message, User, Book]),
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatMapper, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
