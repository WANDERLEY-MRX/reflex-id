import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    console.warn("[Stripe] STRIPE_SECRET_KEY não configurado. Stripe desativado.");
    return null;
  }
  
  if (!stripeClient) {
    stripeClient = new Stripe(apiKey, {
      maxNetworkRetries: 3,
      timeout: 30000,
    });
  }
  
  return stripeClient;
}

export const stripe = getStripeClient();

export async function createCheckoutSession(customerId: string, priceId: string, successUrl: string, cancelUrl: string) {
  if (!stripe) return null;
  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

export async function createCustomer(email: string, name?: string) {
  if (!stripe) return null;
  return stripe.customers.create({ email, name, metadata: { source: "reflex-id" } });
}

export async function getSubscription(subscriptionId: string) {
  if (!stripe) return null;
  return stripe.subscriptions.retrieve(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) return null;
  return stripe.subscriptions.cancel(subscriptionId);
}

export async function listInvoices(customerId: string) {
  if (!stripe) return { data: [] };
  return stripe.invoices.list({ customer: customerId, limit: 12 });
}