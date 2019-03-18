package com.harystolho.sitehighlighter.controller;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.harystolho.sitehighlighter.service.AccountService;
import com.harystolho.sitehighlighter.service.ServiceResponse;
import com.harystolho.sitehighlighter.utils.API_Response;

@Controller
public class AccountController {

	private AccountService accountService;

	@Autowired
	public AccountController(AccountService accountService) {
		this.accountService = accountService;
	}

	@GetMapping(path = { "/auth", "/login", "/register" })
	public String authPage() {
		return "auth";
	}

	@ResponseBody
	@PostMapping("/auth/signin")
	public API_Response signIn(HttpServletResponse res, @RequestParam(name = "email") String email,
			@RequestParam(name = "password") String password) {

		ServiceResponse<ObjectNode> response = accountService.signIn(res, email, password);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", response.getResponse());
		default:
			return API_Response.of("OK", response.getResponse());
		}
	}

	@ResponseBody
	@PostMapping("/auth/signup")
	public API_Response signUp(@RequestParam(name = "email") String email,
			@RequestParam(name = "password") String password) {

		ServiceResponse<ObjectNode> response = accountService.signUp(email, password);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", response.getResponse());
		default:
			return API_Response.of("OK", response.getResponse());
		}
	}

}
