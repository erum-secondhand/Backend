import { Message } from "../entity/chat.entity";
import { User } from "../../user/entity/user.entity";
import { Book } from "../../book/entity/book.entity";

export class CreateChatRoomDto {
    id: number;
    bookId: number;
    sellerId: number;
    buyerId: number;
    updatedAt: Date;
    recentMessageContent: string;
}