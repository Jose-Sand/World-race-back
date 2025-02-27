import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripeStrategy } from './strategies/stripe.strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Country } from 'src/countries/entities/country.entity';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Payment, Country]),
  ]
})
export class PaymentsModule {}
