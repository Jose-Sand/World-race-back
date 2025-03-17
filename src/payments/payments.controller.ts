import { Controller, Get, Post, Body, Patch, Param, Delete, Req, RawBodyRequest, StreamableFile, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Auth } from 'src/auth/decorators';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Auth()
  create(@Body() createPaymentDto: CreatePaymentDto, @GetUser('id') userId: string) {
    return this.paymentsService.create(createPaymentDto, userId);
  }

  @Post('webhook')
  webhookResponse(@Req() request: RawBodyRequest<Request>) {
    return this.paymentsService.webhookResponse({request});
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('pdf/:paymentId')
  @Auth()
  async getPdf(@Req() request: Request, @Param('paymentId') paymentId: string, @Res() res){
    const pdf = await this.paymentsService.generatePaymentPdf(paymentId, request.headers['x-utc'] as string);
    res.set({
      // pdf
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=pdf.pdf`,
      'Content-Length': pdf.length,
      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
  });
  res.end(pdf);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
