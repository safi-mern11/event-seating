import type { PriceTier, PricingInfo } from '../types/venue';

const PRICING_MAP: Record<PriceTier, number> = {
  1: 150,
  2: 100,
  3: 50,
};

export function getPriceForTier(tier: PriceTier): number {
  return PRICING_MAP[tier];
}

export function getPricingInfo(tier: PriceTier): PricingInfo {
  return {
    tier,
    price: getPriceForTier(tier),
  };
}

export function calculateTotal(tiers: PriceTier[]): number {
  return tiers.reduce((sum, tier) => sum + getPriceForTier(tier), 0);
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
