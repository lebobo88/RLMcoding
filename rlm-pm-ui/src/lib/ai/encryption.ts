// API Key Encryption Module
// Uses AES-256-GCM for encrypting API keys stored in SQLite

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 16;

// Get or create encryption key
function getEncryptionKey(): Buffer {
  const configDir = join(homedir(), ".rlm-pm-ui");
  const keyFile = join(configDir, ".encryption-key");

  // Ensure config directory exists
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true, mode: 0o700 });
  }

  // Check for existing key
  if (existsSync(keyFile)) {
    try {
      const keyData = readFileSync(keyFile, "utf-8");
      const { salt, key } = JSON.parse(keyData);
      return Buffer.from(key, "hex");
    } catch {
      // Invalid key file, generate new one
    }
  }

  // Generate new key
  const salt = randomBytes(SALT_LENGTH);

  // Use machine-specific data if available, otherwise random
  let machineId: string;
  try {
    // Try to get machine ID from various sources
    if (process.platform === "win32") {
      machineId = process.env.COMPUTERNAME || randomBytes(32).toString("hex");
    } else {
      machineId = existsSync("/etc/machine-id")
        ? readFileSync("/etc/machine-id", "utf-8").trim()
        : randomBytes(32).toString("hex");
    }
  } catch {
    machineId = randomBytes(32).toString("hex");
  }

  // Derive key from machine ID and salt
  const key = scryptSync(machineId, salt, KEY_LENGTH);

  // Save key data
  writeFileSync(
    keyFile,
    JSON.stringify({
      salt: salt.toString("hex"),
      key: key.toString("hex"),
    }),
    { mode: 0o600 }
  );

  return key;
}

// Encrypt a string
export function encrypt(plaintext: string): string {
  if (!plaintext) return "";

  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  // Return IV + AuthTag + Encrypted data as hex
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

// Decrypt a string
export function decrypt(ciphertext: string): string {
  if (!ciphertext) return "";

  try {
    const key = getEncryptionKey();
    const parts = ciphertext.split(":");

    if (parts.length !== 3) {
      throw new Error("Invalid ciphertext format");
    }

    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
}

// Securely compare two strings (constant-time)
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Mask API key for display (show last 4 chars)
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) return "****";
  return `${"*".repeat(apiKey.length - 4)}${apiKey.slice(-4)}`;
}

// Securely overwrite a string in memory (best effort)
export function secureWipe(str: string): void {
  // In JavaScript, we can't truly wipe memory, but we can at least
  // trigger garbage collection by removing references
  // This is a best-effort approach
  if (typeof str === "string") {
    // Create a new string reference to potentially trigger GC on the old one
    str = "";
  }
}
