/**
 * This exposes the native ToastExample module as a JS module. This has a
 * function 'show' which takes the following parameters:
 *
 * 1. String message: A string with the text to toast
 * 2. int duration: The duration of the toast. May be ToastExample.SHORT or
 *    ToastExample.LONG
 */
import { NativeModules } from 'react-native';
import { Buffer } from 'buffer';
import * as sjcl from 'vaultage-client/lib/sjcl';

class Hash {

    private _data = '';

    update(data: string) {
        this._data += data;
        return this;
    }

    digest() {
        return Buffer.from(sjcl.codec.hex.fromBits(sjcl.hash.sha512.hash(this._data)), 'hex');
    }
}

export function createHash() {
    return new Hash();
}

export async function pbkdf2(password: Buffer, salt: Buffer, iterations: number, keylen: number, digest: string, callback: (err: any, res?: any) => void) {
    try {
        const result = await NativeModules.Crypto.pbkdf2(
            password.toString('base64'),
            salt.toString('base64'),
            iterations,
            keylen,
            digest);
        callback(null, Buffer.from(result, "base64"));
    } catch (e) {
        callback(e);
    }
}

export function createDecipheriv(algorithm: string, key: any, iv: any, options?: any): Decipher {
    throw new Error("Invalid IV length");
}

export function createCipheriv(algorithm: string, key: any, iv: any, options?: any): Cipher {
    throw new Error("Invalid IV length");
}
