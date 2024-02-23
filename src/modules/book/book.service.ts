import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookDto } from './dto/book.dto';
import { BookMapper } from './mapper/book.mapper';
import { Book } from './entity/book.entity';
import { S3Service } from '../../config/s3/s3.service';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    private readonly bookMapper: BookMapper,

    private readonly s3Service: S3Service,
  ) {}

  async createBook(
    createBookDto: BookDto,
    image: Express.Multer.File,
  ): Promise<Book> {
    const newBookEntity = this.bookMapper.DtoToEntity(createBookDto);
    const imageUrl = await this.s3Service.uploadImage(image);
    newBookEntity.imageUrl = imageUrl;
    return this.bookRepository.save(newBookEntity);
  }

  async findAllBooks(): Promise<BookDto[]> {
    const books = this.bookRepository.find();
    return (await books).map((book) => this.bookMapper.EntityToDto(book));
  }
}
