import { Injectable } from '@nestjs/common';
import { ChatRoom } from 'modules/chat/entity/chat-room.entity';
import { Book } from 'modules/book/entity/book.entity';
import { Message } from 'modules/chat/entity/chat.entity';
import { User } from 'modules/user/entity/user.entity';
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

  async findUserById(userId: number): Promise<Partial<User> | undefined> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword; // 비밀번호 제외
    }
    return undefined;
  }
  

  async findBookById(bookId: number): Promise<Book | undefined> {
    return this.bookRepository.findOneBy({ id: bookId });
  }

  async findOrCreateChatRoom(
    sellerId: number,
    buyerId: number,
    bookId: number,
  ): Promise<{ chatRoom: ChatRoom; messages: Message[] }> {
    const seller = await this.findUserById(sellerId);
    const buyer = await this.findUserById(buyerId);
    const book = await this.findBookById(bookId);

    let chatRoom = await this.chatRoomRepository.findOne({
      where: {
        seller: { id: sellerId },
        buyer: { id: buyerId },
        book: { id: bookId },
      },
      relations: ['seller', 'buyer', 'book'],
    });

    if (!chatRoom) {
      chatRoom = this.chatRoomRepository.create({
        seller: { ...seller, password: undefined }, // 비밀번호 제거
        buyer: { ...buyer, password: undefined },  // 비밀번호 제거
        book: book,
      });
      await this.chatRoomRepository.save(chatRoom);
    }
    
    // 이미 존재하는 경우에도 비밀번호를 제거
    chatRoom.seller.password = undefined;
    chatRoom.buyer.password = undefined;

    const messages = await this.messageRepository.find({
      where: { chatRoom: { id: chatRoom.id } },
      relations: ['person'],
      order: { createAt: 'ASC' },
    });

    return { chatRoom, messages };
  }

  async saveMessage(
    chatRoomId: number,
    personId: number,
    content: string,
  ): Promise<Message> {
    const chatRoom = await this.chatRoomRepository.findOneBy({
      id: chatRoomId,
    });

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
    const chatRooms = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .leftJoinAndSelect('chatRoom.seller', 'seller')
      .leftJoinAndSelect('chatRoom.buyer', 'buyer')
      .leftJoinAndSelect('chatRoom.book', 'book')
      .leftJoinAndSelect('chatRoom.messages', 'messages')
      .where('seller.id = :userId OR buyer.id = :userId', { userId })
      .orderBy('chatRoom.updateAt', 'DESC')
      .getMany();

      return Promise.all(
        chatRooms.map(async (chatRoom) => {
          const { password: sellerPassword, ...seller } = chatRoom.seller;
          const { password: buyerPassword, ...buyer } = chatRoom.buyer;
      
          const recentMessage = chatRoom.messages.length
            ? chatRoom.messages.reduce(
                (latest, message) =>
                  message.createAt > latest.createAt ? message : latest,
                chatRoom.messages[0],
              )
            : null;
      
          return {
            id: chatRoom.id,
            sellerId: seller.id,
            sellerName: seller.name,
            buyerId: buyer.id,
            buyerName: buyer.name,
            bookId: chatRoom.book.id,
            bookTitle: chatRoom.book.title,
            bookImage: chatRoom.book.imageUrlsArray.length > 0 
                  ? chatRoom.book.imageUrlsArray[0] 
                  : '',
            updatedAt: recentMessage
              ? recentMessage.createAt.toLocaleString()
              : chatRoom.updateAt.toLocaleString(),
            recentMessage: recentMessage ? recentMessage.content : '',
          };
        }),
      );      
  }
}
