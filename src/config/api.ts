// API Configuration
// Uses env when provided, otherwise falls back to your local Akeno Tech backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://web-production-ae7a.up.railway.app';

export const API_ENDPOINTS = {
  CHAT: `${API_BASE_URL}/chat`,
  CONSULTATION_AVAILABLE_SLOTS: `${API_BASE_URL}/consultation/available-slots`,
  CONSULTATION_SCHEDULE: `${API_BASE_URL}/consultation/schedule`,
} as const;

export default API_BASE_URL;

