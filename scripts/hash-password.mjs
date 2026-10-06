#!/usr/bin/env node
import crypto from 'crypto';

const password = process.argv[2];
if (!password) {
  console.log('Usage: node scripts/hash-password.mjs <your-password>');
  console.log('Example: node scripts/hash-password.mjs MySecurePassword123!');
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString('hex');
const derivedKey = crypto.scryptSync(password, salt, 64);
const hash = `scrypt:${salt}:${derivedKey.toString('hex')}`;

console.log('\nGenerated Cryptographic Password Hash:');
console.log(hash);
console.log('\nUse this in .env.local or Vercel environment variables:');
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
console.log('or in ADMIN_USERS: [{"email":"admin@websoul.tech","passwordHash":"' + hash + '",...}]\n');
