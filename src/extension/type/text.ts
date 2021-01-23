import { RFile } from "src/file/rfile.entity";
import { promises as fs } from 'fs';
import { basename } from "path";
import { detect } from 'jschardet';
import { decode, encode } from 'iconv-lite';
import { compareTwoStrings } from 'string-similarity'
import { Type } from "./type";

export class Text extends Type {
  readonly type = 'text';
  readonly exts = ['.txt'];

  async read(f: RFile) {
    await this.standardize(f);
    const buffer = await fs.readFile(f.path);
    const encoding = detect(buffer).encoding;
    return decode(buffer, encoding);
  }

  async standardize(f: RFile) {
    const content = await this.read(f);
    await fs.writeFile(f.path, encode(content, 'UTF-8'));
  }

  async create(f: RFile) {
    f.title = basename(f.path, '.txt');
  }

  async isDuplicate(f1: RFile, f2: RFile) {
    if (f1.title === f2.title) return true;
    const c1 = await this.read(f1), c2 = await this.read(f2);
    const similarity = compareTwoStrings(c1.slice(0, 2000), c2.slice(0, 2000));
    return similarity > 0.5;
  }
}