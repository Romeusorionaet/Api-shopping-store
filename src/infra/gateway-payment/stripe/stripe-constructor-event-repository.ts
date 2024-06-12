import { env } from "src/infra/env";

import Stripe from "stripe";
import {
  ConstructorEventProps,
  ConstructorEventRepository,
} from "./constructor-event-repository";
import { stripe } from "src/infra/service/setup-stripe/stripe";

export class StripeConstructorEventRepository
  implements ConstructorEventRepository
{
  webhook({ data, signature }: ConstructorEventProps): Stripe.Event {
    const event = stripe.webhooks.constructEvent(
      data,
      signature,
      env.STRIPE_WEBHOOK_SECRET_KEY,
      400,
    );

    return event;
  }
}
