import { Injectable, RawBodyRequest } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { COMMON_CONSTANT } from "src/common/constant/common.constant";
import { Prices, Session } from "src/common/types/payment";
import Stripe from "stripe";
import { buffer } from 'micro';


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

  createSession(data: Session, paymentId: string) {
    return this.stripe.checkout.sessions.create({
      success_url: `${this.configService.get('WORLD_RACE_BASE_URL')}/success/${paymentId}`,
      payment_method_types: ['card'],
      submit_type: 'donate',
      line_items: [
        {
          price: data.priceId,
          quantity: data.quantity,
        },
      ],
      mode: data.mode,
    });
  }

  async constructEventWebhook(request: RawBodyRequest<Request>){
    const sig = request.headers['stripe-signature'];
    try {
      const event = this.stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        this.configService.get('STRIPE_WEBHOOK_SECRET')
      );
      return event;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async statusPaymentIntent(id: string){
    const paymentIntent = await this.stripe.paymentIntents.retrieve(id);
    return paymentIntent.status;
  }
}
