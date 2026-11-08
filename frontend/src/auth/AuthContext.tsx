import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, login as loginRequest, type LoginData, type User } from '../api/auth';
import { setUnauthorizedHandler } from '../api/client';
import { clearToken, getToken, setToken } from '../api/token';

interface AuthContextValue {
  /** Prijavljeni uporabnik ali null. */
  user: User | null;
  /** true, dokler ob nalaganju strani preverjamo shranjen žeton. */
  loading: boolean;
  login: (data: LoginData) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Ob nalaganju: če imamo shranjen žeton, preverimo, ali je še veljaven.
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    getMe()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  // Potečen ali neveljaven žeton (401 iz API-ja) → nazaj na prijavo.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      navigate('/login', {
        replace: true,
        state: { message: 'Seja je potekla. Prijavite se znova.' },
      });
    });
    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  const login = useCallback(async (data: LoginData) => {
    const res = await loginRequest(data);
    setToken(res.accessToken);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth mora biti uporabljen znotraj <AuthProvider>');
  return ctx;
}
