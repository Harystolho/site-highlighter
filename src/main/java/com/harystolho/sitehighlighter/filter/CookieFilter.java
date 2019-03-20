package com.harystolho.sitehighlighter.filter;

import java.io.IOException;

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
		
		req.setAttribute("highlight.identifier", "123");
		
		cookieService.getSessionIdentifier(req.getCookies());
		
		if (cookieService.isUserLoggedIn(req.getCookies())) {
			chain.doFilter(req, res);
		} else {
			Cookie cookie = cookieService.createCookie("123abc");
			res.addCookie(cookie);
			// res.addHeader("P3P", "CP=\"NOI DSP COR NID CURa ADMa DEVa PSAa PSDa OUR BUS
			// COM INT OTC PUR STA\"");
		}
	}
}
