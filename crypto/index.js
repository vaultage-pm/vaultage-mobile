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

class Hash {

    update() {
        return this;
    }

    digest() {
        return Buffer.from("This is a test", "utf8");
    }
}

function createHash() {
    return new Hash();
}

function pbkdf2(password, salt, iterations, keylen, digest, callback) {
    NativeModules.Crypto.helloWorld("test", NativeModules.Crypto.SHORT);
    callback("not implemented");
}
    

module.exports = {
    createHash,
    pbkdf2
};
