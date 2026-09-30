import React, { createContext, useContext, useState } from 'react';

interface CurrencyContextType {
  currency: string;
  currencySymbol: string;
  setCurrency: (c: string) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const symbolMap: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥'
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>('INR');

  const setCurrency = (c: string) => {
    setCurrencyState(c);
  };

  const currencySymbol = symbolMap[currency] || '₹';

  const formatCurrency = (amount: number): string => {
    const val = Math.abs(amount);
    const formatted = val.toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US', {
      maximumFractionDigits: 2
    });
    const prefix = amount < 0 ? '-' : '';
    return `${prefix}${currencySymbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, currencySymbol, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
