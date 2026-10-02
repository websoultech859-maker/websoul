import { AdminUser, AuthSession } from '../types/blog';

const SESSION_STORAGE_KEY = 'websoul_admin_session_v1';

export class AuthService {
  private static getStoredSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored =
        localStorage.getItem(SESSION_STORAGE_KEY) ||
        sessionStorage.getItem(SESSION_STORAGE_KEY) ||
        localStorage.getItem('websoul_admin_session_v1') ||
        sessionStorage.getItem('websoul_admin_session_v1');
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
      localStorage.removeItem('websoul_admin_session_v1');
      sessionStorage.removeItem('websoul_admin_session_v1');
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
      // Authenticate exclusively through the secure serverless API endpoint
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success && data.token) {
        const session: AuthSession = {
          token: data.token,
          expiresAt: data.expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000,
          user: data.user
        };
        this.setStoredSession(session, rememberMe);
        return { success: true, user: data.user };
      }

      return {
        success: false,
        error: data.error || 'Invalid admin credentials. Please verify your email and password.'
      };
    } catch (apiErr) {
      console.error('Authentication request failed:', apiErr);
      return {
        success: false,
        error: 'Authentication service is unreachable. Please verify your internet connection.'
      };
    }
  }

  public static logout(): void {
    this.clearSession();
  }
}
