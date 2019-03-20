package com.harystolho.sitehighlighter.filter;

import java.io.IOException;
import java.util.Optional;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.harystolho.sitehighlighter.cookie.CookieService;

/**
 * Some pages requires the user to be logged in, this filter checks if the user
 * has the cookie before dispatching the request to the controller, if he
 * doesn't have it, he is redirected to the login page
 * 
 * @author Harystolho
 *
 */
@Component
public class CookieFilter extends AbstractFilter {

	private CookieService cookieService;

	@Autowired
	public CookieFilter(CookieService cookieService) {
		this.cookieService = cookieService;
	}

	@Override
	public void doFilter(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		String origin = req.getHeader("origin");

		if (origin == null) { // Request from page-highlight.com
			handleSameOriginRequest(req, res, chain);
		} else { // Request from another origin/page
			handlerCrossOriginRequest(req, res, chain);
		}
	}

	private void handleSameOriginRequest(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		Optional<String> accountId = cookieService.getAccountIdByCookie(req.getCookies());

		if (accountId.isPresent()) { // User is logged in
			// Set the accountId for the controllers to use
			req.setAttribute("highlight.accountId", accountId.get());

			chain.doFilter(req, res);
		} else { // User is not logged in
			res.sendRedirect("/auth");
		}
	}

	/**
	 * CrossOrigin requests use an authentication token to identify the users
	 * 
	 * @param req
	 * @param res
	 * @param chain
	 * @throws IOException
	 * @throws ServletException
	 */
	private void handlerCrossOriginRequest(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		String authHeader = req.getHeader("Authorization");

		if (authHeader != null) {
			req.setAttribute("highlight.accountId", "123"); // TODO
			chain.doFilter(req, res);
		} else {
			// Allow other origins to read the response
			res.addHeader("Access-Control-Allow-Origin", "*");

			// Before making a CORS request the browser will send a OPTIONS request to know
			// what headers and origins are allowed
			if (req.getMethod().equals("OPTIONS")) {
				res.addHeader("Access-Control-Allow-Headers", "authorization");
			} else {
				res.sendError(401); // = Unauthorized
			}

		}
	}
}
