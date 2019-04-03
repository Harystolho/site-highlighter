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

//TODO fix highlight selection bg color on script
//TODO if an alert is shown when the modal is open the alert closes the modal

//TODO save is user chose guest or account for some time
//TODO option to choose account if the user has chosen guest and otherwise

//TODO options - add option to choose modal z-index

//TODO addon - filter which pages the highlight work/doesn't work

//TODO show error if site has csp

//TODO add reminder
//TODO add calendar to remainder's doc


// https://just-comments.com/docs.html <- How to do authentication 

//
// Ask: What if I had to change this? What would break? How can I abstract this?
//