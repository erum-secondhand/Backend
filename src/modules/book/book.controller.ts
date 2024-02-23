import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Express } from 'express';
import { CreateBookDto } from './dto/create-book.dto';
import { BookService } from './book.service';
import { BookMapper } from './mapper/book.mapper';

@Controller('books')
export class BookController {
  private readonly logger = new Logger(BookController.name);

  constructor(
    private readonly bookService: BookService,
    private readonly bookMapper: BookMapper,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createBook(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`Creating a new book with title: ${createBookDto.title}`);

    try {
      const newBook = await this.bookService.createBook(createBookDto, image);
      const response = this.bookMapper.EntityToDto(newBook);

      this.logger.log(`New book created with ID: ${newBook.id}`);
      res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      this.logger.error(`Error while creating book: ${error.message}`);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
