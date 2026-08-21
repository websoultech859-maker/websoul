import type { VercelRequest, VercelResponse } from '@vercel/node';

// Admin credentials configured securely on server side
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'websoul.tech859@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'S@@d1234';
const JWT_SECRET = process.env.JWT_SECRET || 'websoul_super_secret_jwt_key_2026';

function createToken(email: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      email,
      role: 'admin',
      iat: Date.now(),
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    })
  ).toString('base64url');
  
  // Simple HMAC-like signature for serverless token validation
  const crypto = require('crypto');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

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
    if (normalizedEmail !== ADMIN_EMAIL.toLowerCase() || String(password) !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid admin credentials. Please check email or password.' });
    }

    const token = createToken(normalizedEmail);
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    return res.status(200).json({
      success: true,
      token,
      expiresAt,
      user: {
        email: normalizedEmail,
        name: 'Saad (WebSoul Admin)',
        role: 'Administrator'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
}
