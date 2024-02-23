import { BookDto } from '../dto/book.dto';
import { Book } from '../entity/book.entity';
import { BookOverViewDto } from '../dto/book-overview.dto';

export class BookMapper {
  DtoToEntity(dto: BookDto): Book {
    const book = new Book();

    book.imageUrl = dto.imageUrl;
    book.title = dto.title;
    book.publisher = dto.publisher;
    book.grade = dto.grade;
    book.price = dto.price;
    book.description = dto.description;
    book.condition = dto.condition;
    book.kakaoLink = dto.kakaoLink;
    return book;
  }

  EntityToDto(book: Book): BookDto {
    return {
      id: book.id,
      imageUrl: book.imageUrl,
      title: book.title,
      publisher: book.publisher,
      grade: book.grade,
      price: book.price,
      description: book.description,
      condition: book.condition,
      kakaoLink: book.kakaoLink,
      createAt: book.createAt,
    };
  }

  EntityToOverViewDto(book: Book): BookOverViewDto {
    return {
      id: book.id,
      imageUrl: book.imageUrl,
      title: book.title,
      publisher: book.publisher,
      price: book.price,
    };
  }
}
