import { AdminUser, AuthSession } from '../types/blog';

// Key for storing non-sensitive user profile metadata in client storage (never stores the secret token)
const PROFILE_STORAGE_KEY = 'websoul_admin_profile_v2';

export class AuthService {
  private static getStoredSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    try {
      // Clean up legacy session keys that may have stored plaintext tokens
      if (localStorage.getItem('websoul_admin_session_v1')) {
        localStorage.removeItem('websoul_admin_session_v1');
      }
      if (sessionStorage.getItem('websoul_admin_session_v1')) {
        sessionStorage.removeItem('websoul_admin_session_v1');
      }

      const stored =
        localStorage.getItem(PROFILE_STORAGE_KEY) ||
        sessionStorage.getItem(PROFILE_STORAGE_KEY);
      if (!stored) return null;

      const session = JSON.parse(stored) as AuthSession;
      if (!session || !session.expiresAt || session.expiresAt < Date.now()) {
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
      // Ensure no secret token is ever written to localStorage or sessionStorage
      const safeSession: AuthSession = {
        expiresAt: session.expiresAt,
        user: session.user,
      };
      const serialized = JSON.stringify(safeSession);
      if (rememberMe) {
        localStorage.setItem(PROFILE_STORAGE_KEY, serialized);
      } else {
        sessionStorage.setItem(PROFILE_STORAGE_KEY, serialized);
      }
      window.dispatchEvent(new CustomEvent('websoul_auth_changed', { detail: safeSession }));
    } catch (e) {
      console.error('Error saving session profile:', e);
    }
  }

  private static clearSession(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      sessionStorage.removeItem(PROFILE_STORAGE_KEY);
      localStorage.removeItem('websoul_admin_session_v1');
      sessionStorage.removeItem('websoul_admin_session_v1');
      window.dispatchEvent(new CustomEvent('websoul_auth_changed', { detail: null }));
    } catch (e) {
      console.error('Error clearing session profile:', e);
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

  /**
   * Validates the HttpOnly session cookie against the serverless verify endpoint.
   */
  public static async verifySession(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.authenticated && data.user) {
          const current = this.getStoredSession();
          const updated: AuthSession = {
            expiresAt: current?.expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000,
            user: data.user,
          };
          this.setStoredSession(updated, true);
          return true;
        }
      }

      this.clearSession();
      return false;
    } catch {
      // If offline or network error, fallback to unexpired local profile
      return this.isAuthenticated();
    }
  }

  public static async login(
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
    try {
      // Authenticate through secure serverless API endpoint with credentials: 'include' (HttpOnly Cookie)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success && data.user) {
        const session: AuthSession = {
          expiresAt: data.expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000,
          user: data.user,
        };
        this.setStoredSession(session, rememberMe);
        return { success: true, user: data.user };
      }

      return {
        success: false,
        error: data.error || 'Invalid admin credentials. Please verify your email and password.',
      };
    } catch (apiErr) {
      console.error('Authentication request failed:', apiErr);
      return {
        success: false,
        error: 'Authentication service is unreachable. Please verify your internet connection.',
      };
    }
  }

  public static async logout(): Promise<void> {
    this.clearSession();
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error('Logout error:', e);
    }
  }
}
