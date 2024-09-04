export class CreateChatRoomDto {
  id: number;
  bookId: number;
  sellerId: number;
  buyerId: number;
  updatedAt: Date;
  recentMessageContent: string;
}
