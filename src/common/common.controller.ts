import { BadRequestException, Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommonService } from './common.service';
import { RangeDTO } from './dto/range.dto';
import { RFileDto } from './dto/rfile.dto';
import { ScanDirectoryDto } from './dto/scan-directory.dto';
import { SearchDto } from './dto/search.dto';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}
  
  @Post('addFile')
  addFile(@Body() f: RFileDto) {
    return this.commonService.addFile(f.path);
  }

  @Post('scan-directory')
  scanDirectory(@Body() scanDirectory: ScanDirectoryDto) {
    return this.commonService.scanDirectory(scanDirectory);
  }

  @Delete('remove')
  remove(@Body() args: RangeDTO) {
    return this.rangeHandler(args, this.commonService.remove.bind(this.commonService));
  }

  @Put('standardize')
  standardize(@Body() args: RangeDTO) {
    return this.rangeHandler(args, this.commonService.standardize.bind(this.commonService));
  }

  @Get('query')
  query(@Body() args: RangeDTO) {
    return this.rangeHandler(args, this.commonService.databaseService.get.bind(this.commonService.databaseService));
  }
  
  @Get('search')
  search(@Body() args: SearchDto) {
    return this.commonService.search(args);
  }

  @Get('shrink-field')
  shrinkField(@Body() field) {
    return this.commonService.shrinkField(field);
  }

  rangeHandler(args: RangeDTO, func) {
    if (args.id) {
      if (args.ids || args.field) throw new BadRequestException();
      return this.commonService.runID(args.id, func);
    }
    if (args.ids) {
      if (args.id || args.field) throw new BadRequestException();
      return this.commonService.runIDs(args.ids, func);
    }
    if (args.field) {
      if (args.id || args.ids) throw new BadRequestException();
      return this.commonService.runField(args.field, func);
    }
  }
}
