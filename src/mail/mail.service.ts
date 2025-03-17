import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor( private mailerService: MailerService ){}

  async sendEmail(to: string, subject: string, context: any, template: string){
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }
}
