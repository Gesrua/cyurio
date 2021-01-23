import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ScanDirectoryDto } from './dto/scan-directory.dto';
import { RFile } from '../file/rfile.entity';
import { promises as fs } from 'fs';
import { join } from 'path';
import Fuse from 'fuse.js';
import { SearchDto } from './dto/search.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class CommonService {
  constructor(readonly databaseService: DatabaseService, private readonly fileService: FileService) { }

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
        await this.fileService.create({'path': path});
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

        if (await this.fileService.duplicate(file, b)) {
          // console.log("dup", file.title, b.title);
          removeIDs.push(b._id);
          await this.fileService.merge(file, b);
          await this.fileService.remove(b);
        }
      }
    }
    return removeIDs;
  }
}
