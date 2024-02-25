import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookDto } from './dto/book.dto';
import { BookMapper } from './mapper/book.mapper';
import { Book } from './entity/book.entity';
import { S3Service } from '../../config/s3/s3.service';
import { BookOverViewDto } from './dto/book-overview.dto';

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
    images: Express.Multer.File[],
  ): Promise<Book> {
    const newBookEntity = this.bookMapper.DtoToEntity(createBookDto);
    const imageUrls = await Promise.all(
      images.map((image) => this.s3Service.uploadImage(image)),
    );
    newBookEntity.imageUrlsArray = imageUrls;
    return this.bookRepository.save(newBookEntity);
  }

  async getAllBooks(): Promise<BookOverViewDto[]> {
    const books = await this.bookRepository.find({
      order: {
        createAt: 'DESC',
      },
    });
    return books.map((book) => this.bookMapper.EntityToOverViewDto(book));
  }

  async getBookDetail(id: number): Promise<BookDto> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return this.bookMapper.EntityToDto(book);
  }

  async searchBooksByTitle(title: string): Promise<BookOverViewDto[]> {
    const books = await this.bookRepository
      .createQueryBuilder('book')
      .where('book.title LIKE :title', { title: `%${title}%` })
      .orderBy('book.createAt', 'DESC')
      .getMany();

    return books.map((book) => this.bookMapper.EntityToOverViewDto(book));
  }

  async filterBooks(
    grade?: string,
    description?: string,
  ): Promise<BookOverViewDto[]> {
    const queryBuilder = this.bookRepository.createQueryBuilder('book');

    if (grade) {
      queryBuilder.andWhere('book.grade = :grade', { grade });
    }

    if (description) {
      queryBuilder.andWhere('book.description = :description', { description });
    }

    queryBuilder.orderBy('book.createAt', 'DESC');

    const books = await queryBuilder.getMany();
    return books.map((book) => this.bookMapper.EntityToOverViewDto(book));
  }
}
