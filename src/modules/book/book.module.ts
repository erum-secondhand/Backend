import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from 'modules/book/book.service';
import { BookController } from 'modules/book/book.controller';
import { S3Module } from 'config/s3/s3.module';
import { Book } from 'modules/book/entity/book.entity';
import { BookMapper } from 'modules/book/mapper/book.mapper';
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
