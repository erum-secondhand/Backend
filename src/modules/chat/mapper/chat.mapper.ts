import { CreateChatRoomDto } from 'modules/chat/dto/create-chat-room.dto';
import { SendMessageDto } from 'modules/chat/dto/send-message.dto';
import { ChatRoom } from 'modules/chat/entity/chat-room.entity';
import { Message } from 'modules/chat/entity/chat.entity';
import { User } from 'modules/user/entity/user.entity';
import { Book } from 'modules/book/entity/book.entity';
import { ChatRoomDto } from 'modules/chat/dto/chat-room.dto';
import { plainToClass } from 'class-transformer';
export class ChatMapper {
  static async mapChatRoomDtoToEntity(
    dto: CreateChatRoomDto,
    book: Book,
    seller: User,
    buyer: User,
  ): Promise<ChatRoom> {
    const chatRoom = new ChatRoom();
    chatRoom.id = dto.id;
    chatRoom.book = book;
    chatRoom.seller = seller;
    chatRoom.buyer = buyer;
    chatRoom.updateAt = dto.updatedAt;
    return chatRoom;
  }

  static mapChatRoomEntityToDto(
    entity: ChatRoom,
    message: Message,
  ): CreateChatRoomDto {
    return {
      id: entity.id,
      bookId: entity.book.id,
      sellerId: entity.seller.id,
      buyerId: entity.buyer.id,
      recentMessageContent: message.content,
      updatedAt: entity.updateAt,
    };
  }

  static async mapMessageDtoToEntity(
    dto: SendMessageDto,
    chatRoom: ChatRoom,
    user: User,
  ): Promise<Message> {
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
      personId: entity.person.id,
    };
  }

  static mapChatRoomEntityToDto2(
    chatRoom: ChatRoom,
    messages: Message[],
  ): ChatRoomDto {
    return plainToClass(ChatRoomDto, {
      id: chatRoom.id,
      book: chatRoom.book,
      seller: chatRoom.seller,
      buyer: chatRoom.buyer,
      recentMessageContent: messages,
      updatedAt: chatRoom.updateAt,
    });
  }
}
