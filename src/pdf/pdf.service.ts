import { Injectable } from '@nestjs/common';
import { createPdf } from '@saemhco/nestjs-html-pdf';
import * as path from 'path';

@Injectable()
export class PdfService {

  async generatePdf(options: any, data: any = {}){
    const filePath = path.join(process.cwd(), 'templates', 'donation.hbs');
    return createPdf(filePath, options, data)
  }
}
