import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ExtensionService } from './extension.service';

@Module({
  imports: [DatabaseService],
  providers: [ExtensionService],
  exports: [ExtensionService]
})
export class ExtensionModule {}
