"use server";

import { auth, currentUser } from "@clerk/nextjs";

import { getUserSubscription } from "@/db/queries";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const returnUrl = absoluteUrl("/dashboard");

export const createStripeUrl = async () => {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Unauthorized.");

  const userSubscription = await getUserSubscription();

  if (userSubscription && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: returnUrl,
    });

    return { data: stripeSession.url };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.emailAddresses[0].emailAddress,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: "Eduflex Pro",
            description: "Corazones Ilimitados.",
          },
          unit_amount: 2000, // $20.00 USD
          recurring: {
            interval: "month",
          },
        },
      },
    ],
    metadata: {
      userId,
    },
    /* success_url: returnUrl,
    cancel_url: returnUrl, */
    success_url: "https://eduflex-nu.vercel.app/dashboard",
    cancel_url: "https://eduflex-nu.vercel.app/dashboard",
  });

  return { data: stripeSession.url };
};
