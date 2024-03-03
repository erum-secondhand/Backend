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
    userId: number
  ): Promise<Book> {
    const newBookEntity = this.bookMapper.DtoToEntity(createBookDto);
    const imageUrls = await Promise.all(
      images.map((image) => this.s3Service.uploadImage(image)),
    );
    newBookEntity.imageUrlsArray = imageUrls;
    newBookEntity.salesStatus = '판매중';
    newBookEntity.userId = userId;
    return this.bookRepository.save(newBookEntity);
  }

  async getAllBooks(): Promise<BookOverViewDto[]> {
    const books = await this.bookRepository.find({
      where: { salesStatus: '판매중' },
      order: { createAt: 'DESC' },
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
      .andWhere('book.salesStatus = :status', { status: '판매중' })
      .orderBy('book.createAt', 'DESC')
      .getMany();

    return books.map((book) => this.bookMapper.EntityToOverViewDto(book));
  }

  async filterBooks(
    grade?: string,
    description?: string,
  ): Promise<BookOverViewDto[]> {
    const queryBuilder = this.bookRepository.createQueryBuilder('book').where('book.salesStatus = :status', { status: '판매중' });

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

  async updateBook(
    id: number,
    updateBookDto: BookDto,
    images?: Express.Multer.File[],
  ): Promise<BookDto> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (images && images.length > 0) {
      const imageUrls = await Promise.all(
        images.map((image) => this.s3Service.uploadImage(image)),
      );
      book.imageUrlsArray = imageUrls;
    } else if (updateBookDto.imageUrls) {
      book.imageUrlsArray = updateBookDto.imageUrls;
    }

    book.title = updateBookDto.title ?? book.title;
    book.publisher = updateBookDto.publisher ?? book.publisher;
    book.grade = updateBookDto.grade ?? book.grade;
    book.price = updateBookDto.price ?? book.price;
    book.description = updateBookDto.description ?? book.description;
    book.condition = updateBookDto.condition ?? book.condition;
    book.kakaoLink = updateBookDto.kakaoLink ?? book.kakaoLink;
    book.salesStatus = updateBookDto.salesStatus ?? book.salesStatus;

    const updatedBook = await this.bookRepository.save(book);
    return this.bookMapper.EntityToDto(updatedBook);
  }

  async getBooksByUser(userId: number): Promise<{
    onSaleBooks: { books: BookDto[] };
    soldOutBooks: { books: BookDto[] };
  }> {
    const books = await this.bookRepository.find({ where: { userId: userId } });
  
    const onSaleBooks = books
      .filter(book => book.salesStatus === '판매중')
      .map(book => this.bookMapper.EntityToDto(book));
  
    const soldOutBooks = books
      .filter(book => book.salesStatus === '판매완료')
      .map(book => this.bookMapper.EntityToDto(book));
  
    return {
      onSaleBooks: { books: onSaleBooks },
      soldOutBooks: { books: soldOutBooks },
    };
  }
}
