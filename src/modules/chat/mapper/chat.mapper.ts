import { CreateChatRoomDto } from '../dto/create-chat-room.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { ChatRoom } from '../entity/chat-room.entity';
import { Message } from '../entity/chat.entity';
import { User } from '../../user/entity/user.entity';
import { Book } from '../../book/entity/book.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class ChatMapper {
  static async mapChatRoomDtoToEntity(dto: CreateChatRoomDto, book: Book, seller: User, buyer: User): Promise<ChatRoom> {
    const chatRoom = new ChatRoom();
    chatRoom.id = dto.id;
    chatRoom.book = book;
    chatRoom.seller = seller;
    chatRoom.buyer = buyer;
    chatRoom.updateAt = dto.updatedAt;
    return chatRoom;
  }

  static mapChatRoomEntityToDto(entity: ChatRoom, message: Message): CreateChatRoomDto {
    return {
      id: entity.id,
      bookId: entity.book.id,
      sellerId: entity.seller.id,
      buyerId: entity.buyer.id,
      recentMessageContent: message.content,
      updatedAt: entity.updateAt
    };
  }

  static async mapMessageDtoToEntity(dto: SendMessageDto, chatRoom: ChatRoom, user: User): Promise<Message> {
    const message = new Message();
    message.id = dto.id;
    message.chatRoom = chatRoom;
    message.person = user;
    message.content = dto.content;
    return message;
  }

  static mapMessageEntityToDto(entity: Message): SendMessageDto {
    return {
      id: entity.id,
      chatRoomId: entity.chatRoom.id,
      content: entity.content,
      personId: entity.person.id
    };
  }
}