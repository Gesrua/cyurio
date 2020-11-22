import { Module } from '@nestjs/common';
import { RFile } from 'src/common/rfile.entity';
import { DatabaseService } from 'src/database/database.service';
import { ExtensionService } from './extension.service';
import { Text } from './type/text';
import { Type } from './type/type';

@Module({
  imports: [DatabaseService],
  providers: [ExtensionService]
})
export class ExtensionModule {
  readonly types;
  readonly fallbackType: Type;
  readonly props;
  readonly fallbackProps: Type;

  constructor(private readonly databaseService: DatabaseService) {
    const types = [new Text(databaseService)];
    for(const type of types) {
      this.types[type.type] = type;
    }
  }

  async getType(f: RFile) {
    for(const type of this.types) {
      if (await type.isValid(f)) {
        return type;
      }
    }
    return this.fallbackType;
  }
}
