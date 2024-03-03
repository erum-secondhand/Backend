import { BookDto } from '../dto/book.dto';
import { Book } from '../entity/book.entity';
import { BookOverViewDto } from '../dto/book-overview.dto';
import { SalesStatus } from '../entity/book.entity';

export class BookMapper {
  DtoToEntity(dto: BookDto): Book {
    const book = new Book();

    book.imageUrlsArray = dto.imageUrls;
    book.title = dto.title;
    book.publisher = dto.publisher;
    book.grade = dto.grade;
    book.price = dto.price;
    book.description = dto.description;
    book.condition = dto.condition;
    book.kakaoLink = dto.kakaoLink;
    book.salesStatus = dto.salesStatus ?? SalesStatus.ON_SALE;
    return book;
  }

  EntityToDto(book: Book): BookDto {
    return {
      id: book.id,
      imageUrls: book.imageUrlsArray,
      title: book.title,
      publisher: book.publisher,
      grade: book.grade,
      price: book.price,
      description: book.description,
      condition: book.condition,
      kakaoLink: book.kakaoLink,
      salesStatus: book.salesStatus,
      createAt: book.createAt,
    };
  }

  EntityToOverViewDto(book: Book): BookOverViewDto {
    return {
      id: book.id,
      imageUrls: book.imageUrlsArray,
      title: book.title,
      publisher: book.publisher,
      price: book.price,
      salesStatus: book.salesStatus,
    };
  }
}
