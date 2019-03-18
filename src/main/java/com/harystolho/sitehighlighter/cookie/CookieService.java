package com.harystolho.sitehighlighter.cookie;

import java.util.UUID;

import javax.servlet.http.Cookie;

import org.springframework.stereotype.Service;

@Service
public class CookieService {

	private static final String HIGHLIGHT_ID = "highlight_id";
	private static final int COOKIE_EXPIRATION = 60 * 60 * 24 * 7; // 7 DAYS

	public Cookie createCookie(String id) {
		Cookie cookie = new Cookie(HIGHLIGHT_ID, UUID.randomUUID().toString());
		cookie.setPath("/");
		cookie.setMaxAge(COOKIE_EXPIRATION);

		return cookie;
	}

}
