import { Injectable } from '@nestjs/common';
import { ChatRoom } from './entity/chat-room.entity';
import { Book } from '../book/entity/book.entity';
import { Message } from './entity/chat.entity';
import { User } from '../user/entity/user.entity'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async findUserById(userId: number): Promise<User | undefined> {
    return this.userRepository.findOneBy({ id: userId });
  }

  async findBookById(bookId: number): Promise<Book | undefined> {
    return this.bookRepository.findOneBy({ id: bookId });
  }

  async findOrCreateChatRoom(
    sellerId: number,
    buyerId: number,
    bookId: number,
  ): Promise<ChatRoom> {
    const seller = await this.findUserById(sellerId);
    const buyer = await this.findUserById(buyerId);
    const book = await this.findBookById(bookId);

    let chatRoom = await this.chatRoomRepository.findOne({
      where: {
        seller: { id: seller.id },
        buyer: { id: buyer.id },
        book: { id: book.id },
      },
      relations: ['seller', 'buyer', 'book']
    });
  
    if (!chatRoom) {
      chatRoom = this.chatRoomRepository.create({
        seller: seller,
        buyer: buyer,
        book: book,
      });
      await this.chatRoomRepository.save(chatRoom);
    }
  
    return chatRoom;
  }
  

  async saveMessage(
    chatRoomId: number, 
    personId: number, 
    content: string
  ): Promise<Message> {
    const chatRoom = await this.chatRoomRepository.findOneBy({ id: chatRoomId });

    if (!chatRoom) {
      throw new Error(`ChatRoom with ID ${chatRoomId} not found`);
    }

    const person = await this.userRepository.findOneBy({ id: personId });

    if (!person) {
      throw new Error(`User with ID ${personId} not found`);
    }

    const message = this.messageRepository.create({
      chatRoom,
      person,
      content,
    });

    return await this.messageRepository.save(message);
  }

  async getChatRoomsForUser(userId: number) {
    const chatRooms = await this.chatRoomRepository.find({
      where: [
        { seller: { id: userId } },
        { buyer: { id: userId } },
      ],
      relations: ['messages', 'seller', 'buyer'],
    });

    return Promise.all(chatRooms.map(async (chatRoom) => {
      const recentMessage = chatRoom.messages.length
        ? chatRoom.messages[chatRoom.messages.length - 1].content
        : '';

      const otherPerson = chatRoom.seller.id === userId 
        ? chatRoom.buyer.name 
        : chatRoom.seller.name;
      
      return {
        id: chatRoom.id,
        otherPerson: otherPerson,
        updatedAt: chatRoom.updateAt.toLocaleString(),
        recentMessage: recentMessage,
      };
    }));
  }
}