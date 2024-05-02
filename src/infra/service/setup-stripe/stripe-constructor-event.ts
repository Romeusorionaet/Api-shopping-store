import { env } from "src/infra/env";
import { initializeStripe } from "./stripe";
import {
  ConstructorEvent,
  ConstructorEventProps,
} from "src/domain/store/application/stripe/constructor-event";
import Stripe from "stripe";

export class StripeConstructorEvent implements ConstructorEvent {
  webhook({ data, signature }: ConstructorEventProps): Stripe.Event {
    const stripe = initializeStripe();

    const event = stripe.webhooks.constructEvent(
      data,
      signature,
      env.STRIPE_WEBHOOK_SECRET_KEY,
      400,
    );

    return event;
  }
}
