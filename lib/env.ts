/**
 * Environment variable validation and type-safe access.
 * Centralizes environment configuration for the application.
 */

/**
 * Get an environment variable with optional default value.
 * Throws an error if the variable is required but not set.
 */
function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Application environment configuration.
 */
export const env = {
  // Public variables (available in browser)
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Server-only variables (add as needed)
  // DATABASE_URL: getEnvVar("DATABASE_URL"),
  // API_SECRET: getEnvVar("API_SECRET"),

  // Feature flags and environment info
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;

export type Env = typeof env;
