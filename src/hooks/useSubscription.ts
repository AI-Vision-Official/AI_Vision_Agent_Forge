import { useContext } from 'react';
import { SubscriptionContext } from '../context/SubscriptionContext';

export const useSubscription = () => {
  return useContext(SubscriptionContext);
};