import { Injectable } from '@angular/core';

/**
 * Cryptographic utilities for security operations
 * - Secure secret generation for TOTP
 * - TOTP (RFC 6238) code generation using HMAC-SHA1
 * 
 * Note: For production use, integrate a library like:
 * - speakeasy (https://github.com/speakeasyjs/speakeasy)
 * - otplib (https://github.com/yeojz/otplib)
 */
@Injectable({ providedIn: 'root' })
export class CryptoService {
  /**
   * Generate a cryptographically secure secret for TOTP
   * Returns base32-encoded string (32 characters = 160 bits)
   * Meets NIST recommendations for OTP secrets
   */
  generateSecureSecret(): string {
    const array = new Uint8Array(20); // 160 bits
    crypto.getRandomValues(array);
    return this.base32Encode(array);
  }

  /**
   * Generate TOTP code synchronously using HMAC-SHA1
   * Implements RFC 6238 Time-based One-Time Password algorithm
   * 
   * IMPORTANT: This implementation uses a simplified HMAC-SHA1.
   * For production, use a battle-tested library like speakeasy or otplib.
   */
  generateTOTPSync(secret: string, timeCounter: number): string {
    const key = this.base32Decode(secret);
    const counterBytes = new Uint8Array(8);
    
    // Convert time counter to 8-byte big-endian format
    let counter = timeCounter;
    for (let i = 7; i >= 0; i--) {
      counterBytes[i] = counter & 0xff;
      counter >>= 8;
    }

    // Generate HMAC-SHA1
    const hmacBytes = this.hmacSHA1(key, counterBytes);

    // Extract dynamic binary code (RFC 6238)
    const offset = hmacBytes[hmacBytes.length - 1] & 0xf;
    const code =
      ((hmacBytes[offset] & 0x7f) << 24) |
      ((hmacBytes[offset + 1] & 0xff) << 16) |
      ((hmacBytes[offset + 2] & 0xff) << 8) |
      (hmacBytes[offset + 3] & 0xff);

    const totpCode = (code % 1000000).toString();
    return totpCode.padStart(6, '0');
  }

  /**
   * HMAC-SHA1 implementation based on RFC 2104
   * Key derivation and message authentication code generation
   */
  private hmacSHA1(key: Uint8Array, message: Uint8Array): Uint8Array {
    const BLOCK_SIZE = 64;
    const OUTPUT_SIZE = 20; // SHA-1 output is 160 bits

    // Adjust key if needed
    let processedKey = key;
    if (key.length > BLOCK_SIZE) {
      processedKey = this.sha1(key);
    }
    if (processedKey.length < BLOCK_SIZE) {
      const padded = new Uint8Array(BLOCK_SIZE);
      padded.set(processedKey);
      processedKey = padded;
    }

    // Create ipad and opad
    const ipad = new Uint8Array(BLOCK_SIZE);
    const opad = new Uint8Array(BLOCK_SIZE);
    for (let i = 0; i < BLOCK_SIZE; i++) {
      ipad[i] = processedKey[i] ^ 0x36;
      opad[i] = processedKey[i] ^ 0x5c;
    }

    // Compute HMAC
    const innerMessage = new Uint8Array(BLOCK_SIZE + message.length);
    innerMessage.set(ipad);
    innerMessage.set(message, BLOCK_SIZE);
    const innerHash = this.sha1(innerMessage);

    const outerMessage = new Uint8Array(BLOCK_SIZE + OUTPUT_SIZE);
    outerMessage.set(opad);
    outerMessage.set(innerHash, BLOCK_SIZE);

    return this.sha1(outerMessage);
  }

  /**
   * SHA-1 implementation (RFC 3174)
   * Cryptographic hash function producing 160-bit hash value
   * 
   * IMPORTANT: SHA-1 is cryptographically broken for collisions.
   * This is used only for TOTP (RFC 6238), which is the standard.
   * Use SHA-256 or better for other cryptographic purposes.
   */
  private sha1(data: Uint8Array): Uint8Array {
    // SHA-1 constants
    const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
    const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

    // Pre-processing: adding padding bits
    const msg = new Uint8Array(((data.length + 8) >>> 6 << 9) + 512);
    msg.set(data);
    msg[data.length] = 0x80;

    // Append length in bits
    const bits = data.length * 8;
    for (let t = 8; t > 0; t -= 4) {
      msg[msg.length - t] = (bits >>> (t - 4) * 8) & 0xff;
    }

    // Process message in 512-bit chunks
    for (let i = 0; i < msg.length; i += 64) {
      this.sha1ProcessBlock(msg.subarray(i, i + 64), H, K);
    }

    // Convert hash to byte array
    const result = new Uint8Array(20);
    for (let i = 0; i < 5; i++) {
      result[i * 4] = (H[i] >>> 24) & 0xff;
      result[i * 4 + 1] = (H[i] >>> 16) & 0xff;
      result[i * 4 + 2] = (H[i] >>> 8) & 0xff;
      result[i * 4 + 3] = H[i] & 0xff;
    }

    return result;
  }

