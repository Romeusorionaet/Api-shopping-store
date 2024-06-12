import Stripe from "stripe";

const initializeStripe = () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2023-10-16",
    appInfo: {
      name: "Shopping-store",
    },
  });

  return stripe;
};

export const stripe = initializeStripe();
