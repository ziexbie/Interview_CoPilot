const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const apiOrigin = (configuredBaseUrl || "http://localhost:9000").replace(
  /\/+$/,
  "",
);
const BASE_URL = apiOrigin.endsWith("/api") ? apiOrigin : `${apiOrigin}/api`;

export const API_PATHS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    SIGNUP: `${BASE_URL}/auth/signup`,
  },
  SESSION: {
    CREATE: `${BASE_URL}/sessions/create`,
    GET_ALL: `${BASE_URL}/sessions/my-sessions`,
    GET_ONE: `${BASE_URL}/sessions`, // usage: GET_ONE/:id
  },
  AI: {
    GENERATE: `${BASE_URL}/ai/generate-questions`,
    GENERATE_QUESTIONS: `${BASE_URL}/ai/generate-questions`,
    EXPLAIN: `${BASE_URL}/ai/generate-explanation`,
  },
  QUESTION: {
    BASE: `${BASE_URL}/questions`,
    BY_SESSION: `${BASE_URL}/questions/session`,
  },
};
