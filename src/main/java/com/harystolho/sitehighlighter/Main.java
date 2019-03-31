package com.harystolho.sitehighlighter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {

	static {
		System.setProperty("user.timezone", "UTC");
	}

	public static void main(String[] args) {
		SpringApplication.run(Main.class, args);
	}
}

//TODO if when user go to /auth to authenticate the cookie is valid return a token

//TODO change document's name

//TODO options - add option to choose modal z-index

//TODO add reminder
//TODO add calendar to remainder's doc

//TODO addon - filter which pages the highlight work/doesn't work

//TODO show error if site has csp

//TODO replate API_REsponse wih REsponseEntity			

// https://just-comments.com/docs.html <- How to do authentication 

//
// Ask: What if I had to change this? What would break? How can I abstract this?
//