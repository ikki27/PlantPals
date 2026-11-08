/** Hramba JWT žetona v brskalniku (localStorage). */
const TOKEN_KEY = 'plantpals_token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* brskalnik ne dovoli shranjevanja — prijava bo veljala do osvežitve */
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ni kaj počistiti */
  }
}
