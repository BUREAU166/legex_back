import { Injectable } from '@nestjs/common';
import { cp, readFile, readFileSync, writeFile } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process'

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
}
