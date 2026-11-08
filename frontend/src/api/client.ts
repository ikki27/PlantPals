import axios from 'axios';

/**
 * Skupni Axios klient za klice REST API-ja.
 * Osnovni URL pride iz frontend/.env (VITE_API_URL).
 * Pri prijavi (US-03) bomo sem dodali interceptor, ki pošilja JWT v Authorization glavi.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});
