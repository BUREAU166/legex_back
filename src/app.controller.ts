import {Controller, Get, HttpException, HttpStatus, Post, Query, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {ApiBody, ApiConsumes, ApiQuery} from '@nestjs/swagger';
import {AppService} from './app.service';
import {FileUploadDto} from './dto/upload-file.dto';
import {ReqRows} from './dto/req-rows.dto';
import * as fs from "node:fs";
import * as path from "node:path";
import * as AdmZip from 'adm-zip';

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

  @Post('upload_project')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload_project(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    console.log("hey", file)
    var fname = file.originalname.substring(0, file.originalname.indexOf("."));
    const tempDir = path.join(__dirname, '../temp', fname);
    console.log("dir", tempDir)
    var cerateDir = fs.mkdirSync(tempDir, { recursive: true });
    console.log("DIR CREATE", cerateDir)

    const zip = new AdmZip(file.buffer);
    zip.extractAllTo(tempDir, true);

    const directoryStructure = await this.appService.buildDirectoryStructure(tempDir);

    //fs.rmSync(tempDir, { recursive: true, force: true });

    return directoryStructure;
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
