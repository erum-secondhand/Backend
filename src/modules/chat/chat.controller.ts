import { Controller, Get, Query, NotFoundException, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Request } from 'express';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private chatGateway: ChatGateway,
  ) {}

  //채팅 목록 반환
  @Get('list')
  async getMyChatRooms(@Req() req: Request) {
    const userId = req.session.userId;

    if (!userId) {
      throw new NotFoundException('User not found in session');
    }

    return this.chatService.getChatRoomsForUser(userId);
  }

  //채팅방 세부정보 가져오기
  @Get('room')
  async getOrCreateChatRoom(
    @Query('sellerId') sellerId: number,
    @Query('buyerId') buyerId: number,
    @Query('bookId') bookId: number,
    @Query('socketId') socketId?: string,
  ) {
    if (!sellerId || !buyerId || !bookId) {
      throw new NotFoundException('Missing required query parameters');
    }

    const seller = await this.chatService.findUserById(sellerId);
    const buyer = await this.chatService.findUserById(buyerId);
    const book = await this.chatService.findBookById(bookId);

    if (!seller || !buyer || !book) {
      throw new NotFoundException('Invalid seller, buyer, or book ID');
    }

    const chatRoom = await this.chatService.findOrCreateChatRoom(
      sellerId,
      buyerId,
      bookId,
    );

    //웹소켓
    if (chatRoom && socketId) {
      const chatRoomId = chatRoom.chatRoom.id;
      this.chatGateway.server.to(socketId).emit('roomJoined', chatRoomId);
      this.chatGateway.server.sockets.sockets
        .get(socketId)
        ?.join(`room-${chatRoomId}`);
    }

    return chatRoom;
  }
}
