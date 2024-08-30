import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoom } from './entity/chat-room.entity';
import { ChatGateway } from './chat.gateway';


@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private chatGateway: ChatGateway,
  ) {}

  //채팅 목록 반환
  @Get('list')
  async getMyChatRooms(@Query('userId') userId: number) {
    return this.chatService.getChatRoomsForUser(userId);
  }

  //채팅방 세부정보 가져오기
  @Get('room')
  async getOrCreateChatRoom(
    @Query('sellerId') sellerId: number,
    @Query('buyerId') buyerId: number,
    @Query('bookId') bookId: number,
    @Query('socketId') socketId?: string,
  ): Promise<ChatRoom> {
    if (!sellerId || !buyerId || !bookId) {
      throw new NotFoundException('Missing required query parameters');
    }

    const seller = await this.chatService.findUserById(sellerId);
    const buyer = await this.chatService.findUserById(buyerId);
    const book = await this.chatService.findBookById(bookId);

    if (!seller || !buyer || !book) {
      throw new NotFoundException('Invalid seller, buyer, or book ID');
    }

    const chatRoom = await this.chatService.findOrCreateChatRoom(sellerId, buyerId, bookId);

    //웹소켓
    if (socketId) {
      this.chatGateway.server.to(socketId).emit('roomJoined', chatRoom.id);
    }

    return chatRoom;
  }
}