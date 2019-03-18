package com.harystolho.sitehighlighter.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.service.AccountService;
import com.harystolho.sitehighlighter.service.DocumentService;
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
	public API_Response signIn(HttpServletRequest req, HttpServletResponse res,
			@RequestParam(name = "email") String email, @RequestParam(name = "password") String password) {

		ServiceResponse<ObjectNode> response = accountService.signIn(req, email, password);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", response.getResponse());
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

	@ResponseBody
	@PostMapping("/auth/signup")
	public API_Response signUp(HttpServletRequest req, @RequestParam(name = "email") String email,
			@RequestParam(name = "password") String password) {

		ServiceResponse<ObjectNode> response = accountService.signUp(req, email, password);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", response.getResponse());
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

}
