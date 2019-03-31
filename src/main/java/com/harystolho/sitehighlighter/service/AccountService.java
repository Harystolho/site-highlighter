package com.harystolho.sitehighlighter.service;

import java.util.Optional;
import java.util.logging.Logger;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ValueConstants;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.harystolho.sitehighlighter.auth.AuthenticationService;
import com.harystolho.sitehighlighter.auth.CookieService;
import com.harystolho.sitehighlighter.dao.AccountDAO;
import com.harystolho.sitehighlighter.model.Account;
import com.harystolho.sitehighlighter.service.ServiceResponse.ServiceStatus;
import com.harystolho.sitehighlighter.utils.JsonResponse;

@Service
public class AccountService {

	private static final Logger logger = Logger.getLogger(AccountService.class.getName());

	private AccountDAO accountDao;
	private CookieService cookieService;
	private AuthenticationService authenticationService;

	@Autowired
	public AccountService(AccountDAO accountDao, CookieService cookieService,
			AuthenticationService authenticationService) {
		this.accountDao = accountDao;
		this.cookieService = cookieService;
		this.authenticationService = authenticationService;
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

	/**
	 * 
	 * @param res
	 * @param email
	 * @param password
	 * @param tempId   {@link AuthenticationService AuthenticationService read the
	 *                 documentation}
	 * @return
	 */
	public ServiceResponse<ObjectNode> signIn(HttpServletResponse res, String email, String password, String tempId) {
		ObjectNode node = new ObjectNode(new JsonNodeFactory(false));

		email = sanitizeEmail(email);

		Account account = accountDao.getAccountByEmailAndPassword(email, encryptPassword(password));

		if (account == null) {
			node.put("error", "INVALID_EMAIL_OR_PASSWORD");
			return ServiceResponse.of(node, ServiceStatus.FAIL);
		}

		Cookie cookie = cookieService.createCookie(account.getId());
		res.addCookie(cookie);

		if (tempId != ValueConstants.DEFAULT_NONE) {
			authenticationService.bindCookie(tempId, cookie);
		}

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

		// There is no account with this email
		if (account == null)
			return true;

		return false;
	}

	public ServiceResponse<String> createTemporaryId() {
		return ServiceResponse.of(authenticationService.generateId(), ServiceStatus.OK);
	}

	public ServiceResponse<ObjectNode> getTokenByTemporaryId(String temporaryId) {
		Optional<String> token = authenticationService.getAuthToken(temporaryId);

		if (token == null) {
			return ServiceResponse.of(JsonResponse.error("temporary-id is not valid"), ServiceStatus.FAIL);
		} else if (token.isPresent()) {
			return ServiceResponse.of(JsonResponse.object("token", token.get()), ServiceStatus.OK);
		} else {
			return ServiceResponse.of(null, ServiceStatus.PROCESSING);
		}
	}

}
