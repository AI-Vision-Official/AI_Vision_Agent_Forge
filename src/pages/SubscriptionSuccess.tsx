import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export const SubscriptionSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-6">
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Subscription Activated!</h1>
        <p className="text-slate-300 mb-8 max-w-md mx-auto">
          Thank you for upgrading your subscription. Your new features are now available.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center px-6 py-3 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};