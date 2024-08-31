import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Book } from '../../book/entity/book.entity';
import { User } from '../../user/entity/user.entity';
import { Message } from './chat.entity';
import { BaseEntity } from '../../../global/common/base.entity';

@Entity()
export class ChatRoom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, { nullable: false })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'sellerId' })
  seller: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'buyerId' })
  buyer: User;

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[];
}