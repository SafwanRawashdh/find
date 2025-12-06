/**
 * User-related type definitions
 */

export interface IUser {
  _id: string;
  email: string;
  displayName: string;
  defaultCountry: string;
  defaultCurrency: string;
  preferences?: Record<string, unknown>;
  favorites: string[];
}

export interface IUserProfile {
  id: string;
  email: string;
  display_name: string;
  default_country: string;
  default_currency: string;
  created_at: string;
  updated_at: string;
}

export type SupportedCountry = 'US' | 'CA' | 'UK';
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP';

export const SUPPORTED_COUNTRIES: { code: SupportedCountry; name: string; flag: string }[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
];

export const SUPPORTED_CURRENCIES: { code: SupportedCurrency; symbol: string }[] = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
];
