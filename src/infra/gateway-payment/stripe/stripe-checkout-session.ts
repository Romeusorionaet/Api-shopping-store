import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { env } from "src/infra/env";
import { stripe } from "src/infra/service/setup-stripe/stripe";

interface OrderProductProps {
  productId: UniqueEntityID;
  title: string;
  description: string;
  basePrice: number;
  discountPercentage: number;
  quantity: number;
}

interface Props {
  orderId: string;
  orderProducts: OrderProductProps[];
}

export async function stripeCheckoutSession({ orderId, orderProducts }: Props) {
  const successUrl = `${env.STRIPE_SUCCESS_URL}`;
  const cancelUrl = `${env.STRIPE_CANCEL_URL}`;

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      orderId,
    },

    line_items: orderProducts.map((product) => {
      const totalDiscount =
        Number(product.basePrice) * (product.discountPercentage / 100);
      const totalPrice = Number(product.basePrice) - totalDiscount;
      const totalPriceInCents = Math.round(totalPrice * 100);

      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: product.title,
            description: product.description,
          },
          unit_amount: totalPriceInCents,
        },
        quantity: product.quantity,
      };
    }),
  });

  const successUrlWithSessionId = successUrl.replace(
    "{CHECKOUT_SESSION_ID}",
    checkoutSession.id,
  );

  return { checkoutUrl: checkoutSession.url, successUrlWithSessionId };
}
