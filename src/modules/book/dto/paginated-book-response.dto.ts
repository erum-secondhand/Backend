import { BookOverViewDto } from './book-overview.dto';

export interface PaginatedBooksResponse {
  data: BookOverViewDto[];
  pageNum: number;
  pageSize: number;
  total: number;
}
