import { Injectable } from '@nestjs/common';
import { RFile } from 'src/file/rfile.entity';
import { DatabaseService } from 'src/database/database.service';
import { Text } from './type/text';
import { Type } from './type/type';

@Injectable()
export class ExtensionService {
  readonly types;
  readonly fallbackType: Type;
  readonly props;
  readonly fallbackProps: Type;

  constructor(private readonly databaseService: DatabaseService) {
    const types = [new Text(this)];
    for(const type of types) {
      this.types[type.type] = type;
    }
    this.fallbackType = new Type(this);
  }

  async getFileType(f: RFile): Promise<Type> {
    for(const type of this.types) {
      if (await type.isValid(f)) {
        return type;
      }
    }
    return this.fallbackType;
  }

  getType(type: string): Type{
    return this.types[type];
  }
}
