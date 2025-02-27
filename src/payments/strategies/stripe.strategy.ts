import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { COMMON_CONSTANT } from "src/common/constant/common.constant";
import { Prices, Session } from "src/common/types/payment";
import Stripe from "stripe";


@Injectable()
export class StripeStrategy {
  stripe: Stripe;
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'));
  }

  createPrice(data: Prices){
    return this.stripe.prices.create({
      currency: data.currency,
      unit_amount: data.unit_amount * 100,
      product_data: {
        name: `${COMMON_CONSTANT.productBase} (${data.country})`
      }
    })
  }

  createSession(data: Session) {
    return this.stripe.checkout.sessions.create({
      success_url: 'https://example.com/success',
      line_items: [
        {
          price: data.priceId,
          quantity: data.quantity,
        },
      ],
      mode: data.mode,
    });
  }
}