  /**
   * SHA-1 block processor
   */
  private sha1ProcessBlock(block: Uint8Array, H: number[], K: number[]): void {
    const W = new Array(80);

    // Break chunk into sixteen 32-bit big-endian words
    for (let t = 0; t < 16; t++) {
      W[t] =
        ((block[t * 4] << 24) |
          (block[t * 4 + 1] << 16) |
          (block[t * 4 + 2] << 8) |
          block[t * 4 + 3]) >>>
        0;
    }

    // Extend the sixteen 32-bit words into eighty 32-bit words
    for (let t = 16; t < 80; t++) {
      W[t] = this.rol32(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
    }

    let A = H[0];
    let B = H[1];
    let C = H[2];
    let D = H[3];
    let E = H[4];

    // Main loop
    for (let t = 0; t < 80; t++) {
      let temp: number;
      if (t < 20) {
        temp = this.add32(
          this.add32(
            this.add32(
              this.add32(this.rol32(A, 5), (B & C) | (~B & D)),
              E
            ),
            K[0]
          ),
          W[t]
        );
        E = D;
        D = C;
        C = this.rol32(B, 30);
        B = A;
        A = temp;
      } else if (t < 40) {
        temp = this.add32(
          this.add32(this.add32(this.add32(this.rol32(A, 5), B ^ C ^ D), E), K[1]),
          W[t]
        );
        E = D;
        D = C;
        C = this.rol32(B, 30);
        B = A;
        A = temp;
      } else if (t < 60) {
        temp = this.add32(
          this.add32(
            this.add32(
              this.add32(this.rol32(A, 5), (B & C) | (B & D) | (C & D)),
              E
            ),
            K[2]
          ),
          W[t]
        );
        E = D;
        D = C;
        C = this.rol32(B, 30);
        B = A;
        A = temp;
      } else {
        temp = this.add32(
          this.add32(this.add32(this.add32(this.rol32(A, 5), B ^ C ^ D), E), K[3]),
          W[t]
        );
        E = D;
        D = C;
        C = this.rol32(B, 30);
        B = A;
        A = temp;
      }
    }

    // Add this chunk's hash to result so far
    H[0] = this.add32(H[0], A);
    H[1] = this.add32(H[1], B);
    H[2] = this.add32(H[2], C);
    H[3] = this.add32(H[3], D);
    H[4] = this.add32(H[4], E);
  }

  /**
   * 32-bit left rotate
   */
  private rol32(x: number, n: number): number {
    return ((x << n) | (x >>> (32 - n))) >>> 0;
  }

  /**
   * 32-bit addition with overflow handling
   */
  private add32(a: number, b: number): number {
    return ((a + b) >>> 0);
  }

  /**
   * Base32 encode (RFC 4648)
   * Used for TOTP secret representation
   */
  private base32Encode(bytes: Uint8Array): string {
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    let bits = 0;
    let value = 0;

    for (let i = 0; i < bytes.length; i++) {
      value = (value << 8) | bytes[i];
      bits += 8;

      while (bits >= 5) {
        bits -= 5;
        result += base32Chars[(value >> bits) & 31];
      }
    }

    if (bits > 0) {
      result += base32Chars[(value << (5 - bits)) & 31];
    }

    // Add padding
    while (result.length % 8 !== 0) {
      result += '=';
    }

    return result;
  }

  /**
   * Base32 decode (RFC 4648)
   * Converts TOTP secret back to bytes
   */
  private base32Decode(input: string): Uint8Array {
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const normalized = input.replace(/=+$/, '').toUpperCase();
    let bits = 0;
    let value = 0;
    const result = [];

    for (let i = 0; i < normalized.length; i++) {
      const index = base32Chars.indexOf(normalized[i]);
      if (index === -1) {
        throw new Error(`Invalid base32 character: ${normalized[i]}`);
      }

      value = (value << 5) | index;
      bits += 5;

      if (bits >= 8) {
        bits -= 8;
        result.push((value >> bits) & 0xff);
      }
    }

    return new Uint8Array(result);
  }
}

