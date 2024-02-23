import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
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
    createBookDto: CreateBookDto,
    image: Express.Multer.File,
  ): Promise<Book> {
    const newBookEntity = this.bookMapper.DtoToEntity(createBookDto);
    const imageUrl = await this.s3Service.uploadImage(image);
    newBookEntity.imageUrl = imageUrl;
    return this.bookRepository.save(newBookEntity);
  }
}
