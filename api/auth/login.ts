import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

interface AdminAccount {
  email: string;
  passwordHash: string;
  name: string;
  role: string;
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verify a plaintext password against a stored cryptographic hash or legacy plaintext string.
 * Supports memory-hard scrypt (scrypt:salt:hash) and PBKDF2 (pbkdf2:salt:iterations:hash).
 */
function verifyPassword(plainPassword: string, storedHashOrPassword: string): boolean {
  if (!plainPassword || !storedHashOrPassword) return false;

  // 1. scrypt password hash format (scrypt:salt:derivedKeyHex) - Preferred
  if (storedHashOrPassword.startsWith('scrypt:')) {
    const parts = storedHashOrPassword.split(':');
    if (parts.length !== 3) return false;
    const [, salt, expectedHashHex] = parts;
    try {
      const derivedKey = crypto.scryptSync(plainPassword, salt, 64);
      const derivedBuf = Buffer.from(derivedKey.toString('hex'), 'utf8');
      const expectedBuf = Buffer.from(expectedHashHex, 'utf8');
      if (derivedBuf.length !== expectedBuf.length) {
        crypto.timingSafeEqual(derivedBuf, derivedBuf);
        return false;
      }
      return crypto.timingSafeEqual(derivedBuf, expectedBuf);
    } catch (e) {
      console.error('Password hash verification failed:', e);
      return false;
    }
  }

  // 2. PBKDF2 password hash format (pbkdf2:salt:iterations:derivedKeyHex)
  if (storedHashOrPassword.startsWith('pbkdf2:')) {
    const parts = storedHashOrPassword.split(':');
    if (parts.length !== 4) return false;
    const [, salt, iterationsStr, expectedHashHex] = parts;
    const iterations = parseInt(iterationsStr, 10) || 100000;
    try {
      const derivedKey = crypto.pbkdf2Sync(plainPassword, salt, iterations, 64, 'sha512');
      const derivedBuf = Buffer.from(derivedKey.toString('hex'), 'utf8');
      const expectedBuf = Buffer.from(expectedHashHex, 'utf8');
      if (derivedBuf.length !== expectedBuf.length) {
        crypto.timingSafeEqual(derivedBuf, derivedBuf);
        return false;
      }
      return crypto.timingSafeEqual(derivedBuf, expectedBuf);
    } catch (e) {
      console.error('PBKDF2 verification failed:', e);
      return false;
    }
  }

  // 3. Fallback: Timing-safe plain string comparison for legacy unhashed passwords
  return timingSafeEqualStrings(plainPassword, storedHashOrPassword);
}

/**
 * Parse configured administrators from environment variables
 */
function getConfiguredAdmins(): AdminAccount[] {
  const admins: AdminAccount[] = [];

  // 1. Multi-admin support via ADMIN_USERS JSON array
  if (process.env.ADMIN_USERS) {
    try {
      const parsed = JSON.parse(process.env.ADMIN_USERS);
      if (Array.isArray(parsed)) {
        for (const u of parsed) {
          const pass = u && (u.passwordHash || u.password);
          if (u && u.email && pass) {
            admins.push({
              email: String(u.email).trim().toLowerCase(),
              passwordHash: String(pass),
              name: u.name || 'Websoul Admin',
              role: u.role || 'Administrator',
            });
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse ADMIN_USERS environment variable:', e);
    }
  }

  // 2. Backward compatibility with ADMIN_EMAIL and ADMIN_PASSWORD_HASH / ADMIN_PASSWORD
  const fallbackEmail = process.env.ADMIN_EMAIL;
  const fallbackPass = process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD;
  if (fallbackEmail && fallbackPass) {
    const normalized = fallbackEmail.trim().toLowerCase();
    if (!admins.some((a) => a.email === normalized)) {
      admins.push({
        email: normalized,
        passwordHash: String(fallbackPass),
        name: process.env.ADMIN_NAME || 'Websoul Admin',
        role: 'Administrator',
      });
    }
  }

  return admins;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
    if (isProduction) {
      throw new Error('JWT_SECRET environment variable is missing on the server.');
    }
    console.warn('[SECURITY WARNING] Using fallback JWT secret for non-production development.');
    return 'websoul_dev_fallback_secret_key_only';
  }
  return secret;
}

function createToken(user: AdminAccount): string {
  const secret = getJwtSecret();
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      email: user.email,
      name: user.name,
      role: user.role,
      iat: Date.now(),
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;

  // Production websoul domains
  if (origin === 'https://www.websoul.tech' || origin === 'https://websoul.tech') {
    return true;
  }

  // Websoul Vercel preview and staging deployments only (e.g. websoul.vercel.app, websoul-git-*.vercel.app)
  if (/^https:\/\/websoul(-[a-z0-9_-]+)?\.vercel\.app$/i.test(origin)) {
    return true;
  }

  // Local development
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
    return true;
  }

  return false;
}

function setCorsHeaders(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin || '';
  const allowed = isAllowedOrigin(origin);

  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
    res.setHeader('Vary', 'Origin');
  }

  return allowed;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const isAllowed = setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(isAllowed ? 204 : 403).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const admins = getConfiguredAdmins();

    if (admins.length === 0) {
      console.error('No admin users configured in ADMIN_USERS or ADMIN_EMAIL/ADMIN_PASSWORD.');
      return res.status(500).json({
        error: 'Authentication is not configured on the server. Please set ADMIN_USERS in environment variables.',
      });
    }

    // Find admin by normalized email
    const matchedAdmin = admins.find((a) => a.email === normalizedEmail);

    // Constant-time password check with dummy hash simulation to resist timing attacks
    const DUMMY_SCRYPT_HASH =
      'scrypt:0000000000000000:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

    const isPasswordValid = matchedAdmin
      ? verifyPassword(String(password), matchedAdmin.passwordHash)
      : verifyPassword(String(password), DUMMY_SCRYPT_HASH);

    if (!matchedAdmin || !isPasswordValid) {
      return res.status(401).json({ error: 'Invalid admin credentials. Please check email or password.' });
    }

    const token = createToken(matchedAdmin);
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    // Secure HttpOnly session cookie to protect token against XSS exfiltration
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
    const cookieFlags = [
      `websoul_auth_token=${encodeURIComponent(token)}`,
      'Path=/',
      `Max-Age=${7 * 24 * 60 * 60}`,
      'HttpOnly',
      'SameSite=Strict',
      isProduction ? 'Secure' : '',
    ].filter(Boolean).join('; ');

    res.setHeader('Set-Cookie', cookieFlags);

    return res.status(200).json({
      success: true,
      expiresAt,
      user: {
        email: matchedAdmin.email,
        name: matchedAdmin.name,
        role: matchedAdmin.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
}
