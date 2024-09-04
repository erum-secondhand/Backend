import { BookOverViewDto } from 'modules/book/dto/book-overview.dto';

export interface PaginatedBooksResponse {
  data: BookOverViewDto[];
  pageNum: number;
  pageSize: number;
  total: number;
}
