import { Module } from '@nestjs/common';
import { BookModule } from 'modules/book/book.module';
import { MysqlModule } from 'config/mysql/mysql.module';
import { UserModule } from 'modules/user/user.module';
import { ChatModule } from 'modules/chat/chat.module';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';

@Module({
  imports: [UserModule, BookModule, ChatModule, MysqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
