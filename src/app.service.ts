import { Injectable } from '@nestjs/common';
import { cp, readFile, readFileSync, writeFile, promises } from 'fs';
import { extname, join } from 'path';
import { spawn } from 'child_process'
import fs from "fs";
import path from "path";

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Сохранить новый cpp файл в хранилище
   * @param cpp_buff 
  */
  create(cpp_buff: Buffer) {
    var path = join(__dirname, "..", "data", "file.cc");
    writeFile(path , cpp_buff, {
      flag: 'w+'
    } , (err) => {
      if(err) {
        throw new Error(err.message)
      }
    });    
  }

  /**
   * 
   * @param funcName 
   */
  analyze(fileName: string, funcName: string) {
    var localdir = join(__dirname, '..', '..', 'ast_builer/build/ast');
    console.log("path ", localdir)
    var arg1 = './data/' + fileName
    var arg2 = funcName
    const comp = spawn(localdir, [arg1, arg2]);
    comp.stdout.on('data', (data) => {
      // BrowserWindow.getFocusedWindow().webContents.send("compOut", data);
      // var error_browser = BrowserWindow.getFocusedWindow().getD document.getElementById('error_container');
      // error_browser.innerText = "";
      // error_browser.innerText = data;
      console.log('spawned', data.toString());
    })
    comp.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    comp.on('close', (code) => {
      if(code == 0) {
        console.log("ENDED PROCESS");
      }
      console.log(`child process exited with code ${code}`);
    })

    // yard_comp.on('close', (code) => {
    //   if(code == 0)
    //   {
    //     var localdir = path.join(__dirname, '..', '..', '../yard/test/new.pdf');
    //     console.log(" LOCAL PDF DIR ", localdir);
    //     BrowserWindow.getFocusedWindow().webContents.send("fileText", localdir);
    //     // fs.readFile(localdir, (error, data) => {
    //     //   // Do something with file contents
    //     //   // console.log("in main read file:", data.toString())
    //     //   // Send result back to renderer process
          
    //     // });
    //   }
    //   // console.log(`child process exited with code ${code}`);
    // }); 
  }

  async buildDirectoryStructure(dirPath: string): Promise<any> {
    const structure: any = {};
    const files = await promises.readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
      const fullPath = join(dirPath, file.name);

      if (file.isDirectory()) { 
        const subDirStructure = await this.buildDirectoryStructure(fullPath);
        if (Object.keys(subDirStructure).length > 0) {
          structure[file.name] = subDirStructure;
        }
      } else if (this.isCppFile(file.name)) {
        structure[file.name] = null;
      }
    }

    return structure;
  }

  private isCppFile(fileName: string): boolean {
    const cppExtensions = ['.c', '.cpp', '.h', '.hpp', '.cc'];
    return cppExtensions.includes(extname(fileName).toLowerCase());
  }
}
