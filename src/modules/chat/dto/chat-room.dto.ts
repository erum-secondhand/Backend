// chat-room.dto.ts
import { Expose, Transform } from 'class-transformer';

export class ChatRoomDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ value }) => ({
    id: value.id,
    title: value.title,
    imageUrls: value.imageUrlsArray,
    price: value.price,
  }))
  book: {
    id: number;
    title: string;
    imageUrls: string[];
    price: string;
  };

  @Expose()
  @Transform(({ value }) => ({
    id: value.id,
    name: value.name,
    email: value.email,
    major: value.major,
  }))
  seller: {
    id: number;
    name: string;
    email: string;
    major: string;
  };

  @Expose()
  @Transform(({ value }) => ({
    id: value.id,
    name: value.name,
    email: value.email,
    major: value.major,
  }))
  buyer: {
    id: number;
    name: string;
    email: string;
    major: string;
  };

  @Expose()
  @Transform(({ value }) =>
    value.map((message) => ({
      id: message.id,
      content: message.content,
      senderId: message.person.id, // 메시지 보낸 사람 정보
      createdAt: message.createdAt,
    })),
  )
  recentMessageContent: {
    id: number;
    content: string;
    senderId: number;
    createdAt: Date;
  }[];

  @Expose()
  updatedAt: Date;
}
