package com.harystolho.sitehighlighter.service;

import java.util.logging.Logger;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.harystolho.sitehighlighter.cookie.CookieService;
import com.harystolho.sitehighlighter.dao.AccountDAO;
import com.harystolho.sitehighlighter.model.Account;
import com.harystolho.sitehighlighter.service.ServiceResponse.ServiceStatus;

@Service
public class AccountService {

	private static final Logger logger = Logger.getLogger(AccountService.class.getName());

	private AccountDAO accountDao;
	private CookieService cookieService;

	@Autowired
	public AccountService(AccountDAO accountDao, CookieService cookieService) {
		this.accountDao = accountDao;
		this.cookieService = cookieService;
	}

	public ServiceResponse<ObjectNode> signUp(String email, String password) {
		ObjectNode node = new ObjectNode(new JsonNodeFactory(false));

		email = sanitizeEmail(email);

		if (!isPasswordValid(password)) {
			node.put("error", "INVALID_PASSWORD");
			return ServiceResponse.of(node, ServiceStatus.FAIL);
		}

		if (!isEmailValid(email)) {
			node.put("error", "INVALID_EMAIL");
			return ServiceResponse.of(node, ServiceStatus.FAIL);
		}

		if (!isEmailUnique(email)) {
			node.put("error", "EMAIL_ALREADY_EXISTS");
			return ServiceResponse.of(node, ServiceStatus.FAIL);
		}

		Account account = new Account(email, encryptPassword(password));

		accountDao.save(account);

		return ServiceResponse.of(node, ServiceStatus.OK);
	}

	public ServiceResponse<ObjectNode> signIn(HttpServletResponse res, String email, String password) {
		ObjectNode node = new ObjectNode(new JsonNodeFactory(false));

		email = sanitizeEmail(email);

		Account account = accountDao.getAccountByEmailAndPassword(email, encryptPassword(password));

		if (account == null) {
			node.put("error", "INVALID_EMAIL_OR_PASSWORD");
			return ServiceResponse.of(node, ServiceStatus.FAIL);
		}

		res.addCookie(cookieService.createCookie(account.getId()));

		return ServiceResponse.of(node, ServiceStatus.OK);
	}

	/**
	 * Standardizes the email. Make it lower case so it's easier to find accounts by
	 * email on the database
	 * 
	 * @param email
	 * @return
	 */
	private String sanitizeEmail(String email) {
		return email.trim().toLowerCase();
	}

	private boolean isEmailValid(String email) {
		return true;
	}

	private boolean isPasswordValid(String password) {
		if (password.trim().length() < 6)
			return false;

		return true;
	}

	private String encryptPassword(String former) {
		return String.valueOf(former.hashCode());
	}

	private boolean isEmailUnique(String email) {
		Account account = accountDao.getAccountByEmail(email);

		// There is not account with this email
		if (account == null)
			return true;

		return false;
	}

}
