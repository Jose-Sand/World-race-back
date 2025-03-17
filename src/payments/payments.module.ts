import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripeStrategy } from './strategies/stripe.strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Country } from 'src/countries/entities/country.entity';
import { PaymentGateway } from './payment.gateway';
import { PdfModule } from 'src/pdf/pdf.module';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeStrategy, PaymentGateway],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Payment, Country]),
    PdfModule,
  ]
})
export class PaymentsModule {}
