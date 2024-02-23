import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { S3Module } from '../../config/s3/s3.module';
import { Book } from './entity/book.entity';
import { BookMapper } from './mapper/book.mapper';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    S3Module,
    MulterModule.register(),
  ],
  controllers: [BookController],
  providers: [BookService, BookMapper],
})
export class BookModule {}
