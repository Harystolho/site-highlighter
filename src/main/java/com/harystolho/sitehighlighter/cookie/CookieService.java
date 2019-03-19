package com.harystolho.sitehighlighter.cookie;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.Cookie;

import org.springframework.stereotype.Service;

import com.harystolho.sitehighlighter.model.Account;

@Service
public class CookieService {

	public static final String HIGHLIGHT_ID = "highlight_id";
	private static final int COOKIE_EXPIRATION = 60 * 60 * 24 * 7; // 7 DAYS

	// Cookie Identifier, Account Id
	private ConcurrentHashMap<String, String> cookies;

	public CookieService() {
		cookies = new ConcurrentHashMap<>();
	}

	/**
	 * Binds the {@link Cookie}'s value to an {@link Account#getId()}
	 * 
	 * @param id {@link Account#id}
	 * @return
	 */
	public Cookie createCookie(String id) {
		Cookie cookie = new Cookie(HIGHLIGHT_ID, UUID.randomUUID().toString());
		cookie.setPath("/");
		cookie.setMaxAge(COOKIE_EXPIRATION);

		cookies.put(cookie.getValue(), id);

		return cookie;
	}

	public String getAccountId(Cookie cookie) {
		return cookies.get(cookie.getValue());
	}

	public boolean isUserLoggedIn(Cookie[] cookies) {
		if (cookies == null)
			return false;

		for (Cookie cookie : cookies) {
			if (cookie.getName().equals(HIGHLIGHT_ID)) {
				if (this.cookies.containsKey(cookie.getValue())) {
					return true;
				}
			}
		}

		return false;
	}

}
