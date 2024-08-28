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
    // 필수 쿼리 파라미터 체크
    if (!sellerId || !buyerId || !bookId) {
      throw new NotFoundException('Missing required query parameters');
    }

    // seller, buyer, book을 조회
    const seller = await this.chatService.findUserById(sellerId);
    const buyer = await this.chatService.findUserById(buyerId);
    const book = await this.chatService.findBookById(bookId);

    // 유효성 검사를 위한 체크
    if (!seller || !buyer || !book) {
      throw new NotFoundException('Invalid seller, buyer, or book ID');
    }

    // 채팅방 생성 또는 조회
    const chatRoom = await this.chatService.findOrCreateChatRoom(sellerId, buyerId, bookId);

    // WebSocket을 통해 채팅방 참가 알림 전송
    if (socketId) {
      this.chatGateway.server.to(socketId).emit('roomJoined', chatRoom.id);
    }

    return chatRoom;
  }
}