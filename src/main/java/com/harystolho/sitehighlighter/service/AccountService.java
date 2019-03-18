package com.harystolho.sitehighlighter.service;

import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.harystolho.sitehighlighter.dao.AccountDAO;
import com.harystolho.sitehighlighter.service.ServiceResponse.ServiceStatus;

@Service
public class AccountService {

	private static final Logger logger = Logger.getLogger(AccountService.class.getName());

	private String EMAIL_REGEX = "/^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/";

	private AccountDAO accountDao;

	@Autowired
	public AccountService(AccountDAO accountDao) {
		this.accountDao = accountDao;
	}

	public ServiceResponse<ObjectNode> signUp(HttpServletRequest req, String email, String password) {
		ObjectNode node = new ObjectNode(new JsonNodeFactory(false));

		if (!isPasswordValid(password)) {
			node.put("error", "INVALID_PASSWORD");
			return ServiceResponse.of(node, ServiceStatus.FAIL);
		}

		if (!isEmailValid(email)) {
			node.put("error", "INVALID_EMAIL");
			return ServiceResponse.of(node, ServiceStatus.FAIL);
		}

		return null;
	}

	private boolean isEmailValid(String email) {
		//TODO check if email is valid
		return true;
	}

	private boolean isPasswordValid(String password) {
		if (password.trim().length() < 6)
			return false;

		return true;
	}

}
