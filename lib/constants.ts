// Application constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

export const PRICE_THRESHOLD = {
  DISCOUNT_PERCENTAGE: 40,
};

export const EMAIL = {
  FROM: 'priceFriesUpdates@outlook.com',
  VERIFICATION_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
};

export const RATE_LIMIT = {
  SCRAPE: 30, // requests per 15 mins
  AUTH: 5, // requests per 15 mins
};

export const SIMILAR_PRODUCTS_LIMIT = 3;
