import { RFile } from "src/file/rfile.entity";
import { promises as fs } from 'fs';
import { basename, extname } from "path";

export class Type {
  readonly type: string;
  readonly exts: string[];
  private readonly extensionService;

  constructor(extensionService) {
    this.extensionService = extensionService;
  }
  
  async isValid(f: RFile){
    return this.exts.includes(extname(f.path));
  }

  async read(f: RFile): Promise<any> {
    return fs.readFile(f.path);
  }

  async standardize(f: RFile) {
    return;
  }

  async create(f: RFile) {
    f.title = f.title || basename(f.path);
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