import { defineConfig, loadEnv, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

function authDevPlugin(envUsersRaw?: string): Plugin {
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

              const rawUsers = envUsersRaw || process.env.ADMIN_USERS;
              if (rawUsers) {
                try {
                  const parsed = JSON.parse(rawUsers);
                  if (Array.isArray(parsed)) configuredAdmins = parsed;
                } catch (e) {
                  console.error('[auth-dev-server] Failed to parse ADMIN_USERS:', e);
                }
              }

              // Also parse from .env.local or .env if present
              if (configuredAdmins.length === 0) {
                for (const envFileName of ['.env.local', '.env', '.env.example']) {
                  const envPath = path.resolve(process.cwd(), envFileName);
                  if (fs.existsSync(envPath)) {
                    const content = fs.readFileSync(envPath, 'utf8');
                    const match = content.match(/ADMIN_USERS=['"]?(\[.*?\])['"]?/s);
                    if (match && match[1]) {
                      try {
                        const parsed = JSON.parse(match[1]);
                        if (Array.isArray(parsed)) {
                          configuredAdmins = parsed;
                          break;
                        }
                      } catch {}
                    }
                  }
                }
              }

              // Local dev fallback accounts so local development works immediately
              if (configuredAdmins.length === 0) {
                configuredAdmins = [
                  {
                    email: 'websoul.tech859@gmail.com',
                    password: 'ChangeMeToAStrongPassword1!',
                    name: 'Saad (Websoul Admin)',
                    role: 'Administrator',
                  },
                  {
                    email: 'partner@websoul.tech',
                    password: 'AnotherStrongPassword2!',
                    name: 'Partner (Websoul Admin)',
                    role: 'Administrator',
                  },
                ];
              }

              const matchedAdmin = configuredAdmins.find(
                (a) => a.email.trim().toLowerCase() === normalized && String(a.password) === String(password)
              );

              if (matchedAdmin) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(
                  JSON.stringify({
                    success: true,
                    token: `websoul_dev_token_${Date.now()}_${Math.random().toString(36).substring(2)}`,
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
      authDevPlugin(env.ADMIN_USERS),
    ],
    server: {
      watch: {
        ignored: ['**/*.rar', '**/*.zip', '**/*.7z', '**/*.tar.gz', '**/.git/**']
      }
    }
  };
})

