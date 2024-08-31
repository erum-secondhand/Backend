import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    client: Socket,
    @MessageBody() { sellerId, buyerId, bookId }: { sellerId: number; buyerId: number; bookId: number },
  ) {
    try {
      const chatRoom = await this.chatService.findOrCreateChatRoom(sellerId, buyerId, bookId);
      client.join(String(chatRoom.id));
      client.emit('roomCreated', chatRoom.id);
    } catch (error) {
      client.emit('error', error.message || 'An error occurred while creating or joining the room');
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    @MessageBody() { chatRoomId, personId, content }: { chatRoomId: number; personId: number; content: string },
  ) {
    try {
      const message = await this.chatService.saveMessage(chatRoomId, personId, content);
      this.server.to(String(chatRoomId)).emit('message', {
        id: message.id,
        person: message.person,
        content: message.content,
      });
    } catch (error) {
      client.emit('error', error.message || 'An error occurred while sending the message');
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    client: Socket,
    @MessageBody() { chatRoomId }: { chatRoomId: number },
  ) {
    try {
      client.leave(String(chatRoomId));
      client.emit('roomLeft', chatRoomId);
    } catch (error) {
      client.emit('error', error.message || 'An error occurred while leaving the room');
    }
  }
}