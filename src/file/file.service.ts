import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ExtensionService } from 'src/extension/extension.service';
import { IFile } from './ifile.interface';
import { RFile } from './rfile.entity';

@Injectable()
export class FileService {
  constructor(readonly databaseService: DatabaseService, private readonly extensionService: ExtensionService) { }
  async create(f: IFile) {
    f.title = f.title || ''
    f.path = f.path || ''
    f.metadata = f.metadata || {}
    f.props = f.props || []
    const type  = await this.extensionService.getFileType(f);
    f.type = type.type;
    const rf = f as RFile;

    await type.create(rf);

    const props = await this.extensionService.getFileProps(rf);
    rf.props = rf.props.concat(props.map(prop => prop.name));
    await this.extensionService.runProps('create', rf);
  
    return this.databaseService.insert(rf);
  }
  async read(f: RFile) {
    await this.extensionService.runProps('read', f);
    return this.extensionService.getType(f.type).read(f);
  }
  async update(f: IFile) {
    if (!f._id) return new BadRequestException('_id required');
    return this.databaseService.db.update({'_id': f._id}, f);
  }
  async standardize(f: RFile) {
    await this.extensionService.runProps('standardize', f);
    return this.extensionService.getType(f.type).standardize(f);
  }
  async remove(f: RFile) {
    await this.extensionService.runProps('remove', f);
    await this.extensionService.getType(f.type).remove(f);
    await this.databaseService.remove(f);
  }
  async merge(f1: RFile, f2: RFile) {
    await this.extensionService.runProps('merge', f1, f2);
    await this.extensionService.getType(f1.type).merge(f1, f2);
    await this.remove(f2);
    return f1;
  }
  async duplicate(f1: RFile, f2: RFile) {
    if (f1._id == f2._id) return false;
    if (f1.type != f2.type) return false;
    return this.extensionService.getType(f1.type).isDuplicate(f1, f2);
  }
}
