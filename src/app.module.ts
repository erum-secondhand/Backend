import { Module } from '@nestjs/common';
import { BookModule } from './modules/book/book.module';
import { MysqlModule } from './config/mysql/mysql.module';

@Module({
  imports: [BookModule, MysqlModule],
})
export class AppModule {}
