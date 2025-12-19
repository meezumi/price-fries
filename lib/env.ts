// Environment variable validation
const requiredEnvVars = [
  'MONGODB_URI',
  'BRIGHT_DATA_USERNAME',
  'BRIGHT_DATA_PASSWORD',
  'EMAIL_PASSWORD',
  'JWT_SECRET',
];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Export safe env vars
export const envConfig = {
  MONGODB_URI: process.env.MONGODB_URI!,
  BRIGHT_DATA_USERNAME: process.env.BRIGHT_DATA_USERNAME!,
  BRIGHT_DATA_PASSWORD: process.env.BRIGHT_DATA_PASSWORD!,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD!,
  JWT_SECRET: process.env.JWT_SECRET!,
};
