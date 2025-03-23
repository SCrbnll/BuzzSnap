package scg;

import java.math.BigInteger;
import java.security.MessageDigest;

public class Utils {
	public static String sha1(String passwd) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-1");
			digest.reset();
			digest.update(passwd.getBytes("utf8"));
			return String.format("%040x", new BigInteger(1, digest.digest()));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}


