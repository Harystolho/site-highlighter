package com.harystolho.sitehighlighter.auth;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.Cookie;

import org.springframework.stereotype.Service;

import com.harystolho.sitehighlighter.model.Account;

@Service
public class CookieService {

	public static final String HIGHLIGHT_ID = "highlight_id";
	private static final int COOKIE_EXPIRATION = 60 * 60 * 24 * 7; // 7 DAYS

	// Cookie Identifier(value stored in the cookie), Account Id
	private ConcurrentHashMap<String, String> cookies;

	public CookieService() {
		cookies = new ConcurrentHashMap<>();

		// Temp
		cookies.put("6702e445eee7437a9f45271cf06bec64ad576e04d4c446d5b34624b16708417f", "123");
	}

	/**
	 * Binds {@link Cookie#getValue()} to an {@link Account#getId()}
	 * 
	 * @param id {@link Account#id}
	 * @return the {@link Cookie} that was created
	 */
	public Cookie createCookie(String id) {
		Cookie cookie = new Cookie(HIGHLIGHT_ID, generateCookieValue());
		cookie.setPath("/");
		cookie.setMaxAge(COOKIE_EXPIRATION);

		cookies.put(cookie.getValue(), id);

		return cookie;
	}

	public Optional<String> getAccountIdByCookie(Cookie[] cookies) {
		Optional<String> identifier = getSessionIdentifier(cookies);

		if (identifier.isPresent()) {
			return getAccountIdByIdentifier(identifier.get());
		} else {
			return Optional.empty();
		}
	}

	public Optional<String> getAccountIdByIdentifier(String identifier) {
		String accountId = cookies.get(identifier);

		if (accountId != null) {
			return Optional.of(accountId);
		}

		return Optional.empty();
	}

	/**
	 * At the moment the authentication token is basically the same thing as a
	 * cookie, the difference is that its value is sent in the 'Authentication'
	 * request header
	 * 
	 * @param token
	 * @return
	 */
	public Optional<String> getAccountIdByAuthenticationToken(String token) {
		return getAccountIdByIdentifier(token);
	}

	/**
	 * Session identifier is the value in the highlight cookie
	 * 
	 * @param cookies
	 * @return the session identifier if the user is logged in or an
	 *         {@link Optional#empty()} if he is not
	 */
	public Optional<String> getSessionIdentifier(Cookie[] cookies) {
		if (cookies == null)
			return Optional.empty();

		for (Cookie cookie : cookies) {
			if (cookie.getName().equals(HIGHLIGHT_ID)) {
				if (this.cookies.containsKey(cookie.getValue())) {
					return Optional.of(cookie.getValue());
				}
			}
		}

		return Optional.empty();
	}

	private String generateCookieValue() {
		// Generate a big string
		String cookieValue = (UUID.randomUUID().toString() + UUID.randomUUID().toString()).replaceAll("-", "");

		if (cookies.containsKey(cookieValue)) {
			return generateCookieValue();
		} else {
			return cookieValue;
		}
	}

}
