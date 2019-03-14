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

//TODO show 'reload script' message on a modal instead of alert
//TODO add frame to see highlight in the page

//TODO add reminder

//TODO add tag to document
//TODO add sort by tag
//TODO change document's name
//TODO add calendar to remainder's doc

//TODO show error if site has csp

//TODO add account/guest

//TODO addon - key to turn on/off highlight addon
//TODO addon - filter which pages the highlight work/doesn't work

// https://just-comments.com/docs.html <- How to do authentication 



//
// Ask: What if I had to change this? What would break? How can I absctract this?
//