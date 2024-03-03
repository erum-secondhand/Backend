import { BookDto } from '../dto/book.dto';
import { Book } from '../entity/book.entity';
import { BookOverViewDto } from '../dto/book-overview.dto';

export class BookMapper {
  DtoToEntity(dto: BookDto): Book {
    const book = new Book();

    book.imageUrlsArray = dto.imageUrls;
    book.title = dto.title;
    book.publisher = dto.publisher;
    book.grade = dto.grade;
    book.price = dto.price;
    book.description = dto.description;
    book.type = dto.type;
    book.condition = dto.condition;
    book.kakaoLink = dto.kakaoLink;
    book.salesStatus = dto.salesStatus;
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
      type: book.type,
      condition: book.condition,
      kakaoLink: book.kakaoLink,
      salesStatus: book.salesStatus,
      createAt: book.createAt,
      updateAt: book.updateAt,
      deleteAt: book.deleteAt,
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
