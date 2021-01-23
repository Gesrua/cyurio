import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommonService } from './common.service';
import { ScanDirectoryDto } from './dto/scan-directory.dto';
import { SearchDto } from './dto/search.dto';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('scan-directory')
  scanDirectory(@Body() scanDirectory: ScanDirectoryDto) {
    return this.commonService.scanDirectory(scanDirectory);
  }
  
  @Get('search')
  search(@Body() args: SearchDto) {
    return this.commonService.search(args);
  }

  @Get('shrink-field')
  shrinkField(@Body() field) {
    return this.commonService.shrinkField(field);
  }
}
