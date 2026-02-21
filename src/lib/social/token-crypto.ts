/**
 * AES-256-CBC encryption for social media access tokens.
 * Tokens are stored encrypted in Supabase; decrypted only server-side at publish time.
 */

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-cbc';

function getKey(): Buffer {
  const secret = process.env.META_TOKEN_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('META_TOKEN_SECRET must be at least 32 characters');
  }
  // Hash to guarantee a uniform 32-byte key regardless of input encoding
  return createHash('sha256').update(secret, 'utf8').digest();
}

/** Encrypt a plaintext token. Returns "iv_hex:ciphertext_hex". */
export function encryptToken(plaintext: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

/** Decrypt an encrypted token string ("iv_hex:ciphertext_hex"). */
export function decryptToken(encrypted: string): string {
  const colonIdx = encrypted.indexOf(':');
  if (colonIdx === -1) throw new Error('Invalid encrypted token format');
  const ivHex = encrypted.slice(0, colonIdx);
  const ciphertextHex = encrypted.slice(colonIdx + 1);
  if (!ivHex || !ciphertextHex) {
    throw new Error('Invalid encrypted token format');
  }
  const iv = Buffer.from(ivHex, 'hex');
  const ciphertext = Buffer.from(ciphertextHex, 'hex');
  const decipher = createDecipheriv(ALGORITHM, getKey(), iv);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}
