import { BadRequestException, Injectable } from '@nestjs/common';
import { createWriteStream, existsSync, unlink } from 'fs';
import { join } from 'path';

@Injectable()
export class CommonService {
  handleError(error: any) {
    console.log('error', error);
    if (error.detail) {
      throw new BadRequestException(error.detail);
    }
    throw new BadRequestException('Error');
  }

  getFile(
    fileName = '',
    path = join(__dirname, '../../../uploads/audios', fileName),
  ) {
    if (!existsSync(path))
      throw new BadRequestException(`No file : ${fileName} was founded`);

    return path;
  }

  writeFileOnLocalMachine(path: string, file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      const write = createWriteStream(path);
      write.write(file.buffer);
      write.on('error', function (err) {
        reject(err);
      });
      write.on('ready', function () {
        resolve(true);
      });
    });
  }

  deleteFileOnLocalMachine(path: string) {
    return new Promise((resolve, reject) => {
      unlink(path, (err) => {
        if (err) return reject(err);
        resolve(true);
      });
    });
  }
}
