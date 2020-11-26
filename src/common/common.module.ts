import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ExtensionService } from 'src/extension/extension.service';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';


@Module({
  imports: [DatabaseService, ExtensionService],
  providers: [CommonService],
  controllers: [CommonController],
})
export class CommonModule {}
