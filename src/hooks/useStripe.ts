import { loadStripe } from '@stripe/stripe-js';
import { useSubscription } from './useSubscription';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const useStripe = () => {
  const { currentTier } = useSubscription();

  const getPriceId = (tier: string) => {
    const priceIds: Record<string, string> = {
      basic: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID,
      pro: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
      business: import.meta.env.VITE_STRIPE_BUSINESS_PRICE_ID
    };
    return priceIds[tier];
  };

  const redirectToCheckout = async (tier: string) => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: getPriceId(tier), quantity: 1 }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/subscription`,
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error in redirectToCheckout:', err);
    }
  };

  return {
    redirectToCheckout
  };
};