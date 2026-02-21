import { Currency } from "./types";

// Separate pricing for each currency
export const PRICES: Record<Currency, {
  singleAnalysis: number;
  unlimitedMonthly: number;
  landingPage: number;
  ecommerce: number;
  mobileApp: number;
  customSoftware: number;
  mentorship: Record<string, number>;
}> = {
  BDT: {
    singleAnalysis: 299,
    unlimitedMonthly: 999,
    landingPage: 4999,
    ecommerce: 14999,
    mobileApp: 29999,
    customSoftware: 49999,
    mentorship: {
      "business-idea": 499,
      "marketing": 699,
      "scaling": 999,
      "full-consultation": 1499,
      "tech-guidance": 599,
    },
  },
  USD: {
    singleAnalysis: 5,
    unlimitedMonthly: 15,
    landingPage: 49,
    ecommerce: 149,
    mobileApp: 299,
    customSoftware: 499,
    mentorship: {
      "business-idea": 10,
      "marketing": 15,
      "scaling": 20,
      "full-consultation": 30,
      "tech-guidance": 12,
    },
  },
  EUR: {
    singleAnalysis: 5,
    unlimitedMonthly: 14,
    landingPage: 45,
    ecommerce: 139,
    mobileApp: 279,
    customSoftware: 459,
    mentorship: {
      "business-idea": 9,
      "marketing": 14,
      "scaling": 19,
      "full-consultation": 28,
      "tech-guidance": 11,
    },
  },
};

export const formatPrice = (amount: number, currency: Currency): string => {
  const symbols: Record<Currency, string> = {
    BDT: "৳",
    USD: "$",
    EUR: "€",
  };
  return `${symbols[currency]}${amount.toLocaleString()}`;
};
