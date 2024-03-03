import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Get,
  Put,
  Res,
  UploadedFiles,
  UseInterceptors,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { BookDto } from './dto/book.dto';
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
  @UseInterceptors(FilesInterceptor('images'))
  async createBook(
    @Body() createBookDto: BookDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Res() res: Response,
  ): Promise<void> {
    try {
      const newBook = await this.bookService.createBook(createBookDto, images);
      const response = this.bookMapper.EntityToDto(newBook);
      res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Get()
  async getAllBooks(@Res() res: Response) {
    const books = await this.bookService.getAllBooks();
    res.status(HttpStatus.OK).json(books);
  }

  @Get('/detail/:id')
  async getDetailBooks(@Param('id') id: number, @Res() res: Response) {
    const book = await this.bookService.getBookDetail(id);
    res.status(HttpStatus.OK).json(book);
  }

  @Get('/search')
  async searchBooks(@Query('title') title: string, @Res() res: Response) {
    const books = await this.bookService.searchBooksByTitle(title);
    res.status(HttpStatus.OK).json(books);
  }

  @Get('/filter')
  async filterBooks(
    @Query('grade') grade: string,
    @Query('description') description: string,
    @Res() res: Response,
  ) {
    const filteredBooks = await this.bookService.filterBooks(
      grade,
      description,
    );
    res.status(HttpStatus.OK).json(filteredBooks);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async updateBook(
    @Param('id') id: number,
    @Body() updateBookDto: BookDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Res() res: Response,
  ): Promise<void> {
    try {
      const updatedBook = await this.bookService.updateBook(
        id,
        updateBookDto,
        images,
      );
      res.status(HttpStatus.OK).json(updatedBook);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Get('/:userId')
  async getBooksByUser(@Param('userId') userId: number, @Res() res: Response) {
    try {
      const books = await this.bookService.getBooksByUser(userId);
      res.status(HttpStatus.OK).json(books);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
