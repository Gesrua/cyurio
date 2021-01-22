import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ExtensionService } from 'src/extension/extension.service';
import { ScanDirectoryDto } from './dto/scan-directory.dto';
import { RFile } from './rfile.entity';
import { promises as fs } from 'fs';
import { join } from 'path';
import Fuse from 'fuse.js';
import { SearchDto } from './dto/search.dto';

@Injectable()
export class CommonService {
  constructor(readonly databaseService: DatabaseService, private readonly extensionService: ExtensionService) { }
  async read(f: RFile) {
    return this.extensionService.getType(f.type).read(f);
  }
  async standardize(f: RFile) {
    return this.extensionService.getType(f.type).standardize(f);
  }
  async remove(f: RFile) {
    // TODO: props remove
    await this.extensionService.getType(f.type).remove(f);
    await this.databaseService.remove(f);
  }
  async isDuplicate(f1: RFile, f2: RFile) {
    if (f1._id == f2._id) return false;
    if (f1.type != f2.type) return false;
    return this.extensionService.getType(f1.type).isDuplicate(f1, f2);
  }
  async merge(f1: RFile, f2: RFile) {
    await this.extensionService.getType(f1.type).merge(f1, f2);
    await this.remove(f2);
    return f1;
  }

  async search(query: SearchDto) {
    const list = await this.databaseService.find(query.field);
    // console.log(list);
    const fuse = new Fuse(list, {
      keys: [query.key],
      includeScore: true,
      shouldSort: true,
    });
    return fuse.search(query.value);
  }

  async addFile(p: string) {
    const f: RFile = { path: p, title: '', type: '', metadata: {}, prop: {} };
    const type = await this.extensionService.getFileType(f);
    await type.create(f);

    // TODO: props create

    return this.databaseService.insert(f);
  }

  async scanDirectory(arg: ScanDirectoryDto) {
    const dir = await fs.opendir(arg.directory);
    const childs = [];
    for (let r = await dir.read(); r; r = await dir.read()) {
      const path = join(dir.path, r.name);
      if (r.isDirectory()) {
        if (arg.recursive) {
          await this.scanDirectory({ directory: path, recursive: arg.recursive });
        }
      } else if (r.isFile()) {
        await this.addFile(path);
      }
    }
    await dir.close();
    return childs;
  }

  async shrinkField(field) {
    const files = <RFile[]>(await this.databaseService.find(field));
    const removeIDs: string[] = [];
    // const n = files.length;
    // let i = 0;
    for(const file of files) {
      // console.log(i++, n);
      if (removeIDs.includes(file._id)) continue;
      let dups = await this.search({
        key: "title",
        value: file.title,
        field: { type: file.type }
      });
      dups = dups.filter((item) => item.score < 0.15)

      for(const dup of dups) {
        const b = <RFile>dup.item;

        if (await this.isDuplicate(file, b)) {
          // console.log("dup", file.title, b.title);
          removeIDs.push(b._id);
          await this.merge(file, b);
          await this.remove(b);
        }
      }
    }
    return removeIDs;
  }


  async runField(field, func) {
    const items = await this.databaseService.find(field);
    const response = [];
    for (const item of items) {      
      response.push(await func(item));
    }
    return response;
  }
  async runID(id: string, func) {
    const item = await this.databaseService.get(id);
    return func(item);
  }
  async runIDs(ids: string[], func) {
    const response = [];
    for(const id of ids) {
      response.push(await this.runID(id, func));
    }
    return response;
  }
}
