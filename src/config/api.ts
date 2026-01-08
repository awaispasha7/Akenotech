// API Configuration
// Uses env when provided, otherwise falls back to your local Akeno Tech backend
// These defaults ensure the build works even if env vars are not set during build time

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Football Analysis API URL - uses same backend as main API by default
// Use NEXT_PUBLIC_API_BASE_URL for both to reduce Railway secret validation requirements
// If you need a separate football API backend, set NEXT_PUBLIC_API_BASE_URL to point to it
export const FOOTBALL_API_URL = API_BASE_URL;

export const API_ENDPOINTS = {
  CHAT: `${API_BASE_URL}/chat`,
  CONSULTATION_AVAILABLE_SLOTS: `${API_BASE_URL}/consultation/available-slots`,
  CONSULTATION_SCHEDULE: `${API_BASE_URL}/consultation/schedule`,
  // Football Analysis endpoints
  FOOTBALL_UPLOAD: `${FOOTBALL_API_URL}/api/videos/upload`,
  FOOTBALL_YOUTUBE: `${FOOTBALL_API_URL}/api/videos/youtube`,
  FOOTBALL_JOB_STATUS: (jobId: string) => `${FOOTBALL_API_URL}/api/jobs/${jobId}`,
  FOOTBALL_RESULT: (jobId: string) => `${FOOTBALL_API_URL}/api/results/${jobId}.mp4`,
} as const;

export default API_BASE_URL;

