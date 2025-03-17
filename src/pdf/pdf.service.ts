import { Injectable } from '@nestjs/common';
import { createPdf } from '@luism27/nestjs-html-pdf';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PdfService {

  constructor(private readonly configService: ConfigService) {}
  async generatePdf(options: any, data: any = {}){
    const filePath = path.join(process.cwd(), 'templates', 'donation.hbs');
    return createPdf(filePath, options, data, {
      ...this.configService.get('NODE_ENV') === 'production' ? {
        executablePath: '/usr/bin/google-chrome-stable',
      }: {},
      headless: 'shell',
      args: ['--enable-gpu', '--no-sandbox'],
    })
  }
}
