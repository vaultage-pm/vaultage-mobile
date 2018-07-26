package com.vaultage.crypto;


import android.util.Base64;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * This class proxies static APIs so we can easily mock them
 */
public class Utils {

    public String b64encode(byte[] bytes) {
        return Base64.encodeToString(bytes, Base64.DEFAULT);
    }

    public byte[] b64decode(String b64) {
        return Base64.decode(b64, Base64.DEFAULT);
    }

    public MessageDigest getSHA512() throws NoSuchAlgorithmException {
        return MessageDigest.getInstance("SHA-512");
    }
}
