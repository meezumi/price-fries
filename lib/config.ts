// Configuration for PriceFries application

export const APP_CONFIG = {
  // API endpoints
  API_ENDPOINTS: {
    AUTH_REGISTER: '/api/auth/register',
    AUTH_LOGIN: '/api/auth/login',
    AUTH_VERIFY: '/api/auth/verify',
    AUTH_CHECK: '/api/auth/check',
    SCRAPE: '/api/scrape',
    PRODUCTS: '/api/products',
  },

  // Storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth-token',
    USER_PREFERENCES: 'user-preferences',
  },

  // Routes
  ROUTES: {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    DASHBOARD: '/dashboard',
    PRODUCTS: '/products',
  },

  // Error messages
  ERRORS: {
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PASSWORD: 'Password must be at least 6 characters',
    PASSWORDS_MISMATCH: 'Passwords do not match',
    INVALID_URL: 'Please enter a valid Amazon product URL',
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    UNAUTHORIZED: 'You need to login to perform this action',
    RATE_LIMIT: 'Too many requests. Please try again later.',
  },

  // Success messages
  SUCCESS: {
    PRODUCT_ADDED: 'Product added successfully!',
    REGISTRATION_SUCCESS: 'Registration successful! Check your email to verify your account.',
    LOGIN_SUCCESS: 'Login successful!',
    EMAIL_VERIFIED: 'Email verified successfully!',
  },
};
