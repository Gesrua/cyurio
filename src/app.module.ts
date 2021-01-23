import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { ExtensionModule } from './extension/extension.module';
import { DatabaseModule } from './database/database.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [CommonModule, ExtensionModule, DatabaseModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
