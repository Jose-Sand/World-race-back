import { Injectable, Logger, RawBodyRequest } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { StripeStrategy } from './strategies/stripe.strategy';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { Country } from 'src/countries/entities/country.entity';
import { Request } from 'express';
import { PaymentGateway } from './payment.gateway';
import { PdfService } from 'src/pdf/pdf.service';
import { DateTime } from 'luxon';
import { DATE_FORMAT } from 'src/common/constant/dateFormat.constant';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly stripeStrategy: StripeStrategy,
    private readonly paymentGateway: PaymentGateway,
    private readonly pdfService: PdfService,
  ){}
  async create(createPaymentDto: CreatePaymentDto, userId: string) {
    let payment = this.paymentRepository.create({
      amount: createPaymentDto.unit_amount,
      currency: createPaymentDto.currency,
      user: {
        id: userId
      }
    })
    await this.paymentRepository.save(payment);
    let country: Country = null;
    if(createPaymentDto?.country){
      country = await this.countryRepository.findOneBy({ id: +createPaymentDto.country });
    }
    const price = await this.stripeStrategy.createPrice({...createPaymentDto, country: country?.name || 'Global'});
    const session = await this.stripeStrategy.createSession({
      priceId: price.id,
      quantity: 1,
      mode: 'payment',
    }, payment.id)
    await this.paymentRepository.update(payment.id, {
      stripePriceId: price.id,
      stripeSessionId: session.id,
      country,
    })
    return {
      ...payment,
      stripePriceId: price.id,
      stripeSessionId: session.id,
    };
  }

  async webhookResponse(data: {request: RawBodyRequest<Request>}) {
    const event = await this.stripeStrategy.constructEventWebhook(data.request);
    this.logger.debug('event', event);
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSessionComplete = event.data.object;
        // Then define and call a function to handle the event checkout.session.async_payment_failed
        const statusPaymentIntent = await this.stripeStrategy.statusPaymentIntent(checkoutSessionComplete.payment_intent.toString());
        this.logger.debug('statusPaymentIntent', statusPaymentIntent);
        if(statusPaymentIntent === 'succeeded'){
          await this.successPayment(checkoutSessionComplete.id);
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return {
      status: 'success',
      message: 'Webhook received'
    }
  }

  async successPayment(sessionId: string){
    const payment = await this.findBySessionId(sessionId);
    if(payment){
      if(payment?.status === 'approved')
        return
      //* update payment status
      await this.paymentRepository.update(payment.id, {
        status: 'approved'
      })
      //* update country amount
      const country = await this.countryRepository.findOneBy({id: payment.country.id});
      await this.countryRepository.update(country.id, {
        amount: Number(country.amount) + Number(payment.amount)
      })
      //* emit to frontend
      this.paymentGateway.sendDataToReload();
      return {
        status: 'approved',
        message: 'Payment approved'
      }
    }
  }

  async generatePaymentPdf(paymentId: string, utc: string = ''){
    const payment = await this.findOne(paymentId);
    let pdf = null;
    if(payment){
      const data = {
        name: payment.user.name,
        lastName: payment.user.lastName,
        amount: payment.amount,
        country: payment.country.name,
        createdAt: utc ?
        DateTime.fromJSDate(payment.createdAt, {zone: 'utc'}).setZone(utc).toFormat(DATE_FORMAT.format1)
        : DateTime.fromJSDate(payment.createdAt, {zone: 'utc'}).toFormat(DATE_FORMAT.format1),
      };
      pdf = await this.pdfService.generatePdf({
        format: 'letter',
        printBackground: true,
        landscape: true,
        margin: {
            left: '0mm',
            top: '0mm',
            right: '0mm',
            bottom: '0mm',
        },
      }, data);
    }
    return pdf;
  }

  findBySessionId(sessionId: string){
    return this.paymentRepository.findOne({
      where: {stripeSessionId: sessionId},
      relations: ['country']
    });
  }

  findAll() {
    this.paymentGateway.sendDataToReload();
  }

  findOne(id: string) {
    return this.paymentRepository.findOne({
      where: {id},
      relations: ['country', 'user']
    });
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
