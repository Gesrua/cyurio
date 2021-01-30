import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Text } from './type/text';
import { Type } from './type/type';
import { IFile } from 'src/file/ifile.interface';
import { Prop } from './prop/prop';
import { RFile } from 'src/file/rfile.entity';

@Injectable()
export class ExtensionService {
  readonly types: Type[];
  readonly fallbackType: Type;
  readonly props: Prop[];

  constructor(private readonly databaseService: DatabaseService) {
    const types:Type[] = [new Text(this)];
    for(const type of types) {
      this.types[type.type] = type;
    }
    this.fallbackType = new Type(this);

    const props:Prop[] = [];
    for(const prop of props) {
      this.props[prop.name] = prop;
    }
  }

  async getFileType(f: IFile): Promise<Type> {
    for(const type of this.types) {
      if (await type.isValid(f)) {
        return type;
      }
    }
    return this.fallbackType;
  }
  getType(type: string): Type {
    return this.types[type];
  }

  async getFileProps(f: IFile): Promise<Prop[]> {
    const res = [];
    for(const prop of this.props) {
      if (await prop.isValid(f)) {
        res.push(prop);
      }
    }
    return res;
  }
  getProp(prop: string): Prop {
    return this.props[prop];
  }
  async runProps(method, f: RFile, ...args) {
    for(const prop of f.props) {
      await this.getProp[prop].run(method, f, args);
    }
  }
}
