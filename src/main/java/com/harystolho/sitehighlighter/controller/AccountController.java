package com.harystolho.sitehighlighter.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import com.harystolho.sitehighlighter.utils.API_Response;

@Controller
public class AccountController {

	@GetMapping(path = { "/auth", "/login", "/register" })
	public String authPage() {
		return "auth";
	}
	
	@PostMapping("/auth/signin")
	public API_Response signIn() {
		
	}

}
