import Stripe from "stripe";

export type Prices = {
  currency: string;
  unit_amount: number;
  country?: string;
}

export type Session = {
  priceId: string;
  quantity: number;
  mode: Stripe.Checkout.SessionCreateParams.Mode;
}
