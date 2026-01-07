// API Configuration
// Uses env when provided, otherwise falls back to your local Akeno Tech backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://web-production-ae7a.up.railway.app';

// Football Analysis API URL - uses production backend URL
// Can be overridden with NEXT_PUBLIC_FOOTBALL_API_URL for separate backend
export const FOOTBALL_API_URL = process.env.NEXT_PUBLIC_FOOTBALL_API_URL || 'https://web-production-ae7a.up.railway.app';

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

