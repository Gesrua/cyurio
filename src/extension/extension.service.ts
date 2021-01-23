import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Text } from './type/text';
import { Type } from './type/type';
import { IFile } from 'src/file/ifile.interface';

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

  async getFileType(f: IFile): Promise<Type> {
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
