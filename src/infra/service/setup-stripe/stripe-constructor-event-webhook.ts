import { env } from "src/infra/env";
import { initializeStripe } from "./stripe";

interface Props {
  data: string | Buffer;
  signature: string | string[];
}

export function stripeConstructorEventWebhook({ data, signature }: Props) {
  const stripe = initializeStripe();

  const event = stripe.webhooks.constructEvent(
    data,
    signature,
    env.STRIPE_WEBHOOK_SECRET_KEY,
    400,
  );

  return { event };
}
