package com.vaultage.crypto;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.security.InvalidKeyException;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

class CryptoModule extends ReactContextBaseJavaModule {

    private Utils utils;

    CryptoModule(ReactApplicationContext reactContext, Utils utils) {
        super(reactContext);
        this.utils = utils;
    }

    @Override
    public String getName() {
        return "Crypto";
    }

    @Override
    public Map<String, Object> getConstants() {
        return new HashMap<>();
    }

    @ReactMethod
    public void sha512(String message, Promise ret) {
        try {
            MessageDigest digest = utils.getSHA512();
            digest.update(message.getBytes());
            ret.resolve(utils.b64encode(digest.digest()));
        } catch (NoSuchAlgorithmException e) {
            ret.reject(e);
        }
    }

    @ReactMethod
    public void pbkdf2(String b64Plain, String b64Key, Integer count, Integer length, String hash, Promise ret) {
        if (!hash.equals("sha256") || length != 32) {
            ret.reject(new Exception("Invalid argument"));
        }

        try {
            char[] plain = new String(utils.b64decode(b64Plain), "UTF-8").toCharArray();
            byte[] key = utils.b64decode(b64Key);

            SecretKeyFactory fact = SecretKeyFactory.getInstance("PBKDF2withHmacSHA256");
            PBEKeySpec spec = new PBEKeySpec(plain, key, count, length);

            String result = utils.b64encode(fact.generateSecret(spec).getEncoded());

            ret.resolve(result);
        } catch (NoSuchAlgorithmException e) {
            // Falls back to the java implementation below
        } catch (Throwable e) {
            ret.reject(e);
            return;
        }

        try {
            ret.resolve(do_pbkdf2(b64Plain, b64Key, count, length));
        } catch (Exception e) {
            ret.reject(e);
        }
    }

    private String do_pbkdf2(String b64Plain, String b64Key, Integer count, Integer length) throws NoSuchAlgorithmException, InvalidKeyException {
        if (length <= 0 || count < 0 || length % 32 != 0) {
            throw new IllegalArgumentException("invalid params to pbkdf2");
        }

        byte[] password = utils.b64decode(b64Plain);
        byte[] salt = utils.b64decode(b64Key);

        byte[] out = new byte[length];
        byte[] total = new byte[salt.length + 4];
        System.arraycopy(salt, 0, total, 0, salt.length);
        for (int k = 1; 32 * (k - 1) < length; k++) {
            total[salt.length] = (byte)((k >> 24) & 0xff);
            total[salt.length + 1] = (byte)((k >> 16) & 0xff);
            total[salt.length + 2] = (byte)((k >> 8) & 0xff);
            total[salt.length + 3] = (byte)(k & 0xff);
            byte[] u = pbkdf2Prff(password, total);
            byte[] ui = u;

            for (int i = 1; i < count; i++) {
                ui = pbkdf2Prff(password, ui);
                for (int j = 0; j < ui.length; j++) {
                    u[j] ^= ui[j];
                }
            }
            System.arraycopy(u, 0, out, (k - 1) * u.length, u.length);
        }

        return utils.b64encode(out);
    }

    private byte[] pbkdf2Prff(byte[] password, byte[] message) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac mac = Mac.getInstance("HmacSHA256");
        Key k = new SecretKeySpec(password, "HmacSHA256");
        mac.init(k);
        return mac.doFinal(message);
    }
}
