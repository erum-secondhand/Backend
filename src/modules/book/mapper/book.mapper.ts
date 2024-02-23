import { CreateBookDto } from '../dto/create-book.dto';
import { Book } from '../entity/book.entity';

export class BookMapper {
  DtoToEntity(dto: CreateBookDto): Book {
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

  EntityToDto(book: Book): CreateBookDto {
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
    };
  }
}
