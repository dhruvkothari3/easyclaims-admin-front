// Environment configuration
export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.easyclaims.in',
  USE_MOCKS: import.meta.env.VITE_USE_MOCKS === 'true'
};