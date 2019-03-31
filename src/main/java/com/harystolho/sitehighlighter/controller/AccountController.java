package com.harystolho.sitehighlighter.controller;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.harystolho.sitehighlighter.auth.CookieService;
import com.harystolho.sitehighlighter.service.AccountService;
import com.harystolho.sitehighlighter.service.ServiceResponse;
import com.harystolho.sitehighlighter.utils.API_Response;

@RestController
public class AccountController {

	private AccountService accountService;

	@Autowired
	public AccountController(AccountService accountService) {
		this.accountService = accountService;
	}

	@PostMapping("/auth/signin")
	public API_Response signIn(HttpServletResponse res, @RequestParam(name = "email") String email,
			@RequestParam(name = "password") String password,
			@RequestParam(name = "temporary-id", required = false) String tempId) {
		ServiceResponse<ObjectNode> response = accountService.signIn(res, email, password, tempId);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", response.getResponse());
		default:
			return API_Response.of("OK", response.getResponse());
		}
	}

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

	@CrossOrigin
	@PostMapping("/auth/temporaryId")
	public ResponseEntity<Object> createTemporaryId() {
		ServiceResponse<String> response = accountService.createTemporaryId();

		switch (response.getStatus()) {
		case FAIL:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		default:
			return ResponseEntity.status(HttpStatus.OK).body(response.getResponse());
		}
	}

	@CrossOrigin
	@GetMapping("/auth/token/{temporaryId}")
	public ResponseEntity<Object> getTokenUsingTemporaryId(@PathVariable String temporaryId) {
		ServiceResponse<ObjectNode> response = accountService.getTokenByTemporaryId(temporaryId);

		switch (response.getStatus()) {
		case PROCESSING:
			return ResponseEntity.status(HttpStatus.ACCEPTED).build();
		case FAIL:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response.getResponse());
		default:
			return ResponseEntity.status(HttpStatus.OK).body(response.getResponse());
		}
	}

	/**
	 * If the user is already logged in, bind the cookie's value to the temporary id
	 * 
	 * @return
	 */
	@PostMapping("/auth/temporaryId/{tempId}/bind")
	public ResponseEntity<Object> bindCookieToTemporaryId(@CookieValue(CookieService.HIGHLIGHT_ID) String cookieValue,
			@PathVariable String tempId) {
		ServiceResponse<Object> response = accountService.bindTemporaryIdToCookie(cookieValue, tempId);
		switch (response.getStatus()) {
		case FAIL:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		default:
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		}
	}

}
