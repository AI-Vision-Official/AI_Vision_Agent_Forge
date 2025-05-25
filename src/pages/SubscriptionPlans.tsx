import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Shield, Star, Sparkles, Building2 } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { SubscriptionTier } from '../types/types';

const features = {
  free: [
    'Create up to 2 AI agents',
    'Basic project management',
    'Community support',
    'Standard AI models'
  ],
  basic: [
    'Create up to 5 AI agents',
    'GitHub integration',
    'Advanced AI models',
    'Email support',
    'Multiple projects',
    'Real-time previews'
  ],
  pro: [
    'Create up to 15 specialized agents',
    'VS Code integration',
    'Priority support',
    'Advanced analytics',
    'Custom AI models',
    'Neural network optimization'
  ],
  business: [
    'Unlimited specialized agents',
    'Custom AI development',
    'Dedicated support team',
    'Enterprise features',
    'Advanced security',
    'Custom integrations'
  ]
};

export const SubscriptionPlans: React.FC = () => {
  const navigate = useNavigate();
  const { currentTier, upgradeTier, subscriptionDetails } = useSubscription();

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (tier === 'free') {
      upgradeTier(tier);
      navigate('/dashboard');
      return;
    }

    // Here you would typically integrate with Stripe
    upgradeTier(tier);
    navigate('/dashboard');
  };

  const getPlanIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'free':
        return <Zap className="h-6 w-6 text-blue-400" />;
      case 'basic':
        return <Shield className="h-6 w-6 text-teal-400" />;
      case 'pro':
        return <Star className="h-6 w-6 text-purple-400" />;
      case 'business':
        return <Building2 className="h-6 w-6 text-amber-400" />;
    }
  };

  return (
    <div className="py-12 animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Unlock the full potential of AI with our flexible subscription plans
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
        {(['free', 'basic', 'pro', 'business'] as SubscriptionTier[]).map((tier) => (
          <div
            key={tier}
            className={`relative bg-slate-800/30 backdrop-blur rounded-2xl border ${
              currentTier === tier
                ? 'border-teal-500/50 ring-2 ring-teal-500/20'
                : 'border-slate-700'
            } p-6 transition-all duration-300 hover:transform hover:scale-105`}
          >
            {currentTier === tier && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Current Plan
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-slate-700/50">
                {getPlanIcon(tier)}
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">
                  ${subscriptionDetails.priceMonthly}
                </span>
                <span className="text-slate-400">/month</span>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2 capitalize">{tier}</h3>
            <p className="text-slate-400 text-sm mb-6">
              {tier === 'free'
                ? 'Perfect for getting started'
                : tier === 'basic'
                ? 'Great for small projects'
                : tier === 'pro'
                ? 'Ideal for professionals'
                : 'For enterprise needs'}
            </p>

            <ul className="space-y-3 mb-6">
              {features[tier].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-teal-400 mr-2 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(tier)}
              disabled={currentTier === tier}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                currentTier === tier
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white'
              }`}
            >
              {currentTier === tier ? 'Current Plan' : `Upgrade to ${tier}`}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center justify-center gap-2 bg-slate-800/50 backdrop-blur rounded-full px-4 py-2 border border-slate-700">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="text-slate-300">
            All plans include access to our next-gen AI technology
          </span>
        </div>
      </div>
    </div>
  );
});