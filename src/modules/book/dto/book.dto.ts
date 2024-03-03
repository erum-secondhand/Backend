import { SalesStatus } from '../entity/book.entity';

export class BookDto {
  id: number;
  imageUrls: string[];
  title: string;
  publisher: string;
  grade: string;
  price: string;
  description: string;
  condition: string;
  kakaoLink: string;
  salesStatus?: SalesStatus;
  createAt: Date;
}
