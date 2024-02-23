import { Module } from '@nestjs/common';
import { BookModule } from './modules/book/book.module';
import { MysqlModule } from './config/mysql/mysql.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule, BookModule, MysqlModule],
})
export class AppModule {}
