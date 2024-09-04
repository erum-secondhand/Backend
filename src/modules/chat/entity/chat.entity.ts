import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChatRoom } from 'modules/chat/entity/chat-room.entity';
import { User } from 'modules/user/entity/user.entity';
import { BaseEntity } from '@global/common/base.entity';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages, {
    nullable: false,
  })
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoom;

  @ManyToOne(() => User, { nullable: false })
  person: User;

  @Column('text')
  content: string;
}
