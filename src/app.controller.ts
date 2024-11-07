import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, HttpException, HttpStatus, StreamableFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { AppService } from './app.service';
import { FileUploadDto } from './dto/upload-file.dto';
import { ReqRows } from './dto/req-rows.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto
  })
  @UseInterceptors(FileInterceptor('file'))
  upload_file(@UploadedFile() file: Express.Multer.File) {
    console.log(file)
    this.appService.create(file.buffer)
  }

  @Get('analyze')
  @ApiQuery({ name: 'file_name', type: 'string' })
  @ApiQuery({ name: 'func_name', type: 'string' })
  analyze_file(@Query() query: ReqRows) {
    console.log("started analyzing")
    var content = this.appService.analyze(query.file_name, query.func_name)
    return content
  }
}
