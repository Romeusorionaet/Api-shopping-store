import Stripe from "stripe";

export interface ConstructorEventProps {
  data: string | Buffer;
  signature: string | string[];
}

export interface ConstructorEvent {
  webhook({ data, signature }: ConstructorEventProps): Stripe.Event;
}
