import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function authDevPlugin(): Plugin {
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
              if (normalized === 'websoul.tech859@gmail.com' && String(password) === 'S@@d1234') {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(
                  JSON.stringify({
                    success: true,
                    token: `ws_dev_token_${Date.now()}_${Math.random().toString(36).substring(2)}`,
                    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
                    user: {
                      email: normalized,
                      name: 'Saad (WebSoul Admin)',
                      role: 'Administrator',
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
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    authDevPlugin(),
  ],
  server: {
    watch: {
      ignored: ['**/*.rar', '**/*.zip', '**/*.7z', '**/*.tar.gz', '**/.git/**']
    }
  }
})

