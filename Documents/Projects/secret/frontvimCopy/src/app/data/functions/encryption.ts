import * as CryptoJS from 'crypto-js';
import { environment } from '@env/environment';

/**
 * Encrypt an object
 * @param {any} data: objec to to encrypt. The object can be any content
 * @returns {string} encrypted data
 */
export function encryptObj(data: any): string {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), environment.ENCRYPT_SECRET_KEY).toString();
  } catch (e) {
    return '';
  }
}

/**
 * Decrypt an object
 * @param {string} data encrypted object
 * @returns {any} decrypted object (json format)
 */
export function decryptObj(data: any): any {
  try {
    const bytes = CryptoJS.AES.decrypt(data, environment.ENCRYPT_SECRET_KEY);
    if (bytes.toString()) {
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    return data;
  } catch (e) {
    return null;
  }
}