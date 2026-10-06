import type { VercelRequest, VercelResponse } from '@vercel/node';

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  if (origin === 'https://www.websoul.tech' || origin === 'https://websoul.tech') return true;
  if (/^https:\/\/websoul(-[a-z0-9_-]+)?\.vercel\.app$/i.test(origin)) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return true;
  return false;
}

function setCorsHeaders(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin || '';
  const allowed = isAllowedOrigin(origin);

  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-CSRF-Token');
    res.setHeader('Vary', 'Origin');
  }

  return allowed;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const isAllowed = setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(isAllowed ? 204 : 403).end();
  }

  // Clear HttpOnly auth cookie by setting Max-Age=0
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  const clearCookie = [
    'websoul_auth_token=',
    'Path=/',
    'Max-Age=0',
    'HttpOnly',
    'SameSite=Strict',
    isProduction ? 'Secure' : '',
  ].filter(Boolean).join('; ');

  res.setHeader('Set-Cookie', clearCookie);

  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
}
