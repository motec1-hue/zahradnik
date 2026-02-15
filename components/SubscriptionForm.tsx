
import React from 'react';
import { SendIcon, SpinnerIcon } from './Icons';

interface SubscriptionFormProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  email,
  setEmail,
  onSubmit,
  isLoading,
  error,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Zadajte váš e-mail"
          disabled={isLoading}
          className="w-full pl-4 pr-12 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out disabled:bg-gray-200 disabled:cursor-not-allowed"
          aria-label="Email Address"
        />
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform duration-200 ease-in-out active:scale-95 disabled:bg-green-400 disabled:cursor-wait"
      >
        {isLoading ? (
          <>
            <SpinnerIcon className="animate-spin h-5 w-5 mr-3" />
            Generujem...
          </>
        ) : (
          <>
            <SendIcon className="h-5 w-5" />
            Získať tipy na tento týždeň
          </>
        )}
      </button>
    </div>
  );
};

export default SubscriptionForm;
