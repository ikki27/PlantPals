import axios from 'axios';
import { clearToken, getToken } from './token';

/**
 * Skupni Axios klient za klice REST API-ja.
 * Osnovni URL pride iz frontend/.env (VITE_API_URL).
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

// US-03: vsaki zahtevi dodamo JWT v glavo Authorization.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Funkcija, ki jo ob neveljavni/potekli prijavi pokliče interceptor (nastavi jo AuthProvider). */
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

// US-03: če API vrne 401 na zahtevo z žetonom, je žeton neveljaven ali potekel
// → počistimo ga in uporabnika preusmerimo na prijavo.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const sentToken = Boolean(error.config?.headers?.Authorization);
    if (error.response?.status === 401 && sentToken) {
      clearToken();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);
