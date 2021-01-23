import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ExtensionService } from 'src/extension/extension.service';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [DatabaseService, ExtensionService],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {}
