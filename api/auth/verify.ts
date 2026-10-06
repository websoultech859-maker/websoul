import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

interface DecodedTokenPayload {
  email: string;
  name?: string;
  role?: string;
  iat: number;
  exp: number;
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

function verifyToken(token: string): DecodedTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const secret = getJwtSecret();
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    const sigBuf = Buffer.from(signature, 'utf8');
    const expBuf = Buffer.from(expectedSig, 'utf8');

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as DecodedTokenPayload;
    if (!decoded.exp || decoded.exp < Date.now()) {
      return null; // Expired
    }

    return decoded;
  } catch {
    return null;
  }
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
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Vary', 'Origin');
  }

  return allowed;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const isAllowed = setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(isAllowed ? 204 : 403).end();
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '') || (req.body && req.body.token);

  if (!token) {
    return res.status(401).json({ authenticated: false, error: 'Authorization token is required.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ authenticated: false, error: 'Invalid or expired session.' });
  }

  return res.status(200).json({
    authenticated: true,
    user: {
      email: decoded.email,
      name: decoded.name || 'Websoul Admin',
      role: decoded.role || 'Administrator',
    },
  });
}
