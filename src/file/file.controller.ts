import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RangeDTO } from 'src/database/range.dto';
import { FileService } from './file.service';
import { IFile } from './ifile.interface';
import { RFile } from './rfile.entity';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService, private readonly databaseService: DatabaseService) {}
  
  @Get('get')
  query(@Body() range: RangeDTO) {
    return this.databaseService.rangeHandler(range, this.databaseService.get.bind(this.databaseService));
  }
  @Post('create')
  create(@Body() f: IFile) {
    return this.fileService.create(f);
  }
  @Get('read')
  read(@Body() range: RangeDTO) {
    return this.databaseService.rangeHandler(range, this.fileService.read.bind(this.fileService))
  }
  @Put('update')
  update(@Body() range: RangeDTO) {
    return this.databaseService.rangeHandler(range, this.fileService.update.bind(this.fileService));
  }
  @Put('standardize')
  standardize(@Body() range: RangeDTO) {
    return this.databaseService.rangeHandler(range, this.fileService.standardize.bind(this.fileService));
  }
  @Delete('remove')
  remove(@Body() range: RangeDTO) {
    return this.databaseService.rangeHandler(range, this.fileService.remove.bind(this.fileService));
  }
  @Put('merge')
  async merge(@Body('id1') id1: string, @Body('id2') id2: string) {
    return this.fileService.merge(await this.databaseService.get(id1) as RFile, await this.databaseService.get(id2) as RFile);
  }
  @Put('duplicate')
  async duplicate(@Body('id1') id1: string, @Body('id2') id2: string) {
    return this.fileService.duplicate(await this.databaseService.get(id1) as RFile, await this.databaseService.get(id2) as RFile);
  }
}
