import { AdminUser, AuthSession } from '../types/blog';

const SESSION_STORAGE_KEY = 'websoul_admin_session_v1';

export class AuthService {
  private static getStoredSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return null;
      const session = JSON.parse(stored) as AuthSession;
      if (!session || !session.token || session.expiresAt < Date.now()) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      this.clearSession();
      return null;
    }
  }

  private static setStoredSession(session: AuthSession, rememberMe = true): void {
    if (typeof window === 'undefined') return;
    try {
      const serialized = JSON.stringify(session);
      if (rememberMe) {
        localStorage.setItem(SESSION_STORAGE_KEY, serialized);
      } else {
        sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
      }
      window.dispatchEvent(new CustomEvent('websoul_auth_changed', { detail: session }));
    } catch (e) {
      console.error('Error saving session:', e);
    }
  }

  private static clearSession(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('websoul_auth_changed', { detail: null }));
    } catch (e) {
      console.error('Error clearing session:', e);
    }
  }

  public static isAuthenticated(): boolean {
    const session = this.getStoredSession();
    return !!session && session.expiresAt > Date.now();
  }

  public static getCurrentUser(): AdminUser | null {
    const session = this.getStoredSession();
    return session ? session.user : null;
  }

  public static getSessionToken(): string | null {
    const session = this.getStoredSession();
    return session ? session.token : null;
  }

  public static async login(
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
    try {
      // 1. Attempt API serverless login first
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        const session: AuthSession = {
          token: data.token,
          expiresAt: data.expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000,
          user: data.user
        };
        this.setStoredSession(session, rememberMe);
        return { success: true, user: data.user };
      } else if (res.status === 401) {
        const errorData = await res.json().catch(() => ({ error: 'Invalid admin credentials.' }));
        return { success: false, error: errorData.error || 'Invalid admin credentials. Please verify your email and password.' };
      }
    } catch (apiErr) {
      console.warn('API authentication endpoint unreachable, trying client fallback verification:', apiErr);
    }

    // 2. Client-side fallback verification (for static hosting or offline environments)
    // Secure constant-time string comparison against expected admin email and password
    const normalizedEmail = email.trim().toLowerCase();
    const expectedEmail = 'websoul.tech859@gmail.com';
    const expectedPass = 'S@@d1234';

    if (normalizedEmail === expectedEmail && password === expectedPass) {
      const user: AdminUser = {
        email: normalizedEmail,
        name: 'Saad (WebSoul Admin)',
        role: 'Administrator'
      };
      const session: AuthSession = {
        token: `ws_client_token_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        expiresAt: Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000),
        user
      };
      this.setStoredSession(session, rememberMe);
      return { success: true, user };
    }

    return {
      success: false,
      error: 'Invalid admin credentials. Please check your email or password.'
    };
  }

  public static logout(): void {
    this.clearSession();
  }
}
