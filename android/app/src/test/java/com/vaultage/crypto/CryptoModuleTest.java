package com.vaultage.crypto;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;

import org.easymock.EasyMock;
import org.easymock.IMocksControl;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.security.NoSuchAlgorithmException;

import static org.easymock.EasyMock.anyObject;
import static org.easymock.EasyMock.expect;
import static org.easymock.EasyMock.expectLastCall;
import static org.easymock.EasyMock.mock;


// Note: These tests are pretty useless given that we have to mock the primitives

public class CryptoModuleTest {

    private CryptoModule testSubject;
    private IMocksControl control;
    private Utils utils;
    private Utils realUtils = new Utils();

    @Before
    public void setup() {
        control = EasyMock.createStrictControl();
        utils = control.createMock(Utils.class);
        testSubject = new CryptoModule(mock(ReactApplicationContext.class), utils);
    }

    @After
    public void teardown() {
        control.verify();
    }

    @Test
    public void testSha512Correct() throws Exception {
        Promise p = control.createMock(Promise.class);
        expect(utils.getSHA512()).andReturn(realUtils.getSHA512());
        expect(utils.b64encode(new byte[] {(byte) 0x39, (byte) 0x78, (byte) 0xbc, (byte) 0x51, (byte) 0xef, (byte) 0x05, (byte) 0xf4, (byte) 0x5b, (byte) 0x19, (byte) 0xa7, (byte) 0xcb, (byte) 0x39, (byte) 0xc8, (byte) 0x42, (byte) 0xdd, (byte) 0x44, (byte) 0x9e, (byte) 0x4b, (byte) 0x2b, (byte) 0xa3, (byte) 0x0c, (byte) 0xd1, (byte) 0x3e, (byte) 0xa6, (byte) 0x7a, (byte) 0xa7, (byte) 0x31, (byte) 0xf5, (byte) 0x9b, (byte) 0xd6, (byte) 0x3c, (byte) 0x7d, (byte) 0x7d, (byte) 0x35, (byte) 0x91, (byte) 0xca, (byte) 0x35, (byte) 0xb5, (byte) 0x91, (byte) 0x8c, (byte) 0xcb, (byte) 0x33, (byte) 0x3f, (byte) 0xdc, (byte) 0x8c, (byte) 0x58, (byte) 0xfd, (byte) 0x4b, (byte) 0xcc, (byte) 0x99, (byte) 0x78, (byte) 0x3d, (byte) 0x55, (byte) 0xc2, (byte) 0x80, (byte) 0x65, (byte) 0x45, (byte) 0x50, (byte) 0x55, (byte) 0xcb, (byte) 0xad, (byte) 0x38, (byte) 0x2d, (byte) 0x93, }))
                .andReturn("Mzk3OGJjNTFlZjA1ZjQ1YjE5YTdjYjM5Yzg0MmRkNDQ5ZTRiMmJhMzBjZDEzZWE2N2FhNzMxZjU5YmQ2M2M3ZDdkMzU5MWNhMzViNTkxOGNjYjMzM2ZkYzhjNThmZDRiY2M5OTc4M2Q1NWMyODA2NTQ1NTA1NWNiYWQzODJkOTM=");
        p.resolve("Mzk3OGJjNTFlZjA1ZjQ1YjE5YTdjYjM5Yzg0MmRkNDQ5ZTRiMmJhMzBjZDEzZWE2N2FhNzMxZjU5YmQ2M2M3ZDdkMzU5MWNhMzViNTkxOGNjYjMzM2ZkYzhjNThmZDRiY2M5OTc4M2Q1NWMyODA2NTQ1NTA1NWNiYWQzODJkOTM=");
        expectLastCall();

        control.replay();

        testSubject.sha512("thisismytest", p);
    }

    @Test
    public void testSha512Error() throws Exception {
        Promise p = control.createMock(Promise.class);
        expect(utils.getSHA512()).andThrow(new NoSuchAlgorithmException("error"));
        p.reject(anyObject(NoSuchAlgorithmException.class));
        expectLastCall();

        control.replay();

        testSubject.sha512("thisismytest", p);
    }
}