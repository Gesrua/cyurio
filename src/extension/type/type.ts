import { RFile } from "src/common/rfile.entity";
import { promises as fs } from 'fs';
import { basename, extname } from "path";

export class Type {
  readonly type: string;
  readonly exts: string[];
  private readonly ctx;

  constructor(ctx) {
    this.ctx = ctx;
  }
  
  async isValid(f: RFile){
    return this.exts.includes(extname(f.path));
  }

  async read(f: RFile): Promise<any> {
    return fs.readFile(f.path);
  }

  async unify(f: RFile) {
    return;
  }

  async create(f: RFile) {
    f.title = basename(f.path);
  }

  async remove(f: RFile) {
    return;
  }

  async isDuplicate(f1: RFile, f2: RFile) {
    return basename(f1.path) === basename(f2.path);
  }

  async merge(f1: RFile, f2: RFile) {
    return;
  }
}