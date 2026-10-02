import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

interface AdminAccount {
  email: string;
  password: string;
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
 * Parse configured administrators from environment variables (Approach C)
 */
function getConfiguredAdmins(): AdminAccount[] {
  const admins: AdminAccount[] = [];

  // 1. Multi-admin support via ADMIN_USERS JSON array
  if (process.env.ADMIN_USERS) {
    try {
      const parsed = JSON.parse(process.env.ADMIN_USERS);
      if (Array.isArray(parsed)) {
        for (const u of parsed) {
          if (u && u.email && u.password) {
            admins.push({
              email: String(u.email).trim().toLowerCase(),
              password: String(u.password),
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

  // 2. Backward compatibility with ADMIN_EMAIL and ADMIN_PASSWORD
  const fallbackEmail = process.env.ADMIN_EMAIL;
  const fallbackPass = process.env.ADMIN_PASSWORD;
  if (fallbackEmail && fallbackPass) {
    const normalized = fallbackEmail.trim().toLowerCase();
    if (!admins.some((a) => a.email === normalized)) {
      admins.push({
        email: normalized,
        password: String(fallbackPass),
        name: process.env.ADMIN_NAME || 'Saad (Websoul Admin)',
        role: 'Administrator',
      });
    }
  }

  return admins;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is missing.');
    }
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

function setCorsHeaders(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';
  const isAllowedOrigin =
    origin === 'https://www.websoul.tech' ||
    origin === 'https://websoul.tech' ||
    origin.startsWith('http://localhost:') ||
    origin.endsWith('.vercel.app');

  if (isAllowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.websoul.tech');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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

    // Timing-safe password check
    const isPasswordValid = matchedAdmin
      ? timingSafeEqualStrings(String(password), matchedAdmin.password)
      : timingSafeEqualStrings(String(password), 'dummy_password_for_timing');

    if (!matchedAdmin || !isPasswordValid) {
      return res.status(401).json({ error: 'Invalid admin credentials. Please check email or password.' });
    }

    const token = createToken(matchedAdmin);
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    return res.status(200).json({
      success: true,
      token,
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
