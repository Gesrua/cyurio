import { IFile } from "src/file/ifile.interface";

export class Prop {
  private readonly extensionService;
  readonly name: string;
  constructor(extensionService) {
    this.extensionService = extensionService;
  }
  async isValid(f: IFile) {
    return true;
  }
  async run(method, ...args) {
    if (this[method]) return this[method](args);
  }
}