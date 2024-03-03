import { SalesStatus } from '../entity/book.entity';

export class BookOverViewDto {
  id: number;
  imageUrls: string[];
  title: string;
  publisher: string;
  price: string;
  salesStatus: SalesStatus;
}
