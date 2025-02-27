import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { StripeStrategy } from './strategies/stripe.strategy';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { Country } from 'src/countries/entities/country.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly stripeStrategy: StripeStrategy
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
    })
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

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
