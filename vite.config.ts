import { defineConfig, loadEnv, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

function verifyDevPassword(plainPassword: string, storedHashOrPassword: string): boolean {
  if (!plainPassword || !storedHashOrPassword) return false;
  if (storedHashOrPassword.startsWith('scrypt:')) {
    const parts = storedHashOrPassword.split(':');
    if (parts.length !== 3) return false;
    const [, salt, expectedHashHex] = parts;
    try {
      const derivedKey = crypto.scryptSync(plainPassword, salt, 64);
      const derivedBuf = Buffer.from(derivedKey.toString('hex'), 'utf8');
      const expectedBuf = Buffer.from(expectedHashHex, 'utf8');
      if (derivedBuf.length !== expectedBuf.length) return false;
      return crypto.timingSafeEqual(derivedBuf, expectedBuf);
    } catch {
      return false;
    }
  }
  return plainPassword === storedHashOrPassword;
}

function authDevPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'auth-dev-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/auth/login' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { email, password } = JSON.parse(body || '{}');
              const normalized = String(email || '').trim().toLowerCase();
              let configuredAdmins: Array<{ email: string; password: string; name: string; role: string }> = [];

              // 1. Parse from ADMIN_USERS JSON in env
              const rawUsers = env.ADMIN_USERS || process.env.ADMIN_USERS;
              if (rawUsers) {
                try {
                  const parsed = JSON.parse(rawUsers);
                  if (Array.isArray(parsed)) {
                    configuredAdmins = parsed
                      .filter((u) => u && u.email && (u.passwordHash || u.password))
                      .map((u) => ({
                        email: String(u.email).trim().toLowerCase(),
                        password: String(u.passwordHash || u.password),
                        name: u.name || 'Websoul Admin',
                        role: u.role || 'Administrator',
                      }));
                  }
                } catch (e) {
                  console.error('[auth-dev-server] Failed to parse ADMIN_USERS:', e);
                }
              }

              // 2. Parse from ADMIN_EMAIL / ADMIN_PASSWORD_HASH / ADMIN_PASSWORD in env
              const fallbackEmail = env.ADMIN_EMAIL || process.env.ADMIN_EMAIL;
              const fallbackPass =
                env.ADMIN_PASSWORD_HASH ||
                env.ADMIN_PASSWORD ||
                process.env.ADMIN_PASSWORD_HASH ||
                process.env.ADMIN_PASSWORD;
              if (fallbackEmail && fallbackPass) {
                const normEmail = fallbackEmail.trim().toLowerCase();
                if (!configuredAdmins.some((a) => a.email === normEmail)) {
                  configuredAdmins.push({
                    email: normEmail,
                    password: String(fallbackPass),
                    name: env.ADMIN_NAME || process.env.ADMIN_NAME || 'Websoul Admin',
                    role: 'Administrator',
                  });
                }
              }

              // 3. Fall back to parsing .env.local or .env directly
              if (configuredAdmins.length === 0) {
                for (const envFileName of ['.env.local', '.env']) {
                  const envPath = path.resolve(process.cwd(), envFileName);
                  if (fs.existsSync(envPath)) {
                    const content = fs.readFileSync(envPath, 'utf8');
                    const match = content.match(/ADMIN_USERS=['"]?(\[.*?\])['"]?/s);
                    if (match && match[1]) {
                      try {
                        const parsed = JSON.parse(match[1]);
                        if (Array.isArray(parsed)) {
                          configuredAdmins = parsed
                            .filter((u) => u && u.email && (u.passwordHash || u.password))
                            .map((u) => ({
                              email: String(u.email).trim().toLowerCase(),
                              password: String(u.passwordHash || u.password),
                              name: u.name || 'Websoul Admin',
                              role: u.role || 'Administrator',
                            }));
                          break;
                        }
                      } catch {}
                    }
                  }
                }
              }

              // If no admins are configured, return clear server configuration error
              if (configuredAdmins.length === 0) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 500;
                res.end(
                  JSON.stringify({
                    error:
                      'Dev authentication is not configured. Please define ADMIN_USERS or ADMIN_EMAIL/ADMIN_PASSWORD in .env.local (see .env.example).',
                  })
                );
                return;
              }

              const matchedAdmin = configuredAdmins.find(
                (a) => a.email.trim().toLowerCase() === normalized && verifyDevPassword(String(password), String(a.password))
              );

              if (matchedAdmin) {
                const devToken = `websoul_dev_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
                res.setHeader('Set-Cookie', `websoul_auth_token=${devToken}; Path=/; HttpOnly; SameSite=Strict`);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(
                  JSON.stringify({
                    success: true,
                    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
                    user: {
                      email: matchedAdmin.email,
                      name: matchedAdmin.name || 'Websoul Admin',
                      role: matchedAdmin.role || 'Administrator',
                    },
                  })
                );
                return;
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 401;
              res.end(JSON.stringify({ error: 'Invalid admin credentials. Please check email or password.' }));
            } catch {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Malformed JSON payload.' }));
            }
          });
          return;
        }

        if (req.url === '/api/auth/logout' && (req.method === 'POST' || req.method === 'GET')) {
          res.setHeader('Set-Cookie', 'websoul_auth_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict');
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, message: 'Logged out successfully.' }));
          return;
        }

        if (req.url === '/api/auth/verify' && (req.method === 'GET' || req.method === 'POST')) {
          const cookieHeader = req.headers.cookie || '';
          const match = cookieHeader.match(/(?:^|;\s*)websoul_auth_token=([^;]+)/);
          if (match && match[1]) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                authenticated: true,
                user: {
                  email: 'admin@websoul.tech',
                  name: 'Websoul Admin',
                  role: 'Administrator',
                },
              })
            );
            return;
          }
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 401;
          res.end(JSON.stringify({ authenticated: false, error: 'Unauthorized.' }));
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      tailwindcss(),
      react(),
      authDevPlugin(env),
    ],
    server: {
      watch: {
        ignored: ['**/*.rar', '**/*.zip', '**/*.7z', '**/*.tar.gz', '**/.git/**']
      }
    }
  };
})

