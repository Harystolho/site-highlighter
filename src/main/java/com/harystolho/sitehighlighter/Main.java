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

//TODO add frame to see highlight in the page

//TODO add tag to document
//TODO add sort by tag
//TODO change document's name

//TODO add account/guest

//TODO add reminder
//TODO add calendar to remainder's doc

//TODO addon - filter which pages the highlight work/doesn't work

//TODO show error if site has csp

// https://just-comments.com/docs.html <- How to do authentication 

//
// Ask: What if I had to change this? What would break? How can I absctract this?
//