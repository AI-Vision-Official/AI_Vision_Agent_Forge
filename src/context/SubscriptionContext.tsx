import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Subscription, SubscriptionTier } from '../types/types';

interface SubscriptionContextType {
  currentTier: SubscriptionTier;
  subscriptionDetails: Subscription;
  upgradeTier: (tier: SubscriptionTier) => void;
  isFeatureAvailable: (feature: keyof Subscription) => boolean;
}

const subscriptionPlans: Record<SubscriptionTier, Subscription> = {
  free: {
    tier: 'free',
    features: ['Basic AI Agents', 'Limited Projects', 'Community Support'],
    priceMonthly: 0,
    priceYearly: 0,
    maxAgents: 2,
    maxProjects: 1,
    specializedAgents: false,
    githubIntegration: false,
    vsCodeIntegration: false,
    priority: false,
    support: 'community'
  },
  basic: {
    tier: 'basic',
    features: ['Advanced AI Agents', 'Multiple Projects', 'GitHub Integration', 'Email Support'],
    priceMonthly: 29,
    priceYearly: 290,
    maxAgents: 5,
    maxProjects: 3,
    specializedAgents: true,
    githubIntegration: true,
    vsCodeIntegration: false,
    priority: false,
    support: 'email'
  },
  pro: {
    tier: 'pro',
    features: [
      'Specialized AI Agents',
      'Unlimited Projects',
      'GitHub & VS Code Integration',
      'Priority Support',
      'Advanced Analytics'
    ],
    priceMonthly: 79,
    priceYearly: 790,
    maxAgents: 15,
    maxProjects: 10,
    specializedAgents: true,
    githubIntegration: true,
    vsCodeIntegration: true,
    priority: true,
    support: 'priority'
  },
  business: {
    tier: 'business',
    features: [
      'Custom AI Agents',
      'Unlimited Everything',
      'Full Integration Suite',
      'Dedicated Support',
      'Enterprise Features',
      'Custom Development'
    ],
    priceMonthly: 299,
    priceYearly: 2990,
    maxAgents: -1, // unlimited
    maxProjects: -1, // unlimited
    specializedAgents: true,
    githubIntegration: true,
    vsCodeIntegration: true,
    priority: true,
    support: 'dedicated'
  }
};

export const SubscriptionContext = createContext<SubscriptionContextType>({
  currentTier: 'free',
  subscriptionDetails: subscriptionPlans.free,
  upgradeTier: () => {},
  isFeatureAvailable: () => false
});

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('free');

  useEffect(() => {
    const savedTier = localStorage.getItem('subscriptionTier') as SubscriptionTier;
    if (savedTier && subscriptionPlans[savedTier]) {
      setCurrentTier(savedTier);
    }
  }, []);

  const upgradeTier = (tier: SubscriptionTier) => {
    setCurrentTier(tier);
    localStorage.setItem('subscriptionTier', tier);
  };

  const isFeatureAvailable = (feature: keyof Subscription): boolean => {
    return !!subscriptionPlans[currentTier][feature];
  };

  return (
    <SubscriptionContext.Provider
      value={{
        currentTier,
        subscriptionDetails: subscriptionPlans[currentTier],
        upgradeTier,
        isFeatureAvailable
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};