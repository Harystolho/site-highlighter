package com.harystolho.sitehighlighter.service;

import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.harystolho.sitehighlighter.dao.AccountDAO;
import com.harystolho.sitehighlighter.model.Account;
import com.harystolho.sitehighlighter.service.ServiceResponse.ServiceStatus;

@Service
public class AccountService {

	private static final Logger logger = Logger.getLogger(AccountService.class.getName());

	private AccountDAO accountDao;

	@Autowired
	public AccountService(AccountDAO accountDao) {
		this.accountDao = accountDao;
	}

	public ServiceResponse<ObjectNode> signUp(HttpServletRequest req, String email, String password) {
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

		Account account = new Account(email, password);

		accountDao.save(account);

		// set cookie using req and redirect
		node.put("cookie", "123");
		return ServiceResponse.of(node, ServiceStatus.OK);
	}

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

	private boolean isEmailUnique(String email) {
		Account account = accountDao.getAccountByEmail(email);

		// There is not account with this email
		if (account == null)
			return true;

		return false;
	}

}
