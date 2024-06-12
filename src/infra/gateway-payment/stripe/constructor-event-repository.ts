import Stripe from "stripe";

export interface ConstructorEventProps {
  data: string | Buffer;
  signature: string | string[];
}

export interface ConstructorEventRepository {
  webhook({ data, signature }: ConstructorEventProps): Stripe.Event;
}
